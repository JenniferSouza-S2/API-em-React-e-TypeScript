import express from "express";
import path from "path";
import cors from "cors";
import { App } from "./app.ts"; // sua classe CRUD
const app = express();
const porta = 3000;
// Middlewares
app.use(express.json());
app.use(cors({ origin: "*" }));
// Instância do CRUD
const crud = new App();
// ----------------- ROTAS API -----------------
// Listar todos os usuários
app.get("/usuarios", async (_req, res) => {
    try {
        const usuarios = await crud.executeSearchQuery();
        res.status(200).json(usuarios);
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ message: "Erro interno ao listar usuários." });
    }
});
// Buscar usuário por ID
app.get("/usuarios/:id", async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id))
        return res.status(400).json({ message: "ID inválido" });
    try {
        const usuario = await crud.searchQueryById(id);
        if (!usuario)
            return res.status(404).json({ message: "Usuário não encontrado" });
        res.status(200).json(usuario);
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ message: "Erro interno ao buscar usuário." });
    }
});
// Inserir usuário
app.post("/usuarios", async (req, res) => {
    const { nome, email } = req.body;
    if (!nome || !email)
        return res.status(400).json({ message: "Nome e email são obrigatórios" });
    try {
        const result = await crud.insertQuery(nome, email);
        res.status(201).json({ message: "Usuário criado!", id: result.insertId });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ message: "Erro ao inserir usuário." });
    }
});
// Atualizar usuário
app.put("/usuarios", async (req, res) => {
    const { id, nome, email } = req.body;
    if (!id)
        return res.status(400).json({ message: "ID obrigatório" });
    if (!nome && !email)
        return res.status(400).json({ message: "Informe ao menos nome ou email para atualizar" });
    try {
        const result = await crud.updateQuery(id, nome, email);
        if (result.affectedRows === 0)
            return res.status(404).json({ message: "Nenhuma linha alterada" });
        res.status(200).json({ message: "Usuário atualizado!" });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ message: "Erro ao atualizar usuário." });
    }
});
// Deletar usuário
app.delete("/usuarios/:id", async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id))
        return res.status(400).json({ message: "ID inválido" });
    try {
        const result = await crud.deleteQuery(id);
        if (result.affectedRows === 0)
            return res.status(404).json({ message: "Usuário não encontrado" });
        res.status(204).send();
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ message: "Erro ao deletar usuário." });
    }
});
// ----------------- SERVIR FRONTEND REACT -----------------
const buildPath = path.join(process.cwd(), "frontend", "build");
app.use(express.static(buildPath));
// Qualquer rota que não seja /usuarios vai para o React
app.get("*", (_req, res) => {
    res.sendFile(path.join(buildPath, "index.html"));
});
// ----------------- INICIAR SERVIDOR -----------------
app.listen(porta, () => {
    console.log(`Servidor rodando em http://localhost:${porta}`);
});
