document.addEventListener("DOMContentLoaded", () => {
    const botoesAbas = document.querySelectorAll(".tab-btn");
    const conteudosAbas = document.querySelectorAll(".tab-content");

    botoesAbas.forEach((botao) => {
        botao.addEventListener("click", () => {

            botoesAbas.forEach((btn) => btn.classList.remove("active"));
            conteudosAbas.forEach((aba) => aba.classList.remove("active"));

            botao.classList.add("active");
           
            const idAba = botao.getAttribute("data-aba");
            document.getElementById(idAba).classList.add("active");
        });
    });
});