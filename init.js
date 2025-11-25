import { connection } from "./bd.js";

const sql = `
CREATE TABLE IF NOT EXISTS estudante (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT,
  email TEXT
);

INSERT INTO estudante (nome, email) VALUES
  ('Bruno', 'bruno@email.com'),
  ('Vivian', 'vivian@email.com'),
  ('Marco', 'marco@email.com');
`;

async function init() {
  const db = await connection();
  await db.exec(sql);
  console.log("Banco SQLite criado com sucesso!");
}

init();
