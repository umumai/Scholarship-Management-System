from pydantic import BaseModel, ConfigDict


class ReviewBase(BaseModel):
    application_id: int
    scores_json: str = "[]"
    overall_score: float = 0.0
    comments: str = ""
    submitted_at: str = ""


class ReviewCreate(ReviewBase):
    pass


class ReviewPublic(ReviewBase):
    id: int
    reviewer_id: int
    reviewer_name: str | None = None

    model_config = ConfigDict(from_attributes=True)
