import { connection } from "./bd.js";

export class App {

  async executeSearchQuery() {
    const db = await connection();
    const rows = await db.all("SELECT * FROM estudante");
    return rows;
  }

  async searchQueryById(id) {
    const db = await connection();
    const row = await db.get("SELECT * FROM estudante WHERE id = ?", [id]);
    return row;
  }

  async insertQuery(nome, email) {
    const db = await connection();
    const result = await db.run(
      "INSERT INTO estudante (nome, email) VALUES (?, ?)",
      [nome, email]
    );

    return { insertId: result.lastID };
  }

  async updateQuery(id, nome, email) {
    const db = await connection();

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

    dados.push(id);

    const sql = `UPDATE estudante SET ${campos.join(", ")} WHERE id = ?`;

    const result = await db.run(sql, dados);

    return { affectedRows: result.changes };
  }

  async deleteQuery(id) {
    const db = await connection();
    const result = await db.run("DELETE FROM estudante WHERE id = ?", [id]);
    return { affectedRows: result.changes };
  }
}
