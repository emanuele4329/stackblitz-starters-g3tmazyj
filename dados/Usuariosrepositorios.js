const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const arquivo = path.join(__dirname, 'usuarios.json');

function ler() {
  if (!fs.existsSync(arquivo)) return [];
  return JSON.parse(fs.readFileSync(arquivo, 'utf8'));
}

function gerarHash(senha, sal) {
  return crypto.scryptSync(senha, sal, 64).toString('hex');
}

function buscarPorEmail(email) {
  return ler().find(u => u.email === email);
}

function criar(email, senha) {
  const usuarios = ler();
  const sal = crypto.randomBytes(16).toString('hex');
  const usuario = { id: usuarios.length + 1, email, sal, senha: gerarHash(senha, sal) };
  usuarios.push(usuario);
  fs.writeFileSync(arquivo, JSON.stringify(usuarios, null, 2));
  return { id: usuario.id, email };
}

function conferirSenha(usuario, senha) {
  return usuario.senha === gerarHash(senha, usuario.sal);
}

module.exports = { buscarPorEmail, criar, conferirSenha };