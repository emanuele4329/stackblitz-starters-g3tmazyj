const crypto = require('crypto');
const repo = require('../dados/usuariosRepositorio');

const sessoes = new Map(); // token -> email

function cadastrar(req, res) {
  const { email, senha } = req.body;

  if (!email || !senha || senha.length < 4) {
    return res.status(400).json({ erro: 'Informe um email e uma senha (mínimo 4 caracteres)' });
  }
  if (repo.buscarPorEmail(email)) {
    return res.status(409).json({ erro: 'Este email já está cadastrado' });
  }

  res.status(201).json(repo.criar(email, senha));
}

function entrar(req, res) {
  const { email, senha } = req.body;
  const usuario = repo.buscarPorEmail(email);

  if (!usuario || !repo.conferirSenha(usuario, senha || '')) {
    return res.status(401).json({ erro: 'Email ou senha inválidos' });
  }

  const token = crypto.randomBytes(24).toString('hex');
  sessoes.set(token, usuario.email);
  res.json({ token, email: usuario.email });
}

function sair(req, res) {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  sessoes.delete(token);
  res.status(204).send();
}

// pronto para usar no futuro, se quiser proteger alguma rota
function autenticar(req, res, next) {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  if (!sessoes.has(token)) {
    return res.status(401).json({ erro: 'Não autorizado' });
  }
  req.usuario = sessoes.get(token);
  next();
}

module.exports = { cadastrar, entrar, sair, autenticar };