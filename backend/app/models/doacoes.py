from sqlalchemy import (Column, Integer, String, Date, Boolean, Numeric,
                        ForeignKey, func, text)
from sqlalchemy.dialects.mssql import DATETIME2
from app.database import Base


class Doacao(Base):
    __tablename__ = "doacoes"

    id_doacao = Column(Integer, primary_key=True)
    id_doador = Column(Integer, ForeignKey("usuarios.id_usuario"), nullable=False)
    id_ponto_coleta = Column(Integer, ForeignKey("pontos_coleta.id_ponto_coleta"), nullable=True)
    # None = distribuição aleatória
    id_ong_destino = Column(Integer, ForeignKey("ongs.id_ong"), nullable=True)
    tipo_envio = Column(String(20), nullable=False, server_default="Entrega no ponto")
    em_lote = Column(Boolean, nullable=False, server_default=text("0"))
    id_status = Column(Integer, ForeignKey("status_doacao.id_status"), nullable=False)
    id_etapa = Column(Integer, ForeignKey("etapas_doacao.id_etapa"), nullable=False)
    data_criacao = Column(DATETIME2, nullable=False, server_default=func.sysdatetime())


class ItemDoacao(Base):
    __tablename__ = "itens_doacao"

    id_item = Column(Integer, primary_key=True)
    id_doacao = Column(Integer, ForeignKey("doacoes.id_doacao"), nullable=False)
    id_categoria = Column(Integer, ForeignKey("categorias.id_categoria"), nullable=False)
    quantidade = Column(Integer, nullable=False, server_default=text("1"))
    condicao = Column(String(30), nullable=True)
    tamanho = Column(String(10), nullable=True)
    genero = Column(String(15), nullable=True)
    peso_kg = Column(Numeric(8, 2), nullable=True)   # alimentos
    validade = Column(Date, nullable=True)           # alimentos
    descricao = Column(String(300), nullable=True)
    foto_url = Column(String(300), nullable=True)


class HistoricoDoacao(Base):
    __tablename__ = "historico_doacao"

    id_historico = Column(Integer, primary_key=True)
    id_doacao = Column(Integer, ForeignKey("doacoes.id_doacao"), nullable=False)
    id_status = Column(Integer, ForeignKey("status_doacao.id_status"), nullable=False)
    id_etapa = Column(Integer, ForeignKey("etapas_doacao.id_etapa"), nullable=False)
    data_hora = Column(DATETIME2, nullable=False, server_default=func.sysdatetime())
    observacao = Column(String(300), nullable=True)
