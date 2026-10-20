from typing import Optional
from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base
from app.models.apoio import TipoUsuario
from app.models.ongs import Ong
from app.models.usuarios import Usuario, UsuarioTipo, PessoaFisica
from app.seguranca import gerar_hash

Base.metadata.create_all(bind=engine)
app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class OngIn(BaseModel):
    nome_fantasia: str
    razao_social: str
    cnpj: str
    email: str
    senha: str = Field(min_length=8, max_length=72)

class OngOut(BaseModel):
    id_ong: int
    nome_fantasia: str
    razao_social: str
    cnpj: str
    email: str

class OngUpdate(BaseModel):
    nome_fantasia: Optional[str] = None
    razao_social: Optional[str] = None
    email: Optional[str] = None
    senha: Optional[str] = Field(default=None, min_length=8, max_length=72)

@app.post("/ongs", response_model=OngOut)
def criar_ong(dados: OngIn, db: Session = Depends(get_db)):
    try:
        usuario = Usuario(nome=dados.nome_fantasia, email=dados.email, senha_hash=gerar_hash(dados.senha))
        db.add(usuario)
        db.flush()
        nova = Ong(id_usuario=usuario.id_usuario, nome_fantasia=dados.nome_fantasia,
                   razao_social=dados.razao_social, cnpj=dados.cnpj)
        db.add(nova)
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="E-mail ou CNPJ já cadastrado")
    return OngOut(id_ong=nova.id_ong, nome_fantasia=nova.nome_fantasia,
                  razao_social=nova.razao_social, cnpj=nova.cnpj, email=dados.email)

@app.patch("/ongs/{id_ong}", response_model=OngOut)
def atualizar_ong(id_ong: int, dados: OngUpdate, db: Session = Depends(get_db)):
    ong = db.get(Ong, id_ong)
    if ong is None:
        raise HTTPException(status_code=404, detail="ONG não encontrada")
    usuario = db.get(Usuario, ong.id_usuario)
    if dados.nome_fantasia is not None:
        ong.nome_fantasia = dados.nome_fantasia
        usuario.nome = dados.nome_fantasia
    if dados.razao_social is not None:
        ong.razao_social = dados.razao_social
    if dados.email is not None:
        usuario.email = dados.email
    if dados.senha is not None:
        usuario.senha_hash = gerar_hash(dados.senha)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="E-mail já cadastrado")
    return OngOut(id_ong=ong.id_ong, nome_fantasia=ong.nome_fantasia,
                  razao_social=ong.razao_social, cnpj=ong.cnpj, email=usuario.email)

class DoadorIn(BaseModel):
    nome: str
    cpf: str
    email: str
    senha: str = Field(min_length=8, max_length=72)

class DoadorOut(BaseModel):
    id_doador: int
    nome: str
    cpf: str
    email: str

@app.post("/doador", response_model=DoadorOut)
def criar_doador(dados: DoadorIn, db: Session = Depends(get_db)):
    try:
        usuario = Usuario(nome=dados.nome, email=dados.email, senha_hash=gerar_hash(dados.senha))
        db.add(usuario)
        db.flush()
        db.add(PessoaFisica(id_usuario=usuario.id_usuario, cpf=dados.cpf))
        tipo = db.query(TipoUsuario).filter_by(nome="Doador").one()
        db.add(UsuarioTipo(id_usuario=usuario.id_usuario, id_tipo_usuario=tipo.id_tipo_usuario))
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="E-mail ou CPF já cadastrado")
    return DoadorOut(id_doador=usuario.id_usuario, nome=dados.nome, cpf=dados.cpf, email=dados.email)