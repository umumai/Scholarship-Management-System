from sqlalchemy.orm import Session
import json

from app.models.application import Application
from app.schemas.application import ApplicationCreate


def list_applications_for_student(session: Session, student_id: int) -> list[Application]:
    return (
        session.query(Application)
        .filter(Application.student_id == student_id)
        .order_by(Application.id.asc())
        .all()
    )


def list_applications(session: Session) -> list[Application]:
    return session.query(Application).order_by(Application.id.asc()).all()


def create_application(
    session: Session, student_id: int, application_in: ApplicationCreate
) -> Application:
    application = Application(student_id=student_id, **application_in.model_dump())
    session.add(application)
    session.commit()
    session.refresh(application)
    return application


def request_missing_documents(
    session: Session,
    application_id: int,
    missing_documents: list[str],
    reason: str,
    reviewer_name: str,
    requested_at: str
) -> Application:
    """Update application with document request."""
    application = session.query(Application).filter(Application.id == application_id).first()
    if not application:
        raise ValueError(f"Application {application_id} not found")
    
    application.status = "Document Request"
    application.document_request_reason = reason
    application.requested_documents = json.dumps(missing_documents)
    application.document_requested_at = requested_at
    application.document_requested_by = reviewer_name
    
    session.commit()
    session.refresh(application)
    return application
