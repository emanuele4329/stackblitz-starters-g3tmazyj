const formulario = document.getElementById('form-login');
const campoEmail = document.getElementById('email');
const campoSenha = document.getElementById('senha');
const botaoCadastrar = document.getElementById('botao-cadastrar');
const mensagem = document.getElementById('mensagem');

function mostrarMensagem(texto, tipo) {
  mensagem.textContent = texto;
  mensagem.className = tipo;
}

async function enviar(rota) {
  const dados = { email: campoEmail.value.trim(), senha: campoSenha.value };

  try {
    const resposta = await fetch(`/login/${rota}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });
    const corpo = await resposta.json();

    if (!resposta.ok) {
      mostrarMensagem(corpo.erro, 'erro');
      return;
    }

    if (rota === 'entrar') {
      sessionStorage.setItem('token', corpo.token);
      mostrarMensagem(`Bem-vindo, ${corpo.email}!`, 'sucesso');
    } else {
      mostrarMensagem('Cadastro feito! Agora é só entrar.', 'sucesso');
    }
  } catch {
    mostrarMensagem('Erro de conexão com o servidor.', 'erro');
  }
}

formulario.addEventListener('submit', evento => {
  evento.preventDefault();
  enviar('entrar');
});
botaoCadastrar.addEventListener('click', () => enviar('cadastrar'));