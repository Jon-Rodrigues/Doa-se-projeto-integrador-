const form = document.querySelector('#formCadastro');

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nome = document.querySelector('#nome').value;
    const cpf = document.querySelector('#CPF').value.replace(/\D/g,"");
    const dataNascimento = document.querySelector('#data_nascimento').value;
    const telefone = document.querySelector('#telefone').value;
    const email = document.querySelector('#email').value;
    const senha = document.querySelector('#senha').value;
    const confirmarSenha = document.querySelector('#confirmar_senha').value;

    if (senha !== confirmarSenha) {
        alert("senhas são diferentes");
        return;
    }

    const dados = {
        nome: nome,
        cpf: cpf,
        email: email,
        senha: senha
    };

    try {
        const resposta = await fetch (
            "http://127.0.0.1:8000/doador",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dados)
            }
        );

        const resultado = await resposta.json();

        if (!resposta.ok) {
            throw new Error(
                resultado.detail || "Erro ao cadastrar"
            );
        }

        alert("Cadastro realizado com sucesso!");
        form.reset();

    } catch (erro) {
        console.error(erro);
        alert("Não foi possivel realizar o cadastro");
    }
});