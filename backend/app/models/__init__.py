from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


from app.models.user import User  # noqa: E402
from app.models.scholarship import Scholarship  # noqa: E402
from app.models.application import Application  # noqa: E402
from app.models.review import Review  # noqa: E402
from app.models.document import Document  # noqa: E402
