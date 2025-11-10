import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { App } from './app.js';
import cors from 'cors';

const app = express(); // Mais usual chamar de app
const porta = 3000;

// Configuração para __dirname em ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDirectory = path.join(__dirname, 'admin');

// Middlewares
app.use(express.json());
app.use(cors({
    origin: 'http://127.0.0.1:5500' // Ajuste conforme a porta do frontend
}));

const crud = new App(); // Instância do seu CRUD



// Servir arquivos estáticos (HTML, CSS, JS)
app.use(express.static(rootDirectory));

// Rota padrão
app.get('/', (req, res) => {
    res.sendFile(path.join(rootDirectory, 'index.html'));
});


// --- ROTAS RESTFUL USUÁRIOS ---

// Listar todos os usuários
app.get('/usuarios', async (req, res) => {
    try {
        const usuarios = await crud.executeSearchQuery();
        res.status(200).json(usuarios);
    } catch (error) {
        console.error('Erro ao listar usuários:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao listar usuários.' });
    }
});

// Buscar usuário por ID
app.get('/usuarios/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: 'ID de usuário inválido.' });

    try {
        const usuario = await crud.searchQueryById(id);
        if (!usuario) return res.status(404).json({ message: 'Usuário não encontrado.' });
        res.status(200).json(usuario);
    } catch (error) {
        console.error(`Erro ao buscar usuário ${id}:`, error);
        res.status(500).json({ message: 'Erro interno do servidor ao buscar usuário.' });
    }
});

// Inserir usuário
app.post('/usuarios', async (req, res) => {
    const { nome, email } = req.body;
    if (!nome || !email) return res.status(400).json({ message: 'Nome e email são obrigatórios.' });

    try {
        const novoUsuario = await crud.insertQuery(nome, email);
        res.status(201).json({ message: 'Usuário inserido com sucesso!', usuario: novoUsuario });
    } catch (error) {
        console.error('Erro ao inserir usuário:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao inserir usuário.' });
    }
});

// Atualizar usuário
app.put('/usuarios', async (req, res) => {
    const { id, nome, email } = req.body;

    if (isNaN(id)) return res.status(400).json({ message: 'ID de usuário inválido.' });
    if (!nome && !email) return res.status(400).json({ message: 'Informe ao menos nome ou email para atualização.' });

    try {
        await crud.updateQuery(id, nome, email);
        res.status(200).json({ message: `Usuário ${id} atualizado com sucesso!` });
    } catch (error) {
        console.error(`Erro ao atualizar usuário ${id}:`, error);
        res.status(500).json({ message: 'Erro interno do servidor ao atualizar usuário.' });
    }
});

// Deletar usuário
app.delete('/usuarios/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: 'ID de usuário inválido.' });

    try {
        await crud.deleteQuery(id);
        res.status(204).send();
    } catch (error) {
        console.error(`Erro ao deletar usuário ${id}:`, error);
        res.status(500).json({ message: 'Erro interno do servidor ao deletar usuário.' });
    }
});

// --- INICIAR SERVIDOR ---
app.listen(porta, () => {
    console.log(`API RESTful rodando em: http://localhost:${porta}`);
});
