

function quero_doar() { // Função para redirecionar o usuário para a página de login ou registro

    window.location.href = "login_regis.html";
}


// Efeito parallax na seção hero
const parallax = document.querySelectorAll('.parallax');

document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth - 0.5;

    parallax.forEach((item) => {
        const velocidade = Number(item.dataset.speed);

        const x = mouseX * velocidade;

        item.style.transform = `translate(${x}px, 0px)`;
    });
});



// Muda cor da barra de navegação quando entra ou sai na seção hero
const heroSection = document.querySelector('.hero-section');
const nav = document.querySelector('nav');

const observer = new IntersectionObserver(
    ([entry]) => {
        nav.classList.toggle('nav-scrolled', !entry.isIntersecting);
    },
    {
        threshold: 0,
        rootMargin: `-${nav.offsetHeight}px 0px 0px 0px`
    }
);

observer.observe(heroSection);