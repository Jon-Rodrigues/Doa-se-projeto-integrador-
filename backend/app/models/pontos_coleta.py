from sqlalchemy import (Column, Integer, SmallInteger, String, Boolean, Time,
                        ForeignKey, UniqueConstraint, text)
from app.database import Base


class PontoColeta(Base):
    __tablename__ = "pontos_coleta"

    id_ponto_coleta = Column(Integer, primary_key=True)
    nome = Column(String(100), nullable=False)
    descricao = Column(String(300), nullable=True)
    telefone = Column(String(20), nullable=True)
    email = Column(String(150), nullable=True)
    responsavel = Column(String(100), nullable=True)
    id_endereco = Column(Integer, ForeignKey("enderecos.id_endereco"), nullable=False)
    ativo = Column(Boolean, nullable=False, server_default=text("1"))


class HorarioFuncionamento(Base):
    __tablename__ = "horarios_funcionamento"
    __table_args__ = (UniqueConstraint("id_ponto_coleta", "dia_semana"),)

    id_horario = Column(Integer, primary_key=True)
    id_ponto_coleta = Column(Integer, ForeignKey("pontos_coleta.id_ponto_coleta"), nullable=False)
    dia_semana = Column(SmallInteger, nullable=False)
    hora_abertura = Column(Time, nullable=False)
    hora_fechamento = Column(Time, nullable=False)