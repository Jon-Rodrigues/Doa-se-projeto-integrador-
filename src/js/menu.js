const API_URL = "http://127.0.0.1:8000"

// ===== Tela de loading enquanto o site carrega =====

const loadingScreen = document.getElementById("loading-screen");
const startTime = Date.now();

window.addEventListener("load", function () {
    const minimumTime = 3000;
    const elapsedTime = Date.now() - startTime;
    const remainingTime = Math.max(0, minimumTime - elapsedTime);

    setTimeout(() => {
        loadingScreen?.classList.add("hidden");
    }, remainingTime);
});


// ===== Sublista de doações =====

const itemDoacoes = document.querySelector('.nav-links li:has(#sublista-doar)');
const sublist = document.querySelector('#sublista-doar');

function abrirSublista() {
    sublist?.classList.toggle("ativo");
}

document.addEventListener('click', function (event) {
    if (itemDoacoes && !itemDoacoes.contains(event.target)) {
        sublist?.classList.remove("ativo");
    }
});


// ===== Pop up do usuário =====

const perfil = document.querySelector('#user');

async function user_perfil() {

    console.log("user_perfil chamada");

    try {
        const resposta = await fetch("http://127.0.0.1:8000/me", {
            method: "GET",
            credentials: "include"
        });

        // Se não estiver autenticado
        if (resposta.status === 401) {
            window.location.href = "src/pages/login_regis.html";
            return;
        }
        if (!resposta.ok) {
            throw new Error(`Erro ${resposta.status}`);
        }

        // Se estiver autenticado
        const usuario = await resposta.json();

        console.log("Usuário logado:", usuario);

        // Atualiza o nome no popup
        const nomeUsuario = document.querySelector('#user-info-nome span');

        if (nomeUsuario) {
            nomeUsuario.textContent = usuario.nome;
        }

        perfil?.classList.toggle("ativo");

    } catch (erro) {
        console.error("Erro ao verificar login:", erro);
        alert("Não foi possível verificar sua sessão.");
    }
}

async function logout(event) {
    event.preventDefault();

    try {
        const resposta = await fetch("http://127.0.0.1:8000/logout", {
            method: "POST",
            credentials: "include"
        });

        if (resposta.ok) {
            window.location.href = "index.html";
        } else {
            alert("Não foi possível sair da conta.");
        }

    } catch (erro) {
        console.error("Erro ao fazer logout:", erro);
    }
}

function user_perfil_b() {
    perfil?.classList.remove("ativo");
}


// ===== Configurações do usuário =====

const userSetting = document.querySelector('#user-setting');
const menuUser = document.querySelector('#menu-user');

function addUserSetting() {
    userSetting?.classList.add("ativo");
    menuUser.classList.add("menuConfig");
}

function removeUserSetting() {
    userSetting?.classList.remove("ativo");
    menuUser.classList.remove("menuConfig");
}




const doacoesRealizadas = document.querySelector('#doacoes-realizadas');

async function carregarDoacoesQTD() {
    try {
        const resposta = await fetch(
            "http://127.0.0.1:8000/doacao/historico",
            {
                method: "GET",
                credentials: "include"
            }
        );

        if (!resposta.ok) {
            throw new Error("Erro ao carregar doações");
        }

        const dados = await resposta.json();

        const quantidadeTotal = dados.doacoes.reduce((total, doacao) => {
            return total + doacao.itens.length;
        }, 0);

        doacoesRealizadas.innerHTML = quantidadeTotal;

    } catch (erro) {
        console.error(erro);
    }
}

carregarDoacoesQTD();


