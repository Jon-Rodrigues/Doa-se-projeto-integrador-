from sqlalchemy import Column, Integer, String
from app.database import Base


class TipoUsuario(Base):
    __tablename__ = "tipos_usuario"

    id_tipo_usuario = Column(Integer, primary_key=True)
    nome = Column(String(30), unique=True, nullable=False)  # Doador, Voluntario, Administrador


class Categoria(Base):
    __tablename__ = "categorias"

    id_categoria = Column(Integer, primary_key=True)
    nome = Column(String(40), unique=True, nullable=False)  # Roupa, Sapato, Brinquedo...


class StatusDoacao(Base):
    __tablename__ = "status_doacao"

    id_status = Column(Integer, primary_key=True)
    nome = Column(String(40), unique=True, nullable=False)


class EtapaDoacao(Base):
    __tablename__ = "etapas_doacao"

    id_etapa = Column(Integer, primary_key=True)
    nome = Column(String(40), unique=True, nullable=False)
    ordem = Column(Integer, nullable=False)
