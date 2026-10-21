from sqlalchemy import Column, Integer, String, CHAR, Numeric
from app.database import Base


class Endereco(Base):
    __tablename__ = "enderecos"

    id_endereco = Column(Integer, primary_key=True)
    rua = Column(String(150), nullable=False)
    numero = Column(String(10), nullable=False)
    bairro = Column(String(80), nullable=False)
    complemento = Column(String(80), nullable=True)
    cidade = Column(String(80), nullable=False)
    estado = Column(CHAR(2), nullable=False)
    cep = Column(CHAR(8), nullable=False)
    latitude = Column(Numeric(9, 6), nullable=True)
    longitude = Column(Numeric(9, 6), nullable=True)
