from pydantic import BaseModel, ConfigDict

from app.schemas.document import DocumentPublic
from app.schemas.review import ReviewPublic


class ApplicationBase(BaseModel):
    scholarship_id: int
    status: str = "Submitted"
    submission_date: str = ""


class ApplicationCreate(ApplicationBase):
    pass


class DocumentRequestCreate(BaseModel):
    missing_documents: list[str]
    reason: str
    requested_at: str


class ApplicationPublic(ApplicationBase):
    id: int
    student_id: int
    student_name: str | None = None
    assigned_reviewer: str | None = None
    document_request_reason: str | None = None
    requested_documents: str | None = None  # JSON string
    document_requested_at: str | None = None
    document_requested_by: str | None = None
    review: ReviewPublic | None = None
    documents: list[DocumentPublic] = []

    model_config = ConfigDict(from_attributes=True)
