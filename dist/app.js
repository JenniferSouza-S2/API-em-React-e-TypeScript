import { connection } from "./bd.js";
export class App {
    // Listar todos os estudantes
    async executeSearchQuery() {
        const db = await connection();
        try {
            const rows = await db.all("SELECT * FROM estudante");
            return rows;
        }
        finally {
            await db.close();
        }
    }
    // Buscar estudante por ID
    async searchQueryById(id) {
        const db = await connection();
        try {
            const row = await db.get("SELECT * FROM estudante WHERE id = ?", [id]);
            return row;
        }
        finally {
            await db.close();
        }
    }
    // Inserir estudante
    async insertQuery(nome, email) {
        const db = await connection();
        try {
            const result = await db.run("INSERT INTO estudante (nome, email) VALUES (?, ?)", [nome, email]);
            return { insertId: result.lastID };
        }
        finally {
            await db.close();
        }
    }
    // Atualizar estudante
    async updateQuery(id, nome, email) {
        const db = await connection();
        try {
            const dados = [];
            const campos = [];
            if (nome) {
                campos.push("nome = ?");
                dados.push(nome);
            }
            if (email) {
                campos.push("email = ?");
                dados.push(email);
            }
            dados.push(id); // último parâmetro é o ID
            if (campos.length === 0) {
                return { affectedRows: 0 }; // nada para atualizar
            }
            const sql = `UPDATE estudante SET ${campos.join(", ")} WHERE id = ?`;
            const result = await db.run(sql, dados);
            return { affectedRows: result.changes };
        }
        finally {
            await db.close();
        }
    }
    // Deletar estudante
    async deleteQuery(id) {
        const db = await connection();
        try {
            const result = await db.run("DELETE FROM estudante WHERE id = ?", [id]);
            return { affectedRows: result.changes };
        }
        finally {
            await db.close();
        }
    }
}
