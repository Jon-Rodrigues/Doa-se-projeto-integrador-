

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