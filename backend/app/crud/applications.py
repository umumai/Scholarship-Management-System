from sqlalchemy.orm import Session

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
