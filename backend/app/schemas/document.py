from datetime import datetime

from pydantic import BaseModel, ConfigDict


class DocumentPublic(BaseModel):
    id: int
    application_id: int
    filename: str
    content_type: str
    url: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
