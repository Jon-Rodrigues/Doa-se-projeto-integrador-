# Doa-se-projeto-integrador-
Sistema web desenvolvido como projeto integrador para gerenciamento de doações, conectando usuários e organizações não governamentais (ONGs).

Dimensão imagem Hero
- hero-bg: 1920 x 1279 px
- hero-person: 1334 x 2000 px

## Back-end

API desenvolvida com Python, FastAPI e SQLAlchemy.

### Pré-requisitos
- Python 3.10 ou superior
- SQL Server
- ODBC Driver 18 for SQL Server
- Git

### Configuração do banco de dados
Crie um arquivo `.env` na raiz do projeto e configure a variável `DATABASE_URL` com os dados da sua instalação do SQL Server.
  
### Como rodar

1. Crie o ambiente virtual:
```bash
python -m venv venv
```

2. Ative o ambiente virtual:
```bash
venv\Scripts\activate
```

3. Instale as dependências:
```bash
   pip install -r requirements.txt
```

4. Inicie o servidor:
```bash
   uvicorn app.main:app --reload --app-dir backend
```

5. Acesse a documentação interativa da API em
   `http://127.0.0.1:8000/docs`

### Banco de dados
O projeto usa SQL Server como banco de dados.
A conexão com o banco é configurada pela variável `DATABASE_URL` definida no arquivo `.env`.
