import json
import os
from datetime import date
from typing import Optional,List
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sqlalchemy.exc import IntegrityError, NoResultFound
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base
from app.models.apoio import TipoUsuario, Categoria, StatusDoacao
from app.models.ongs import Ong
from app.models.usuarios import Usuario, UsuarioTipo, PessoaFisica
from app.models.doacoes import Doacao, ItemDoacao, HistoricoDoacao
from app.models.enderecos import Endereco
from app.seguranca import gerar_hash, verificar_senha
from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError
from fastapi import Response, Request

Base.metadata.create_all(bind=engine)
app = FastAPI()

SECRET_KEY = os.getenv("SECRET_KEY")

if not SECRET_KEY:
    raise RuntimeError("SECRET_KEY não configurada")

ALGORITHM = "HS256"
TEMPO_EXPIRACAO = 60 * 60 * 24

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5500",
        "http://127.0.0.1:5500"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


#================================
#           Ongs
#================================

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


#================================
#           Doador
#================================

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
        tipo = db.query(TipoUsuario).filter_by(nome="Doador").one()

        usuario = Usuario(nome=dados.nome, email=dados.email,
                          senha_hash=gerar_hash(dados.senha))
        db.add(usuario)
        db.flush()

        db.add(PessoaFisica(id_usuario=usuario.id_usuario, cpf=dados.cpf))
        db.add(UsuarioTipo(id_usuario=usuario.id_usuario,
                           id_tipo_usuario=tipo.id_tipo_usuario))
        db.commit()
    except NoResultFound:
        db.rollback()
        raise HTTPException(status_code=500,
                            detail="Tipo 'Doador' não cadastrado no banco")
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409,
                            detail="E-mail ou CPF já cadastrado")

    return DoadorOut(id_doador=usuario.id_usuario, nome=dados.nome,
                     cpf=dados.cpf, email=dados.email)


#================================
#           Doações
#================================

ID_STATUS_INICIAL = 1
ID_ETAPA_INICIAL = 1

class ItemDoacaoIn(BaseModel):
    categoria: str
    em_lote: bool = False
    quantidade: int = Field(1, ge=1)
    condicao: Optional[str] = None
    tamanho: Optional[str] = None
    genero: Optional[str] = None
    validade: Optional[date] = None
    descricao: Optional[str] = Field(None, max_length=300)

class DoacaoIn(BaseModel):
    id_doador: int
    id_ong_destino: Optional[int] = None
    id_ponto_coleta: Optional[int] = None
    itens: List[ItemDoacaoIn] = Field(min_length=1)

def _criar_doacao_base(db: Session, dados: DoacaoIn, em_lote: bool) -> Doacao:
    doacao = Doacao(
        id_doador=dados.id_doador,
        id_ponto_coleta=dados.id_ponto_coleta,
        id_ong_destino=dados.id_ong_destino,
        em_lote=em_lote,
        id_status=ID_STATUS_INICIAL,
        id_etapa=ID_ETAPA_INICIAL,
    )
    db.add(doacao)
    db.flush()   # gera o id_doacao sem finalizar a transação
    db.add(HistoricoDoacao(
        id_doacao=doacao.id_doacao,
        id_status=ID_STATUS_INICIAL,
        id_etapa=ID_ETAPA_INICIAL,
        observacao="Doação criada",
    ))
    return doacao

@app.post("/doacoes", status_code=201)
def criar_doacao(dados: DoacaoIn, db: Session = Depends(get_db)):

    if not db.get(Usuario, dados.id_doador):
        raise HTTPException(404, "Doador não encontrado")

    if dados.id_ong_destino is not None:
        if not db.get(Ong, dados.id_ong_destino):
            raise HTTPException(404, "ONG não encontrada")

    comuns = [i for i in dados.itens if not i.em_lote]
    remessas = [i for i in dados.itens if i.em_lote]

    grupos = []

    if comuns:
        grupos.append((False, comuns))

    for r in remessas:
        grupos.append((True, [r]))

    ids_criados = []

    try:
        for em_lote, itens in grupos:

            doacao = _criar_doacao_base(db, dados, em_lote)

            for item in itens:

                categoria = (
                    db.query(Categoria)
                    .filter(Categoria.nome == item.categoria)
                    .first()
                )

                if not categoria:
                    raise HTTPException(
                        400,
                        f"Categoria inválida: {item.categoria}"
                    )

                novo_item = ItemDoacao(
                    id_doacao=doacao.id_doacao,
                    id_categoria=categoria.id_categoria,
                    **item.model_dump(
                        exclude={"categoria", "em_lote"}
                    ),
                )

                db.add(novo_item)

            ids_criados.append(doacao.id_doacao)

        db.commit()

    except HTTPException:
        db.rollback()
        raise

    except Exception as e:
        db.rollback()
        print("ERRO AO REGISTRAR DOAÇÃO:", repr(e))
        raise HTTPException(
            500,
            "Erro ao registrar doação"
        )

    return {
        "ids_doacao": ids_criados
    }




#================================
#           Login
#================================

class LoginIn(BaseModel):
    email: str
    senha: str


@app.post("/login")
def login(
    dados: LoginIn,
    response: Response,
    db: Session = Depends(get_db)
):
    usuario = (
        db.query(Usuario)
        .filter(Usuario.email == dados.email)
        .first()
    )

    if not usuario:
        raise HTTPException(
            status_code=401,
            detail="Email ou senha incorretos"
        )

    if not verificar_senha(dados.senha, usuario.senha_hash):
        raise HTTPException(
            status_code=401,
            detail="Email ou senha incorretos"
        )

    expiracao = datetime.now(timezone.utc) + timedelta(
        seconds=TEMPO_EXPIRACAO
    )

    token = jwt.encode(
        {
            "sub": str(usuario.id_usuario),
            "exp": expiracao
        },
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=False,  # True em produção com HTTPS
        samesite="lax",
        max_age=TEMPO_EXPIRACAO
    )

    return {
        "mensagem": "Login realizado com sucesso",
        "id_usuario": usuario.id_usuario,
        "nome": usuario.nome
    }


def get_usuario_logado(
    request: Request,
    db: Session = Depends(get_db)
):
    token = request.cookies.get("access_token")

    if not token:
        raise HTTPException(
            status_code=401,
            detail="Usuário não autenticado"
        )

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        id_usuario = payload.get("sub")

        if not id_usuario:
            raise HTTPException(
                status_code=401,
                detail="Token inválido"
            )

    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Sessão inválida ou expirada"
        )

    usuario = db.get(Usuario, int(id_usuario))

    if not usuario:
        raise HTTPException(
            status_code=401,
            detail="Usuário não encontrado"
        )

    return usuario


@app.get("/me")
def meu_perfil(
    usuario: Usuario = Depends(get_usuario_logado)
):
    return {
        "id_usuario": usuario.id_usuario,
        "nome": usuario.nome,
        "email": usuario.email
    }


@app.post("/logout")
def logout(response: Response):
    response.delete_cookie(
        key="access_token",
        httponly=True,
        secure=False,
        samesite="lax"
    )

    return {"mensagem": "Logout realizado"}



@app.get("/ongs/estados")
def listar_ongs_estados(db: Session = Depends(get_db)):

    resultado = (
        db.query(Ong, Endereco)
        .join(
            Endereco,
            Ong.id_endereco == Endereco.id_endereco
        )
        .all()
    )

    return [
        {
            "nome_fantasia": ong.nome_fantasia,
            "estado": endereco.estado
        }
        for ong, endereco in resultado
    ]




@app.get("/doacao/historico")
def minhas_doacoes(
    usuario: Usuario = Depends(get_usuario_logado),
    db: Session = Depends(get_db)
):
    usuarioID = usuario.id_usuario

    doacoes = (
        db.query(Doacao, StatusDoacao)
        .join(
            StatusDoacao,
            Doacao.id_status == StatusDoacao.id_status
        )
        .filter(Doacao.id_doador == usuarioID)
        .all()
    )

    if not doacoes:
        raise HTTPException(
            status_code=404,
            detail="Doações não encontradas"
        )

    doacaoID = [
        doacao.id_doacao
        for doacao, status in doacoes
    ]

    itens = (
        db.query(ItemDoacao, Categoria)
        .join(
            Categoria,
            ItemDoacao.id_categoria == Categoria.id_categoria
        )
        .filter(ItemDoacao.id_doacao.in_(doacaoID))
        .all()
    )

    # Organiza os itens por doação
    itens_por_doacao = {}

    for item, categoria in itens:
        itens_por_doacao.setdefault(item.id_doacao, []).append({
            "id_item": item.id_item,
            "categoria": categoria.nome,
            "quantidade": item.quantidade
        })

    return {
        "doacoes": [
            {
                "data": doacao.data_criacao,
                "id_doacao": doacao.id_doacao,
                "etapa": status.nome,
                "itens": itens_por_doacao.get(
                    doacao.id_doacao, []
                )
            }
            for doacao, status in doacoes
        ]
    }

