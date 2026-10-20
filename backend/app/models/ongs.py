from sqlalchemy import Column, Integer, String, Date, Text, CHAR, ForeignKey, func
from sqlalchemy.dialects.mssql import DATETIME2
from app.database import Base


class Ong(Base):
    __tablename__ = "ongs"

    id_ong = Column(Integer, primary_key=True)
    # e-mail, senha e telefone ficam no Usuario da ONG
    id_usuario = Column(Integer, ForeignKey("usuarios.id_usuario"), unique=True, nullable=False)
    nome_fantasia = Column(String(150), nullable=False)
    razao_social = Column(String(150), nullable=False)
    cnpj = Column(CHAR(14), unique=True, nullable=False)
    data_fundacao = Column(Date, nullable=True)
    area_atuacao = Column(String(100), nullable=True)
    projetos = Column(Text, nullable=True)
    site = Column(String(200), nullable=True)
    descricao = Column(Text, nullable=True)
    id_endereco = Column(Integer, ForeignKey("enderecos.id_endereco"), nullable=True)
    data_inicio_cadastro = Column(DATETIME2, nullable=False, server_default=func.sysdatetime())
    data_conclusao_cadastro = Column(DATETIME2, nullable=True)
    # Em analise, Aprovada, Rejeitada, Suspensa
    status = Column(String(15), nullable=False, server_default="Em analise")
    motivo = Column(String(300), nullable=True)  # se rejeitada ou suspensa


class ResponsavelOng(Base):
    __tablename__ = "responsaveis_ong"

    id_responsavel = Column(Integer, primary_key=True)
    id_ong = Column(Integer, ForeignKey("ongs.id_ong"), nullable=False)
    nome = Column(String(100), nullable=False)
    cpf = Column(CHAR(11), nullable=False)
    cargo = Column(String(80), nullable=True)
    email_corporativo = Column(String(150), nullable=True)
    telefone = Column(String(20), nullable=True)


class DocumentoOng(Base):
    __tablename__ = "documentos_ong"

    id_documento = Column(Integer, primary_key=True)
    id_ong = Column(Integer, ForeignKey("ongs.id_ong"), nullable=False)
    tipo_documento = Column(String(30), nullable=False)  # Estatuto Social ou Comprovante de endereco
    numero_documento = Column(String(50), nullable=True)
    arquivo_pdf = Column(String(300), nullable=False)    # caminho/URL do arquivo
    data_emissao = Column(Date, nullable=True)
    data_envio = Column(DATETIME2, nullable=False, server_default=func.sysdatetime())
    data_conclusao = Column(DATETIME2, nullable=True)
    validade = Column(Date, nullable=True)
    # Em analise, Aprovado, Rejeitado
    status = Column(String(15), nullable=False, server_default="Em analise")
    motivo = Column(String(300), nullable=True)
