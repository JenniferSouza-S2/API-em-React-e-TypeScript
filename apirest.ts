import express, { Request, Response } from "express";
import cors from "cors";
import { App } from "./app";
import path from "path";

const app = express();
const porta = 3000;

app.use(cors());
app.use(express.json());

// Servir arquivos estáticos da pasta 'admin'
app.use(express.static(path.join(__dirname, "admin")));

const database = new App();

// --- ROTAS API ---

app.get("/estudantes", async (_req: Request, res: Response) => {
  const alunos = await database.executeSearchQuery();
  res.json(alunos);
});

app.get("/estudantes/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const aluno = await database.searchQueryById(id);
  if (!aluno) return res.status(404).json({ message: "Estudante não encontrado" });
  res.json(aluno);
});

app.post("/estudantes", async (req: Request, res: Response) => {
  const { nome, email } = req.body;
  const result = await database.insertQuery(nome, email);
  res.status(201).json({ id: result.lastID, nome, email });
});

app.put("/estudantes/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { nome, email } = req.body;
  const result = await database.updateQuery(id, nome, email);
  if (result.changes === 0) return res.status(404).json({ message: "Estudante não encontrado" });
  res.json({ message: "Atualizado com sucesso" });
});

app.delete("/estudantes/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const result = await database.deleteQuery(id);
  if (result.changes === 0) return res.status(404).json({ message: "Estudante não encontrado" });
  res.json({ message: "Deletado com sucesso" });
});

// Rota 404
app.use((_req: Request, res: Response) => {
  res.status(404).sendFile(path.join(__dirname, "admin", "index.html"));
});

// Inicia servidor
app.listen(porta, () => console.log(`Servidor rodando em http://localhost:${porta}`));
