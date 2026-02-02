from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models import Base


class Scholarship(Base):
    __tablename__ = "scholarships"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(200))
    amount: Mapped[str] = mapped_column(String(50))
    deadline: Mapped[str] = mapped_column(String(30))
    description: Mapped[str] = mapped_column(String(1000))
    criteria_json: Mapped[str] = mapped_column(String(2000), default="[]")

    applications = relationship("Application", back_populates="scholarship")
