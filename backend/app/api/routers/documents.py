import os
import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db, require_role
from app.crud.documents import create_document, list_documents_for_application
from app.models.application import Application
from app.schemas.document import DocumentPublic
from app.schemas.application import ApplicationPublic

router = APIRouter(prefix="/documents", tags=["documents"])

UPLOAD_DIR = Path(__file__).resolve().parents[4] / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@router.get("/application/{application_id}", response_model=list[DocumentPublic])
def get_application_documents(
    application_id: int,
    db: Session = Depends(get_db),
    _user=Depends(get_current_user),
) -> list[DocumentPublic]:
    return list_documents_for_application(db, application_id)


@router.post("/upload", response_model=DocumentPublic)
def upload_document(
    application_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user=Depends(require_role("student")),
) -> DocumentPublic:
    application = db.query(Application).filter(Application.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    if application.student_id != current_user.id:
        raise HTTPException(status_code=403, detail="Cannot upload for this application")

    extension = Path(file.filename).suffix
    safe_name = f"{uuid.uuid4().hex}{extension}"
    file_path = UPLOAD_DIR / safe_name

    with file_path.open("wb") as buffer:
        buffer.write(file.file.read())

    url = f"/uploads/{safe_name}"
    document = create_document(
        db,
        application_id=application_id,
        filename=file.filename,
        content_type=file.content_type or "application/octet-stream",
        url=url,
    )
    return document


@router.post("/{application_id}/mark-resubmitted", response_model=ApplicationPublic)
def mark_resubmitted(
    application_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role("student")),
) -> ApplicationPublic:
    """Mark application as resubmitted after document upload."""
    application = db.query(Application).filter(Application.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    if application.student_id != current_user.id:
        raise HTTPException(status_code=403, detail="Cannot update this application")
    
    # Update status to Resubmitted and clear document request fields
    application.status = "Resubmitted"
    application.document_request_reason = None
    application.requested_documents = None
    application.document_requested_at = None
    application.document_requested_by = None
    
    db.commit()
    db.refresh(application)
    
    # Return response with status
    return ApplicationPublic(
        id=application.id,
        scholarship_id=application.scholarship_id,
        student_id=application.student_id,
        student_name=application.student.name if application.student else None,
        assigned_reviewer=application.assigned_reviewer.name if application.assigned_reviewer else None,
        status=application.status,
        submission_date=application.submission_date,
        review=None,
        documents=[],
        document_request_reason=application.document_request_reason,
        requested_documents=application.requested_documents,
        document_requested_at=application.document_requested_at,
        document_requested_by=application.document_requested_by,
    )
