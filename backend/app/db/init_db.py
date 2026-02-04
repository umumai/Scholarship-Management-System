from sqlalchemy.orm import Session

from app.core.config import settings
import json

from app.core.security import hash_password
from app.models import Application, Base, Review, Scholarship, User


def init_db(session: Session) -> None:
    Base.metadata.create_all(bind=session.bind)

    admin = session.query(User).filter(User.email == settings.admin_email).first()
    if not admin:
        admin = User(
            name="System Admin",
            email=settings.admin_email,
            hashed_password=hash_password(settings.admin_password),
            role="admin",
        )
        session.add(admin)
        session.commit()

    existing_scholarships = session.query(Scholarship).count()
    if existing_scholarships == 0:
        scholarships = [
            Scholarship(
                name="Global Merit Scholarship 2024",
                amount="RM15,000",
                deadline="2024-12-31",
                description="Awarded for academic excellence.",
                criteria_json=json.dumps(["GPA > 3.8", "Leadership activities", "SPM Results"]),
            ),
            Scholarship(
                name="Future Engineers Fund",
                amount="RM10,000",
                deadline="2024-06-15",
                description="Supports STEM students.",
                criteria_json=json.dumps(["Major in Engineering", "Undergraduate level"]),
            ),
            Scholarship(
                name="Community Leadership Award",
                amount="RM5,000",
                deadline="2024-11-20",
                description="For local community impacts.",
                criteria_json=json.dumps(["50+ hours community service", "Local residency"]),
            ),
        ]
        session.add_all(scholarships)
        session.commit()

    student = session.query(User).filter(User.email == "student@example.com").first()
    if not student:
        student = User(
            name="Alex Rivera",
            email="student@example.com",
            hashed_password=hash_password("student123"),
            role="student",
        )
        session.add(student)
        session.commit()

    reviewer = session.query(User).filter(User.email == "reviewer@example.com").first()
    if not reviewer:
        reviewer = User(
            name="Dr. Maya Lewis",
            email="reviewer@example.com",
            hashed_password=hash_password("reviewer123"),
            role="reviewer",
        )
        session.add(reviewer)
        session.commit()

    committee = session.query(User).filter(User.email == "committee@example.com").first()
    if not committee:
        committee = User(
            name="Prof. Arjun Nair",
            email="committee@example.com",
            hashed_password=hash_password("committee123"),
            role="committee",
        )
        session.add(committee)
        session.commit()

    existing_application = session.query(Application).count()
    if existing_application == 0:
        first_scholarship = session.query(Scholarship).first()
        if first_scholarship:
            application = Application(
                scholarship_id=first_scholarship.id,
                student_id=student.id,
                assigned_reviewer_id=reviewer.id,
                status="Under Review",
                submission_date="2024-05-12",
            )
            session.add(application)
            session.commit()

            review = Review(
                application_id=application.id,
                reviewer_id=reviewer.id,
                scores_json=json.dumps(
                    [
                        {"criteria": "GPA > 3.8", "score": 9},
                        {"criteria": "Leadership activities", "score": 8},
                        {"criteria": "SPM Results", "score": 9},
                    ]
                ),
                overall_score=8.7,
                comments="Excellent academic record with consistent leadership roles.",
                submitted_at="2024-05-20",
            )
            session.add(review)
            session.commit()
