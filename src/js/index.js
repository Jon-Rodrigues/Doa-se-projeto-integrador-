

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
const heroImagebgB = document.querySelector('#image-hero-bgB');
const listaNomes= ['Beatriz', 'Ana', 'Lucas', 'Aline'];
let indice = 0;
let imagemIndice = 1;


setInterval(() => {

    // Inicia o desaparecimento da imagem principal
    heroImagebg.classList.add('fade');
    heroImagePerson.classList.add('fade');
    heroNomes.classList.add('fade');

    setTimeout(() => {

        const nomeAtual = listaNomes[indice];

        heroNomes.innerHTML = nomeAtual;

        heroImagePerson.src = `src/assets/images/hero/hero-person-0${imagemIndice}.webp`;

        heroImagebg.src = `src/assets/images/hero/hero-bg-0${imagemIndice}.webp`;


        indice = (indice + 1) % listaNomes.length;
        imagemIndice = indice + 1;

        // Faz a imagem principal reaparecer
        heroImagebg.classList.remove('fade');
        heroImagePerson.classList.remove('fade');
        heroNomes.classList.remove('fade');

    }, 2000);

    heroImagebgB.src = `src/assets/images/hero/hero-bg-0${imagemIndice}.webp`;

}, 12000);



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
            "Sapatos, tênis, sandálias, botas, em bom estado, limpos e lavados; ",
            "Chuteiras de futebol, acessórios; ",
            "Os itens acima nao podem estar descolando ou rasgados; ",
            "Doe com consciência prezando sempre a solidariedade e amor. ",
        ]
    },
    brinquedos: {
        titulo: "Brinquedos",
        subtitulo: "Se diverte bem, serve alguém! doe.",
        imagem: "src/assets/images/brinquedos.webp",
        detalhes: [
            "Brinquedos educativos: blocos de montar, brinquedos de encaixe didático; ",
            "Jogos de raciocínio: quebra-cabeças, tabuleiros, jogos de cartas; ",
            "Bonecas, carrinhos, casinhas; ",
            "Brinquedos de ar livre: bola, bicicleta, patins, em estado bom para uso. ",
        ]
    },
    livros: {
        titulo: "Livros",
        subtitulo: "Se le o bem, serve alguém! doe.",
        imagem: "src/assets/images/livros.webp",
        detalhes: [
            "Obras literárias (Ficção, romance, crônicas); ",
            "Livros infantis e infojuvenis; ",
            "Dicionários, enciclopédia, obras de referências atualizadas; ",
            "Materias de apoio pedagógico e livros didáticos. ",
        ]
    },
    mochilas: {
        titulo: "Mochilas",
        subtitulo: "Se carrega bem, serve alguém! doe.",
        imagem: "src/assets/images/mochilas.webp",
        detalhes: [
            "Mochilas, bolsas, em bom estado, limpos e lavados; ",
            "Mochilas infantis, de rodinha, entre outros; ",
            "pastas sociais; ",
            "Sempre prezar ao doar algo, doe em bom estado",
        ]
    },
    alimentos: {
        titulo: "Alimentos",
        subtitulo: "Se alimenta bem, serve alguém! doe.",
        imagem: "src/assets/images/alimentos.webp",
        detalhes: [
            "Alimentos não perecíveis, em boa conserva; ",
            "Produtos com longa data de vencimento; ",
            "Não doar alimentos próximo ao vencimento ou já aberto",
            "Seja cuidadoso com alimento que irá doar",
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
                    .map((item) => `<li>${item}</li>`) 

                    .join('');
            }

            bannerContent.style.opacity = '1';
            bannerContent.style.transform = 'translateX(0)';
        }, 200);
    }

}



const estado = document.querySelectorAll('.mapa-estados');
const sigla = document.querySelector('#sigla-mapa');
const qtdOngEstado = document.querySelector('#qtd-ong-estado');
const nomeEstado = document.querySelector('#nome-estado');

let ongs = [];

// Buscar ONGs no banco através da API
async function carregarOngs() {
    try {
        const resposta = await fetch("http://127.0.0.1:8000/ongs/estados");

        if (!resposta.ok) {
            throw new Error("Erro ao buscar ONGs");
        }

        ongs = await resposta.json();

    } catch (erro) {
        console.error(erro);
    }
}

function Estado(elemento) {

    const estadoId = elemento.id;
    sigla.innerHTML = estadoId;

    const quantidade = ongs.filter(ong =>
        ong.estado === estadoId
    )

    qtdOngEstado.innerHTML = quantidade.length;

    const limparEstado = document.querySelector('.mapa-click');

    if (limparEstado) {
        limparEstado.classList.replace("mapa-click", "mapa-estados");
    }

    elemento.classList.replace("mapa-estados", "mapa-click");


    const nomesEstados = {
    AC: "Acre",
    AL: "Alagoas",
    AP: "Amapá",
    AM: "Amazonas",
    BA: "Bahia",
    CE: "Ceará",
    DF: "Distrito Federal",
    ES: "Espírito Santo",
    GO: "Goiás",
    MA: "Maranhão",
    MT: "Mato Grosso",
    MS: "Mato Grosso do Sul",
    MG: "Minas Gerais",
    PA: "Pará",
    PB: "Paraíba",
    PR: "Paraná",
    PE: "Pernambuco",
    PI: "Piauí",
    RJ: "Rio de Janeiro",
    RN: "Rio Grande do Norte",
    RS: "Rio Grande do Sul",
    RO: "Rondônia",
    RR: "Roraima",
    SC: "Santa Catarina",
    SP: "São Paulo",
    SE: "Sergipe",
    TO: "Tocantins"
};

nomeEstado.innerHTML = nomesEstados[estadoId] || "Estado não identificado";


}

carregarOngs();


