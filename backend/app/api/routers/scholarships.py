import json

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_db, require_role
from app.crud.scholarships import (
    create_scholarship,
    delete_scholarship,
    list_scholarships,
    update_scholarship,
)
from app.models.scholarship import Scholarship
from app.schemas.scholarship import ScholarshipCreate, ScholarshipPublic

router = APIRouter(prefix="/scholarships", tags=["scholarships"])


@router.get("/", response_model=list[ScholarshipPublic])
def get_scholarships(db: Session = Depends(get_db)) -> list[ScholarshipPublic]:
    results = []
    for scholarship in list_scholarships(db):
        criteria = json.loads(scholarship.criteria_json or "[]")
        results.append(
            ScholarshipPublic(
                id=scholarship.id,
                name=scholarship.name,
                amount=scholarship.amount,
                deadline=scholarship.deadline,
                description=scholarship.description,
                criteria=criteria,
            )
        )
    return results


@router.post("/", response_model=ScholarshipPublic)
def create_new_scholarship(
    scholarship_in: ScholarshipCreate,
    db: Session = Depends(get_db),
    _admin=Depends(require_role("admin")),
) -> ScholarshipPublic:
    scholarship = create_scholarship(db, scholarship_in)
    criteria = json.loads(scholarship.criteria_json or "[]")
    return ScholarshipPublic(
        id=scholarship.id,
        name=scholarship.name,
        amount=scholarship.amount,
        deadline=scholarship.deadline,
        description=scholarship.description,
        criteria=criteria,
    )


@router.put("/{scholarship_id}", response_model=ScholarshipPublic)
def update_existing_scholarship(
    scholarship_id: int,
    scholarship_in: ScholarshipCreate,
    db: Session = Depends(get_db),
    _admin=Depends(require_role("admin")),
) -> ScholarshipPublic:
    scholarship = db.query(Scholarship).filter(Scholarship.id == scholarship_id).first()
    if not scholarship:
        raise HTTPException(status_code=404, detail="Scholarship not found")
    scholarship = update_scholarship(db, scholarship, scholarship_in)
    criteria = json.loads(scholarship.criteria_json or "[]")
    return ScholarshipPublic(
        id=scholarship.id,
        name=scholarship.name,
        amount=scholarship.amount,
        deadline=scholarship.deadline,
        description=scholarship.description,
        criteria=criteria,
    )


@router.delete("/{scholarship_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_scholarship(
    scholarship_id: int,
    db: Session = Depends(get_db),
    _admin=Depends(require_role("admin")),
) -> None:
    scholarship = db.query(Scholarship).filter(Scholarship.id == scholarship_id).first()
    if not scholarship:
        raise HTTPException(status_code=404, detail="Scholarship not found")
    delete_scholarship(db, scholarship)
