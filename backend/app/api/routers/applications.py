from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user, require_role
from app.crud.applications import (
    create_application,
    list_applications,
    list_applications_for_student,
)
from app.models.application import Application
from app.models.user import User
from app.schemas.application import ApplicationCreate, ApplicationPublic
from app.schemas.review import ReviewPublic
from app.schemas.document import DocumentPublic

router = APIRouter(prefix="/applications", tags=["applications"])

def _to_public(application: Application) -> ApplicationPublic:
    review = None
    if application.review:
        review = ReviewPublic(
            id=application.review.id,
            application_id=application.review.application_id,
            reviewer_id=application.review.reviewer_id,
            reviewer_name=application.review.reviewer.name if application.review.reviewer else None,
            scores_json=application.review.scores_json,
            overall_score=application.review.overall_score,
            comments=application.review.comments,
            submitted_at=application.review.submitted_at,
        )
    documents = [
        DocumentPublic(
            id=document.id,
            application_id=document.application_id,
            filename=document.filename,
            content_type=document.content_type,
            url=document.url,
            created_at=document.created_at,
        )
        for document in application.documents
    ]
    return ApplicationPublic(
        id=application.id,
        scholarship_id=application.scholarship_id,
        student_id=application.student_id,
        student_name=application.student.name if application.student else None,
        assigned_reviewer=application.assigned_reviewer.name if application.assigned_reviewer else None,
        status=application.status,
        submission_date=application.submission_date,
        review=review,
        documents=documents,
    )


@router.get("/", response_model=list[ApplicationPublic])
def get_applications(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
) -> list[ApplicationPublic]:
    if current_user.role == "student":
        return [_to_public(app) for app in list_applications_for_student(db, current_user.id)]
    return [_to_public(app) for app in list_applications(db)]


@router.post("/", response_model=ApplicationPublic)
def submit_application(
    application_in: ApplicationCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role("student")),
) -> ApplicationPublic:
    application = create_application(db, current_user.id, application_in)
    return _to_public(application)


@router.post("/{application_id}/assign-reviewer", response_model=ApplicationPublic)
def assign_reviewer(
    application_id: int,
    reviewer_id: int,
    db: Session = Depends(get_db),
    _committee=Depends(require_role("committee", "admin")),
) -> ApplicationPublic:
    application = db.query(Application).filter(Application.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    reviewer = db.query(User).filter(User.id == reviewer_id).first()
    if not reviewer or reviewer.role != "reviewer":
        raise HTTPException(status_code=400, detail="Reviewer not found")
    application.assigned_reviewer_id = reviewer_id
    if application.status == "Submitted":
        application.status = "Under Review"
    db.commit()
    db.refresh(application)
    return _to_public(application)


@router.post("/{application_id}/decision", response_model=ApplicationPublic)
def submit_decision(
    application_id: int,
    decision: str,
    db: Session = Depends(get_db),
    _committee=Depends(require_role("committee", "admin")),
) -> ApplicationPublic:
    if decision not in {"Awarded", "Rejected"}:
        raise HTTPException(status_code=400, detail="Invalid decision")
    application = db.query(Application).filter(Application.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    application.status = decision
    db.commit()
    db.refresh(application)
    return _to_public(application)
