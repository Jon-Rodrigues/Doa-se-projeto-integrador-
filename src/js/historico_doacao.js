async function carregarHistorico() {
    const tabela = document.querySelector("#tabelaDoacoes");

    try {
        const resposta = await fetch(
            "http://127.0.0.1:8000/doacao/historico",
            {
                method: "GET",
                credentials: "include"
            }
        );

        if (!resposta.ok) {
            throw new Error("Não foi possível carregar o histórico.");
        }

        const dados = await resposta.json();

        tabela.innerHTML = "";

        dados.doacoes.forEach(doacao => {

            const data = new Date(doacao.data)
                .toLocaleString("pt-BR");

            doacao.itens.forEach(item => {

                const linha = document.createElement("tr");

                const valores = [
                    doacao.id_doacao,
                    data,
                    item.categoria,
                    item.quantidade,
                    doacao.etapa
                ];

                valores.forEach(valor => {
                    const celula = document.createElement("td");
                    celula.textContent = valor;
                    linha.appendChild(celula);
                });

                tabela.appendChild(linha);
            });
        });

    } catch (erro) {
        console.error(erro);
        tabela.innerHTML =
            "<tr><td colspan='5'>Erro ao carregar doações.</td></tr>";
    }
}

carregarHistorico();