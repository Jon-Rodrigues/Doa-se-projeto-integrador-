# Doa-se-projeto-integrador-

Dimensão imagem Hero
    hero-bg:
        largura: 1920px
        altura: 1279px

    hero-person:
        largura: 1334px
        altura: 2000px

## Back-end

API desenvolvida com Python, FastAPI e SQLAlchemy.

### Pré-requisitos
- Python 3.10 ou superior

### Como rodar

1. Entre na pasta do back-end:
```bash
   cd backend
```

2. Crie e ative o ambiente virtual:
```bash
   python -m venv venv
   source venv/bin/activate      # Windows: venv\Scripts\activate
```

3. Instale as dependências:
```bash
   pip install -r requirements.txt
```

4. Inicie o servidor:
```bash
   uvicorn app.main:app --reload
```

5. Acesse a documentação interativa da API em
   `http://127.0.0.1:8000/docs`

### Banco de dados
Por enquanto o projeto usa SQLite local para testes (arquivo `teste.db`).
A URL do banco real é definida pela variável de ambiente `DATABASE_URL`.