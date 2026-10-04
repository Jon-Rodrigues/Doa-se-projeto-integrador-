from sqlalchemy import Column, Integer, String
from app.database import Base

class Ong(Base):
    __tablename__ = "ongs"

    id_ong = Column(Integer, primary_key=True)
    nome_fantasia = Column(String(100), nullable=False)
    razao_social = Column(String(100), nullable=False)
    cnpj = Column(String(14), unique=True, nullable=False)
    email = Column(String(120), unique=True, nullable=False)
    senha_hash = Column(String(255), nullable=False)