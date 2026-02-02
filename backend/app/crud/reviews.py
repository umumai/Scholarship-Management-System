from sqlalchemy.orm import Session

from app.models.review import Review
from app.schemas.review import ReviewCreate


def list_reviews(session: Session) -> list[Review]:
    return session.query(Review).order_by(Review.id.asc()).all()


def upsert_review(session: Session, reviewer_id: int, review_in: ReviewCreate) -> Review:
    review = (
        session.query(Review)
        .filter(Review.application_id == review_in.application_id)
        .first()
    )
    if review:
        for key, value in review_in.model_dump().items():
            setattr(review, key, value)
        review.reviewer_id = reviewer_id
        session.commit()
        session.refresh(review)
        return review

    review = Review(reviewer_id=reviewer_id, **review_in.model_dump())
    session.add(review)
    session.commit()
    session.refresh(review)
    return review
