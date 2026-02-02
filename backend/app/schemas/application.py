from pydantic import BaseModel, ConfigDict

from app.schemas.document import DocumentPublic
from app.schemas.review import ReviewPublic


class ApplicationBase(BaseModel):
    scholarship_id: int
    status: str = "Submitted"
    submission_date: str = ""


class ApplicationCreate(ApplicationBase):
    pass


class ApplicationPublic(ApplicationBase):
    id: int
    student_id: int
    student_name: str | None = None
    assigned_reviewer: str | None = None
    review: ReviewPublic | None = None
    documents: list[DocumentPublic] = []

    model_config = ConfigDict(from_attributes=True)
