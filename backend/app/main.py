from fastapi import FastAPI, Depends
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.database import SessionLocal, engine, Base
from app.models.ongs import Ong
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
    model_config = {"from_attributes": True}

@app.post("/ongs", response_model=OngOut)
def criar_ong(dados: OngIn, db: Session = Depends(get_db)):
    novo = Ong(
        nome_fantasia = dados.nome_fantasia,
        razao_social = dados.razao_social,
        cnpj = dados.cnpj,
        email= dados.email,
        senha_hash = gerar_hash(dados.senha),
    )
    db.add(novo)
    db.commit()
    db.refresh(novo)
    return novo