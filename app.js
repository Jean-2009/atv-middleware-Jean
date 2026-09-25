import express from "express";

const app = express();
const PORT = 3000;

app.use(express.json());

// 2) Crie uma rota GET /tarefas que retorne um array fixo (em memória) de pelo menos 3 tarefas, cada uma com id, titulo e concluida.
let tarefas = [
  { id: 1, titulo: "Estudar Express.js", concluida: false },
  { id: 2, titulo: "Criar middlewares na API", concluida: true },
  { id: 3, titulo: "Testar rotas no Postman", concluida: false },
];

function autenticar(req, res, next) {
  console.log("[Autenticação] Verificando acesso...");
  if (req.headers["x-auth"] === "bloqueado") {
    return res.status(401).json({ erro: "Acesso não autorizado!" });
  }
  next();
}

function validarCorpo(req, res, next) {
  console.log("[Validação] Checando dados recebidos...");
  const { titulo } = req.body;

  if (!titulo || typeof titulo !== "string" || titulo.trim() === "") {
    return res.status(400).json({
      erro: 'O campo "titulo" é obrigatório e deve ser uma string válida.',
    });
  }

  next();
}

function registrarLog(req, res, next) {
  const dataHora = new Date().toISOString();
  console.log(
    `[Log] [${dataHora}] Ação: Tentativa de criação da tarefa "${req.body.titulo}"`
  );
  next();
}

// 1) Crie um projeto Express do zero e um servidor que responda "API de Tarefas no ar" na rota GET /.
app.get("/", (req, res) => {
  res.send("API de Tarefas no ar");
});

// 2) Crie uma rota GET /tarefas que retorne um array fixo (em memória) de pelo menos 3 tarefas, cada uma com id, titulo e concluida.
// 4) Crie uma rota GET /tarefas que aceite uma query string ?concluida=true e filtre a lista de acordo.
app.get("/tarefas", (req, res) => {
  const { concluida } = req.query;

  if (concluida !== undefined) {
    const statusBooleano = concluida === "true";
    const tarefasFiltradas = tarefas.filter(
      (t) => t.concluida === statusBooleano
    );
    return res.json(tarefasFiltradas);
  }

  res.json(tarefas);
});

// 3) Crie uma rota GET /tarefas/:id que retorne apenas a tarefa cujo id corresponda ao parâmetro. Se não encontrar, responda com status 404 e uma mensagem de erro em JSON.
app.get("/tarefas/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const tarefa = tarefas.find((t) => t.id === id);

  if (!tarefa) {
    return res.status(404).json({ erro: "Tarefa não encontrada!" });
  }

  res.json(tarefa);
});

// 5) Configure express.json() e crie uma rota POST /tarefas que receba titulo no corpo da requisição e adicione uma nova tarefa ao array em memória, retornando status 201.
// 1) Combine, em uma única rota POST /tarefas, a execução encadeada de três middlewares distintos já construídos ao longo dos exemplos anteriores, na seguinte ordem: autenticação → validação do corpo → registro de log da ação. Utilize a sintaxe que permite passar um array de middlewares para app.post() (ex.: app.post('/tarefas', [middleware1, middleware2], rotaFinal)), em vez de aplicá-los apenas com app.use() global.
app.post(
  "/tarefas",
  [autenticar, validarCorpo, registrarLog],
  (req, res) => {
    const { titulo } = req.body;

    const novaTarefa = {
      id: tarefas.length > 0 ? tarefas[tarefas.length - 1].id + 1 : 1,
      titulo,
      concluida: false,
    };

    tarefas.push(novaTarefa);
    res.status(201).json(novaTarefa);
  }
);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});