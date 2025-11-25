import { connection } from "./bd";

export class App {
  async executeSearchQuery() {
    const db = await connection();
    const alunos = await db.all("SELECT * FROM estudante");
    await db.close();
    return alunos;
  }

  async searchQueryById(id: number) {
    const db = await connection();
    const aluno = await db.get("SELECT * FROM estudante WHERE id = ?", id);
    await db.close();
    return aluno;
  }

  async insertQuery(nome: string, email: string) {
    const db = await connection();
    const result = await db.run("INSERT INTO estudante (nome, email) VALUES (?, ?)", [nome, email]);
    await db.close();
    return result;
  }

  async updateQuery(id: number, nome: string, email: string) {
    const db = await connection();
    const result = await db.run("UPDATE estudante SET nome = ?, email = ? WHERE id = ?", [nome, email, id]);
    await db.close();
    return result;
  }

  async deleteQuery(id: number) {
    const db = await connection();
    const result = await db.run("DELETE FROM estudante WHERE id = ?", id);
    await db.close();
    return result;
  }
}
