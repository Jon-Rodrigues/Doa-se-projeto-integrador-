    
const API = 'http://127.0.0.1:8000';



function escolherTipo(tipo) {
    document.getElementById('popup').hidePopover();

    const remessa = document.getElementById('modo-remessa').checked;

    adicionar(tipo, remessa);
}



function adicionar(tipo, remessa) {
    const grupo = document.getElementById('grupo-' + tipo);

    if (!grupo) {
        console.error('Grupo não encontrado:', tipo);
        return;
    }

    const modeloDosCampos = grupo.querySelector(
        remessa ? '.campos-remessa' : '.campos-item'
    );

    if (!modeloDosCampos) {
        console.error('Modelo de campos não encontrado:', tipo);
        return;
    }

    const item = document
        .getElementById('modelo-item')
        .content.firstElementChild.cloneNode(true);

    item.querySelector('.campos').appendChild(
        modeloDosCampos.content.cloneNode(true)
    );


    item.dataset.remessa = remessa ? 'true' : 'false';

    if (remessa) {
        item.classList.add('remessa');
    }

    grupo.querySelector('.itens').appendChild(item);

    grupo.classList.remove('fechado');

    atualizar();

    const primeiroCampo = item.querySelector(
        '.campos select, .campos input'
    );

    if (primeiroCampo) {
        primeiroCampo.focus();
    }
}

function removerItem(botao) {
    botao.closest('.item').remove();
    atualizar();
}

function removerTipo(botao) {
    botao.closest('.grupo').querySelector('.itens').innerHTML = '';
    atualizar();
}



function mudarQtd(botao, mudanca) {
    const campo = botao.parentElement.querySelector('.qtd');

    campo.value = Math.max(
        1,
        (Number(campo.value) || 1) + mudanca
    );

    atualizar();
}



function alternar(botao) {
    const elemento = botao.closest('.item, .grupo');

    if (elemento) {
        elemento.classList.toggle('fechado');
    }
}



function atualizar() {
    let totalUnidades = 0;
    let totalTipos = 0;

    document.querySelectorAll('.grupo').forEach(grupo => {
        const itens = grupo.querySelectorAll('.item');

        let unidades = 0;

        itens.forEach(item => {
            unidades += Number(item.querySelector('.qtd').value) || 0;
            resumir(item);
        });

        grupo.hidden = itens.length === 0;

        grupo.querySelector('.sub').textContent = unidades + ' un.';

        totalUnidades += unidades;

        if (itens.length > 0) {
            totalTipos++;
        }
    });

    document.getElementById('vazio').hidden = totalTipos > 0;

    document.getElementById('total-un').textContent =
        totalUnidades + ' un.';

    document.getElementById('total-tipos').textContent = totalTipos;

    document.getElementById('botao-enviar').disabled = totalTipos === 0;
}



function resumir(item) {
    const partes = [];

    item.querySelectorAll('[data-resumo]').forEach(campo => {
        if (campo.value && campo.value !== 'Variados') {
            partes.push(campo.value);
        }
    });

    const padrao = item.classList.contains('remessa')
        ? 'Itens variados'
        : 'Novo item';

    item.querySelector('.resumo').textContent =
        partes.join(' · ') || padrao;
}



async function enviar(evento) {
    evento.preventDefault();

    document.body.classList.add('tentou');

    const invalido = document.querySelector('#lista :invalid');

    if (invalido) {
        invalido.closest('.item').classList.remove('fechado');
        invalido.closest('.grupo').classList.remove('fechado');

        invalido.reportValidity();
        return;
    }

    const itens = [];

    document.querySelectorAll('.grupo:not([hidden])').forEach(grupo => {
        const categoria = grupo.id.replace('grupo-', '');

        grupo.querySelectorAll('.itens > li').forEach(li => {
            const d = {};

            li.querySelectorAll('.campos label').forEach(label => {
                const campo = label.querySelector('select, input');

                if (!campo) return;

                const nome = label.firstChild.textContent
                    .replace('*', '')
                    .trim();

                d[nome] = campo.value;
            });

            const partes = [
                'Tipo',
                'Título',
                'Categoria',
                'Público',
                'Faixa etária',
                'Peso ou volume',
                'Observações'
            ]
            .filter(k => d[k])
            .map(k => k + ': ' + d[k]);

            itens.push({
                categoria: categoria,
                em_lote: li.dataset.remessa === 'true',
                quantidade: Number(li.querySelector('.qtd').value),
                condicao: d['Condição'] || null,
                tamanho: d['Tamanho'] || null,
                genero: d['Gênero'] || null,
                validade: d['Validade'] || d['Validade mais próxima'] || null,
                descricao: partes.join(' | ')
            });
        });
    });

    const respostaGet = await fetch("http://127.0.0.1:8000/me", {
        method: "GET",
        credentials: "include"
    });

    const usuario = await respostaGet.json()

    const usuarioId = usuario.id_usuario

    const caixaAviso = document.getElementById('aviso');

    try {
        const resposta = await fetch(API + '/doacoes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id_doador: usuarioId,
                id_ong_destino: null,
                id_ponto_coleta: null,
                itens: itens
            })
        });

        caixaAviso.hidden = false;

        if (resposta.ok) {
            caixaAviso.textContent = 'Doação enviada com sucesso!';

            document.querySelectorAll('.grupo .itens').forEach(lista => {
                lista.innerHTML = '';
            });

            document.body.classList.remove('tentou');
            atualizar();

        } else {
            const erro = await resposta.json();

            caixaAviso.textContent =
                'Erro: ' + JSON.stringify(erro.detail || erro);
        }

    } catch (erro) {
        console.error('Erro ao enviar:', erro);

        caixaAviso.hidden = false;
        caixaAviso.textContent =
            'Não foi possível conectar ao servidor.';
    }
}


function aviso(texto) {
    const caixa = document.getElementById('aviso');

    caixa.textContent = texto;
    caixa.hidden = false;

    clearTimeout(aviso.timer);

    aviso.timer = setTimeout(() => {
        caixa.hidden = true;
    }, 2500);
}



atualizar();



