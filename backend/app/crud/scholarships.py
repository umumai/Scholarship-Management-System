import json

from sqlalchemy.orm import Session

from app.models.scholarship import Scholarship
from app.schemas.scholarship import ScholarshipCreate


def list_scholarships(session: Session) -> list[Scholarship]:
    return session.query(Scholarship).order_by(Scholarship.id.asc()).all()


def create_scholarship(session: Session, scholarship_in: ScholarshipCreate) -> Scholarship:
    payload = scholarship_in.model_dump()
    criteria = payload.pop("criteria", [])
    scholarship = Scholarship(**payload, criteria_json=json.dumps(criteria))
    session.add(scholarship)
    session.commit()
    session.refresh(scholarship)
    return scholarship


def update_scholarship(
    session: Session, scholarship: Scholarship, scholarship_in: ScholarshipCreate
) -> Scholarship:
    payload = scholarship_in.model_dump()
    criteria = payload.pop("criteria", [])
    for key, value in payload.items():
        setattr(scholarship, key, value)
    scholarship.criteria_json = json.dumps(criteria)
    session.commit()
    session.refresh(scholarship)
    return scholarship


def delete_scholarship(session: Session, scholarship: Scholarship) -> None:
    session.delete(scholarship)
    session.commit()
