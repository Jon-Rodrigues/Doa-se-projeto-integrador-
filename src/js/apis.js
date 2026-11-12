
// API para buscar dados de CNPJ usando a BrasilAPI //

document.addEventListener('DOMContentLoaded', () => {
  const inputCnpj = document.getElementById('CNPJ');

  if (inputCnpj) {
    // Dispara a busca quando o usuário sai do campo CNPJ
    inputCnpj.addEventListener('blur', () => {
      const cnpjLimpo = inputCnpj.value.replace(/\D/g, '');

      if (cnpjLimpo.length === 14) {
        buscarDadosBrasilAPI(cnpjLimpo);
      }
    });
  }
});

async function buscarDadosBrasilAPI(cnpj) {
  const campoRazao = document.getElementById('razao_social');
  const campoFundacao = document.getElementById('data_fundacao');
  const campoTelefone = document.getElementById('telefone_pj');
  const campoEmail = document.getElementById('email_pj');

  // Feedback visual enquanto carrega
  campoRazao.value = 'Buscando dados do CNPJ...';

  try {
    const resposta = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);
    const dados = await resposta.json();

    if (!resposta.ok) {
      campoRazao.value = '';
      alert(dados.message || 'CNPJ não encontrado ou inválido.');
      return;
    }

    // 1. Razão Social
    campoRazao.value = dados.razao_social || '';

    // 2. Data de Fundação (BrasilAPI já envia no formato AAAA-MM-DD)
    if (dados.data_inicio_atividade) {
      campoFundacao.value = dados.data_inicio_atividade;
    }

    // 3. Telefone (BrasilAPI envia ddd_telefone_1 sem formatação, ex: "1133334444")
    if (dados.ddd_telefone_1) {
      campoTelefone.value = formatarTelefone(dados.ddd_telefone_1);
    }

    // 4. Email
    if (dados.email) {
      campoEmail.value = dados.email.toLowerCase();
    }

  } catch (erro) {
    campoRazao.value = '';
    console.error('Erro na requisição:', erro);
    alert('Não foi possível consultar o CNPJ no momento. Tente novamente.');
  }
}

// Função auxiliar para deixar o telefone no formato (00) 0000-0000 ou (00) 00000-0000
function formatarTelefone(tel) {
  const numeros = tel.replace(/\D/g, '');
  if (numeros.length === 11) {
    return numeros.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
  } else if (numeros.length === 10) {
    return numeros.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
  }
  return numeros;
}

// Fim da API para buscar dados de CNPJ usando a BrasilAPI //
////////////////////////////////////////////////////////////

/////////////////////////// validação de CNPJ /////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

function validarCNPJ(cnpj) {

  // Remove pontos, barras e traços, mantendo letras e números em maiúsculo
  cnpj = cnpj.replace(/[^A-Za-z0-9]/g, '').toUpperCase();

  // Deve ter exatamente 14 caracteres e não pode ser uma sequência repetida (ex: 00000000000000)
  if (cnpj.length !== 14 || /^([A-Z0-9])\1{13}$/.test(cnpj)) {
    return false;
  }

  // Converte cada caractere usando o valor ASCII - 48 (regra oficial da Receita Federal)
  // Para números '0'-'9', resulta em 0 a 9. Para letras 'A'-'Z', resulta em 17 a 42.
  const valores = Array.from(cnpj).map(char => char.charCodeAt(0) - 48);

  // Os dois últimos dígitos verificadores são sempre numéricos
  if (valores[12] < 0 || valores[12] > 9 || valores[13] < 0 || valores[13] > 9) {
    return false;
  }

  // Cálculo do 1º Dígito Verificador
  const pesos1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let soma = 0;
  for (let i = 0; i < 12; i++) {
    soma += valores[i] * pesos1[i];
  }
  let resto = soma % 11;
  const dv1 = resto < 2 ? 0 : 11 - resto;

  if (valores[12] !== dv1) return false;

  // Cálculo do 2º Dígito Verificador
  const pesos2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  soma = 0;
  for (let i = 0; i < 13; i++) {
    soma += valores[i] * pesos2[i];
  }
  resto = soma % 11;
  const dv2 = resto < 2 ? 0 : 11 - resto;

  return valores[13] === dv2;
}

// Fim da validação de CNPJ //
/////////////////////////////

// validação de cpf //
/////////////////////

document.addEventListener('DOMContentLoaded', () => {
  const inputCpf = document.getElementById('CPF');

  if (inputCpf) {
    inputCpf.addEventListener('blur', () => {
      const cpf = inputCpf.value;
      if (cpf.trim() !== '' && !validarCPF(cpf)) {
        alert('CPF inválido! Por favor, verifique os números digitados.');
        inputCpf.value = '';
        inputCpf.focus();
      }
    });
  }
});

function validarCPF(cpf) {
  cpf = cpf.replace(/\D/g, '');

  // Verifica se tem 11 dígitos ou se são todos números repetidos
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return false;
  }

  // Validação do 1º dígito verificador
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;

  // Validação do 2º dígito verificador
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(10))) return false;

  return true;
}

// Fim da validação de cpf //
////////////////////////////