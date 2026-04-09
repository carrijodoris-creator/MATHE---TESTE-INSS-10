const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const app = express();
const adapter = new FileSync('database.json');
const db = low(adapter);

app.use(bodyParser.json());
app.use(express.static('public'));

let sessions = {};

app.post('/login', async (req, res) => {
  const { cpf, senha } = req.body;
  const user = db.get('users').find({ cpf }).value();
  if (!user) return res.json({ success: false });

  const ok = await bcrypt.compare(senha, user.senha);
  if (!ok) return res.json({ success: false });

  const token = Date.now().toString();
  sessions[token] = user;

  res.json({ success: true, token, tipo: user.tipo });
});

app.post('/consulta', (req, res) => {
  const { token } = req.body;
  const user = sessions[token];
  if (!user) return res.json({ error: "Não autorizado" });

  const beneficio = db.get('beneficios').find({ cpf: user.cpf }).value();
  res.json({ beneficio });
});

app.get('/admin/users', (req, res) => {
  res.json(db.get('users').value());
});

app.post('/admin/add', async (req, res) => {
  const { nome, cpf, senha, email } = req.body;
  const hash = await bcrypt.hash(senha, 10);
  db.get('users').push({ nome, cpf, email, senha: hash, tipo: "user" }).write();
  res.json({ ok: true });
});

app.post('/admin/update', async (req, res) => {
  const { cpf, nome, email, senha } = req.body;
  let update = { nome, email };
  if (senha) update.senha = await bcrypt.hash(senha, 10);
  db.get('users').find({ cpf }).assign(update).write();
  res.json({ ok: true });
});

app.post('/admin/delete', (req, res) => {
  db.get('users').remove({ cpf: req.body.cpf }).write();
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Rodando porta " + PORT));
