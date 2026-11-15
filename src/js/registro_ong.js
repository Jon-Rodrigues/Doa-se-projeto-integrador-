const atuacao = document.querySelector("#atuacao");
const projeto = document.querySelector("#projeto");

const opcoesProjetos = {
    social: ["Combate à pobreza", "distribuição de alimentos", "acolhimento social", "assistência a famílias vulneráveis"],
    educacao: ["Alfabetização", "reforço escolar", "educação infantil", "bolsas de estudo", "inclusão educacional"],
    saude: ["Saúde pública", "saúde mental", "prevenção de doenças", "atendimento médico", "apoio a pacientes"],
    direito: ["Igualdade social", "combate à discriminação", "defesa dos direitos humanos", "cidadania"],
    crianca: ["Proteção infantil", "combate ao trabalho infantil", "acolhimento", "desenvolvimento juvenil"],
    idoso: ["Assistência à terceira idade", "convivência social", "cuidados e inclusão"],
    deficiencia: ["Acessibilidade", "inclusão social", "inclusão profissional", "reabilitação"],
    moradia: ["Habitação popular", "reforma de moradias", "apoio a pessoas em situação de rua"],
    alimentar: ["Combate à fome", "hortas comunitárias", "distribuição de cestas básicas"],
    emprego: ["Capacitação profissional", "geração de renda", "empreendedorismo", "inserção no mercado de trabalho"],
    comunidade: ["Desenvolvimento comunitário", "apoio a comunidades rurais", "fortalecimento local"],
    desastre: ["Ajuda humanitária", "apoio a vítimas de enchentes", "incêndios e desastres naturais"],
    dependencia: ["Prevenção", "recuperação", "acolhimento e reinserção social"],
};

atuacao.addEventListener("change", () => {
    projeto.innerHTML = "";

    const itens = opcoesProjetos[atuacao.value] || [];

    itens.forEach(item => {
        const label = document.createElement("label");

        label.style.display = "block";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = item;

        label.appendChild(checkbox);
        label.append(" " + item);

        projeto.appendChild(label);
    });
});


const categoria = document.querySelector("#categoriaCargo");
const cargo = document.querySelector("#cargo");

const opcoesCargo = {
    presidencia: ["Presidente", "Vice-presidente", "Presidente do Conselho Deliberativo", "Presidente do Conselho Fiscal", "Presidente do Conselho Consultivo"],
    diretoria: ["Diretor executivo", "Diretor geral", "Diretor administrativo", "Diretor financeiro", "Diretor operacional", "Diretor institucional", "Diretor jurídico", "Diretor de patrimônio", "Diretor de recursos humanos", "Diretor de comunicação", "Diretor de projetos", "Diretor de captação de recursos", "Diretor de relações institucionais"],
    secretaria: ["Secretário-geral", "Primeiro secretário", "Segundo secretário", "Secretário administrativo", "Secretário executivo"],
    financeiro: ["Diretor financeiro", "Tesoureiro", "Vice-tesoureiro", "Primeiro tesoureiro", "Segundo tesoureiro", "Controlador financeiro"],
    coordenacao: ["Coordenador-geral", "Coordenador de projetos", "Coordenador de voluntários", "Coordenador social", "Coordenador de campanhas", "Coordenador de arrecadação", "Coordenador de comunicação", "Coordenador de logística"],
    conselho: ["Presidente do conselho", "Vice-presidente do conselho", "Conselheiro titular", "Conselheiro suplente", "Conselheiro fiscal", "Conselheiro consultivo", "Conselheiro deliberativo"],
    representante: ["Representante legal titular", "Representante legal substituto", "Procurador legal"],
};

categoria.addEventListener("change", () => {
    cargo.innerHTML = "";

    const itens = opcoesCargo[categoria.value] || [];

    // Opção inicial (placeholder)
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = itens.length ? "Selecione um cargo" : "Selecione uma categoria primeiro";
    placeholder.disabled = true;
    placeholder.selected = true;
    cargo.appendChild(placeholder);

    itens.forEach(item => {
        const option = document.createElement("option");
        option.value = item;
        option.textContent = item;
        cargo.appendChild(option);
    });
});