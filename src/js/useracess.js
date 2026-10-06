

function quero_doar() { // Função para redirecionar o usuário para a página de login ou registro

    window.location.href = "src/pages/login_regis.html";
};


// Efeito parallax na seção hero
const parallax = document.querySelectorAll('.parallax');

document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth - 0.5;

    parallax.forEach((item) => {
        const velocidade = Number(item.dataset.vel);

        const x = mouseX * velocidade;

        item.style.transform = `translate(${x}px, 0px)`;
    });
});


// Altera o nome na seção hero
const heroNomes = document.querySelector('#hero-nomes');
const heroImagePerson = document.querySelector('#image-hero-person');
const heroImagebg = document.querySelector('#image-hero-bg');
const listaNomes= ['Nome1', 'Nome2'];
let indice = 0;
let imagemIndice = 1;


setInterval(() => {
    const nomeAtual = listaNomes[indice];
    heroNomes.innerHTML = nomeAtual;
    heroImagePerson.src = `src/assets/images/hero/hero-person-0${imagemIndice}.webp`;
    heroImagebg.src = `src/assets/images/hero/hero-bg-0${imagemIndice}.webp`;

    indice = (indice + 1) % listaNomes.length;
    imagemIndice= indice + 1;
}, 5000);



// Muda cor da barra de navegação quando entra ou sai na seção hero
const heroSection = document.querySelector('.hero-section');
const nav = document.querySelector('nav');

const observerHero = new IntersectionObserver(([entry]) => {
        nav.classList.toggle('nav-scrolled', !entry.isIntersecting);
    },
    {
        threshold: 0,
        rootMargin: `-${nav.offsetHeight}px 0px 0px 0px`
    }
);
observerHero.observe(heroSection);


// ativa animação de contagem da seção impactos ao localizar item da animação
const numImpacto = document.querySelector(".num-impactos");
const numImpactoObsever = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animacaoContagem();
            numImpactoObsever.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.5
});
numImpactoObsever.observe(numImpacto);


// animação de contagem da seção impactos
function animacaoContagem() {
    const animContagem = document.querySelectorAll(".num-impactos");
    let intervalo = 1000;

    animContagem.forEach((item) => {
        let valorInicial = 0;
        let valorFinal = parseInt(item.getAttribute("data-val"));
        let sufixo = item.getAttribute("data-sufixo") || "";
        let duracao = Math.max(Math.floor(intervalo / valorFinal), 10); // evita duracao = 0
        let contagem = setInterval(function () {
            valorInicial += 1;
            item.textContent = "+" + valorInicial + sufixo;
            if (valorInicial == valorFinal) {
                clearInterval(contagem);
            }
        }, duracao);
    });
}


// Tela de loafing enquanto o site garrega
const loadingScreen = document.getElementById("loading-screen");
const startTime = Date.now();

window.addEventListener("load", function () {
    const minimumTime = 3000;
    const elapsedTime = Date.now() - startTime;
    const remainingTime = Math.max(0, minimumTime - elapsedTime);

    setTimeout(() => {
        loadingScreen.classList.add("hidden");
    }, remainingTime);
});


// Seção de como doar os itens banner.

const dadosDoacao = {
    roupas: {
        titulo: "Roupas",
        subtitulo: "Se veste bem, serve alguém! doe.",
        imagem: "src/assets/images/roupas.webp",
        detalhes: [
            "Camisas, blazers, calças de alfaiataria, em perfeito estado.",
            "Saias e vestidos bem estruturados.",
            "Sapatos clássicos / calçados formais.",
            "Peças higienizadas, isso facilita muito a distribuição.",
            "Aceitamos bolsas sociais, pastas para documentos."
        ]

    },
    sapatos: {
        titulo: "Sapatos",
        subtitulo: "Se calça bem, serve alguém! doe.",
        imagem: "src/assets/images/sapatos.webp",
        detalhes: [
            "Sapatos, tênis, sandálias, botas, em bom estado, limpos e lavados.",
            "___________________________________________________________",
            "_________________________________________________________",
            "___________________________________________________________",
        ]
    },
    brinquedos: {
        titulo: "Brinquedos",
        subtitulo: "Se diverte bem, serve alguém! doe.",
        imagem: "src/assets/images/brinquedos.webp",
        detalhes: [
            "Brinquedos, jogos, bonecos, em bom estado, limpos e lavados.",
            "___________________________________________________________",
            "_________________________________________________________",
            "___________________________________________________________",
        ]
    },
    livros: {
        titulo: "Livros",
        subtitulo: "Se le o bem, serve alguém! doe.",
        imagem: "src/assets/images/livros.webp",
        detalhes: [
            "Livros, revistas, jornais, em bom estado, limpos e lavados.",
            "___________________________________________________________",
            "_________________________________________________________",
            "___________________________________________________________",
        ]
    },
    mochilas: {
        titulo: "Mochilas",
        subtitulo: "Se carrega bem, serve alguém! doe.",
        imagem: "src/assets/images/mochilas.webp",
        detalhes: [
            "Mochilas, bolsas, em bom estado, limpos e lavados.",
            "___________________________________________________________",
            "_________________________________________________________",
            "___________________________________________________________",
        ]
    },
    alimentos: {
        titulo: "Alimentos",
        subtitulo: "Se alimenta bem, serve alguém! doe.",
        imagem: "src/assets/images/alimentos.webp",
        detalhes: [
            "Alimentos não perecíveis, em bom estado, limpos e lavados.",
            "___________________________________________________________",
            "_________________________________________________________",
            "___________________________________________________________",
        ]
    }
};

function mostrarDoacao(categoria) {

    const dados = dadosDoacao[categoria];
    if (!dados) return;

    const buttons = document.querySelectorAll('.btn-o-que-doar');
    buttons.forEach(btn => {

        const onClickAttr = btn.getAttribute('onclick');
        if (onClickAttr && onClickAttr.includes(categoria)) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }

    });

    const bannerContent = document.querySelector('.banner_content');
    const titulo = document.querySelector('#banner_title');
    const subtitulo = document.querySelector('#banner_txt');
    const lista = document.querySelector('#banner_list');
    lista.innerHTML = dados.detalhes.map((item) => `<li>${item}</li>`).join('');

    if (bannerContent) {
        bannerContent.style.opacity = '0';
        bannerContent.style.transform = 'translateX(10px)';
        bannerContent.style.transition = 'all 0.2s ease-in-out';

        setTimeout(() => {
            if (titulo) titulo.textContent = dados.titulo;
            if (subtitulo) subtitulo.textContent = dados.subtitulo;

            const imgEl = document.querySelector('#banner_img');
            if (imgEl && dados.imagem) {
                imgEl.src = dados.imagem;
                imgEl.alt = dados.titulo;
            }

            if (lista) {
                lista.innerHTML = dados.detalhes
                    .map((item) => `
`)
                    .join('');
            }

            bannerContent.style.opacity = '1';
            bannerContent.style.transform = 'translateX(0)';
        }, 200);
    }

}