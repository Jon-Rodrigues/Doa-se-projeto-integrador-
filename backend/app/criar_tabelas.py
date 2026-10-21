from app.database import Base, engine, SessionLocal
import app.models
from app.models import TipoUsuario, Categoria, StatusDoacao, EtapaDoacao

TIPOS = ["Doador", "Voluntario", "Administrador"]
CATEGORIAS = ["Roupa", "Sapato", "Brinquedo", "Livro", "Material escolar", "Alimento"]
STATUS = ["Pendente", "Em andamento", "Concluida", "Cancelada"]
ETAPAS = ["Cadastrada", "Aguardando entrega no ponto", "Recebida no ponto",
          "Em distribuicao", "Entregue a ONG"]


def popular_se_vazia(db, modelo, objetos):
    """Só insere se a tabela estiver vazia (pode rodar o script de novo sem duplicar)."""
    if db.query(modelo).count() == 0:
        db.add_all(objetos)


Base.metadata.create_all(bind=engine)


with SessionLocal() as db:
    popular_se_vazia(db, TipoUsuario, [TipoUsuario(nome=n) for n in TIPOS])
    popular_se_vazia(db, Categoria, [Categoria(nome=n) for n in CATEGORIAS])
    popular_se_vazia(db, StatusDoacao, [StatusDoacao(nome=n) for n in STATUS])
    popular_se_vazia(db, EtapaDoacao,
                     [EtapaDoacao(nome=n, ordem=i) for i, n in enumerate(ETAPAS, start=1)])
    db.commit()

print(f"Pronto! {len(Base.metadata.tables)} tabelas criadas/verificadas:")
for nome in sorted(Base.metadata.tables):
    print(" -", nome)