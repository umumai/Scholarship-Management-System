from sqlalchemy.orm import Session

from app.models.document import Document


def list_documents_for_application(session: Session, application_id: int) -> list[Document]:
    return (
        session.query(Document)
        .filter(Document.application_id == application_id)
        .order_by(Document.id.asc())
        .all()
    )


def create_document(
    session: Session,
    application_id: int,
    filename: str,
    content_type: str,
    url: str,
) -> Document:
    document = Document(
        application_id=application_id,
        filename=filename,
        content_type=content_type,
        url=url,
    )
    session.add(document)
    session.commit()
    session.refresh(document)
    return document
