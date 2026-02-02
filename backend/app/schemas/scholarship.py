from pydantic import BaseModel, ConfigDict


class ScholarshipBase(BaseModel):
    name: str
    amount: str
    deadline: str
    description: str
    criteria: list[str] = []


class ScholarshipCreate(ScholarshipBase):
    pass


class ScholarshipPublic(ScholarshipBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
