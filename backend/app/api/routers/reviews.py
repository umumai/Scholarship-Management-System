from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db, require_role
from app.crud.reviews import list_reviews, upsert_review
from app.schemas.review import ReviewCreate, ReviewPublic

router = APIRouter(prefix="/reviews", tags=["reviews"])


@router.get("/", response_model=list[ReviewPublic])
def get_reviews(
    db: Session = Depends(get_db),
    _staff=Depends(require_role("reviewer", "committee", "admin")),
) -> list[ReviewPublic]:
    results = []
    for review in list_reviews(db):
        results.append(
            ReviewPublic(
                id=review.id,
                application_id=review.application_id,
                reviewer_id=review.reviewer_id,
                reviewer_name=review.reviewer.name if review.reviewer else None,
                scores_json=review.scores_json,
                overall_score=review.overall_score,
                comments=review.comments,
                submitted_at=review.submitted_at,
            )
        )
    return results


@router.post("/", response_model=ReviewPublic)
def submit_review(
    review_in: ReviewCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role("reviewer", "committee")),
) -> ReviewPublic:
    review = upsert_review(db, current_user.id, review_in)
    return ReviewPublic(
        id=review.id,
        application_id=review.application_id,
        reviewer_id=review.reviewer_id,
        reviewer_name=review.reviewer.name if review.reviewer else None,
        scores_json=review.scores_json,
        overall_score=review.overall_score,
        comments=review.comments,
        submitted_at=review.submitted_at,
    )
