from sqlalchemy import Column, Integer, String
from app.database import Base

class Doador(Base):
    __tablename__ = "doador"

    id_doador = Column(Integer, primary_key=True)
    nome = Column(String(100), nullable=False)
    cpf = Column(String(14), unique=True, nullable=False)
    email = Column(String(120), unique=True, nullable=False)
    senha_hash = Column(String(255), nullable=False)