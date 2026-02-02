from sqlalchemy import Float, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models import Base


class Review(Base):
    __tablename__ = "reviews"

    id: Mapped[int] = mapped_column(primary_key=True)
    application_id: Mapped[int] = mapped_column(ForeignKey("applications.id"))
    reviewer_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    scores_json: Mapped[str] = mapped_column(String(2000), default="[]")
    overall_score: Mapped[float] = mapped_column(Float, default=0.0)
    comments: Mapped[str] = mapped_column(String(2000), default="")
    submitted_at: Mapped[str] = mapped_column(String(30), default="")

    application = relationship("Application", back_populates="review")
    reviewer = relationship("User", back_populates="reviews")
