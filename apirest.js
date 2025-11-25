import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { App } from './app.js';
import cors from 'cors';

const app = express();
const porta = 3000;

// dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDirectory = path.join(__dirname, 'admin');

app.use(express.json());
app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE"] }));

const crud = new App();

app.use(express.static(rootDirectory));

app.get('/', (req, res) => {
    res.sendFile(path.join(rootDirectory, "index.html"));
});

/* ------- ROTAS ------- */

app.get('/usuarios', async (req, res) => {
    try {
        const usuarios = await crud.executeSearchQuery();
        res.json(usuarios);
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: "Erro interno ao listar usuários." });
    }
});

app.get('/usuarios/:id', async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "ID inválido" });

    try {
        const user = await crud.searchQueryById(id);
        if (!user) return res.status(404).json({ message: "Usuário não encontrado" });
        res.json(user);
    } catch (e) {
        res.status(500).json({ message: "Erro interno ao buscar usuário" });
    }
});

app.post('/usuarios', async (req, res) => {
    const { nome, email } = req.body;

    if (!nome || !email) {
        return res.status(400).json({ message: "Nome e email são obrigatórios" });
    }

    try {
        const result = await crud.insertQuery(nome, email);
        res.status(201).json({ message: "Criado!", id: result.insertId });
    } catch (e) {
        res.status(500).json({ message: "Erro ao inserir" });
    }
});

app.put('/usuarios', async (req, res) => {
    const { id, nome, email } = req.body;

    if (!id) return res.status(400).json({ message: "ID obrigatório" });

    try {
        const result = await crud.updateQuery(id, nome, email);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Nenhuma linha alterada" });
        }

        res.json({ message: "Atualizado!" });
    } catch (e) {
        res.status(500).json({ message: "Erro ao atualizar" });
    }
});

app.delete('/usuarios/:id', async (req, res) => {
    const id = Number(req.params.id);

    try {
        const result = await crud.deleteQuery(id);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Não encontrado" });
        }

        res.status(204).send();
    } catch (e) {
        res.status(500).json({ message: "Erro ao deletar" });
    }
});

app.listen(porta, () => {
    console.log(`API rodando em http://localhost:${porta}`);
});
