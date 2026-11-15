const form = document.querySelector("#formLogin");

form.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email = document.querySelector("#email").value;
    const senha = document.querySelector("#senha").value;

    try {

        const resposta = await fetch(
            "http://127.0.0.1:8000/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                credentials: "include",

                body: JSON.stringify({
                    email: email,
                    senha: senha
                })
            }
        );

        const resultado = await resposta.json();

        if (!resposta.ok) {
            alert(resultado.detail || "Erro ao realizar login");
            return;
        }

        alert("Login realizado com sucesso!");

        window.location.href = "/index.html";

    } catch (erro) {

        console.error("Erro:", erro);

        alert("Não foi possível conectar ao servidor.");

    }

});

