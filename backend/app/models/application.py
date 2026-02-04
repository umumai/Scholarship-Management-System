from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models import Base


class Application(Base):
    __tablename__ = "applications"

    id: Mapped[int] = mapped_column(primary_key=True)
    scholarship_id: Mapped[int] = mapped_column(ForeignKey("scholarships.id"))
    student_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    assigned_reviewer_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    status: Mapped[str] = mapped_column(String(50), default="Submitted")
    submission_date: Mapped[str] = mapped_column(String(30), default="")
    document_request_reason: Mapped[str | None] = mapped_column(String(500), nullable=True)
    requested_documents: Mapped[str | None] = mapped_column(String(255), nullable=True)  # JSON string of array
    document_requested_at: Mapped[str | None] = mapped_column(String(30), nullable=True)
    document_requested_by: Mapped[str | None] = mapped_column(String(100), nullable=True)

    scholarship = relationship("Scholarship", back_populates="applications")
    student = relationship("User", back_populates="applications", foreign_keys=[student_id])
    assigned_reviewer = relationship("User", foreign_keys=[assigned_reviewer_id])
    review = relationship("Review", back_populates="application", uselist=False)
    documents = relationship("Document", back_populates="application")
