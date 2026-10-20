from sqlalchemy import Column, Integer, String, Date, CHAR, ForeignKey, func
from sqlalchemy.dialects.mssql import DATETIME2
from app.database import Base


class Usuario(Base):
    __tablename__ = "usuarios"

    id_usuario = Column(Integer, primary_key=True)
    nome = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    senha_hash = Column(String(255), nullable=False)
    telefone = Column(String(20), nullable=True)
    id_endereco = Column(Integer, ForeignKey("enderecos.id_endereco"), nullable=True)
    data_cadastro = Column(DATETIME2, nullable=False, server_default=func.sysdatetime())


class UsuarioTipo(Base):
    __tablename__ = "usuarios_tipos"

    # chave primária composta: o mesmo tipo não repete para o mesmo usuário
    id_usuario = Column(Integer, ForeignKey("usuarios.id_usuario"), primary_key=True)
    id_tipo_usuario = Column(Integer, ForeignKey("tipos_usuario.id_tipo_usuario"), primary_key=True)


class PessoaFisica(Base):
    __tablename__ = "pessoas_fisicas"

    id_usuario = Column(Integer, ForeignKey("usuarios.id_usuario"), primary_key=True)
    cpf = Column(CHAR(11), unique=True, nullable=False)
    data_nascimento = Column(Date, nullable=True)


class PessoaJuridica(Base):
    __tablename__ = "pessoas_juridicas"

    id_usuario = Column(Integer, ForeignKey("usuarios.id_usuario"), primary_key=True)
    nome_fantasia = Column(String(150), nullable=False)
    razao_social = Column(String(150), nullable=False)
    cnpj = Column(CHAR(14), unique=True, nullable=False)
