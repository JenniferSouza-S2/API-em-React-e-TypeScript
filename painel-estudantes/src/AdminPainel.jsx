import React, { useState, useEffect } from "react";
import "./style.css";


function AdminPainel() {
  const API_URL = "http://localhost:3000/usuarios";

  const [estudantes, setEstudantes] = useState([]);
  const [id, setId] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");

  // LISTAR TODOS
  const listarTodos = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setEstudantes(data);
      mostrarMensagem("Lista carregada!");
    } catch (err) {
      mostrarMensagem("Erro ao carregar alunos");
    }
  };

  // BUSCAR POR ID
  const buscarPorId = async () => {
    if (!id) return alert("Informe o ID para buscar.");
    try {
      const res = await fetch(`${API_URL}/${id}`);
      if (res.status === 404) return alert("Aluno não encontrado");
      const aluno = await res.json();
      setNome(aluno.nome);
      setEmail(aluno.email);
    } catch (err) {
      alert("Erro ao buscar aluno");
    }
  };

  // INSERIR
  const inserirAluno = async () => {
    if (!nome || !email) return alert("Preencha nome e email.");
    try {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email }),
      });
      mostrarMensagem("Aluno inserido com sucesso!");
      setNome("");
      setEmail("");
      listarTodos();
    } catch (err) {
      mostrarMensagem("Erro ao inserir aluno");
    }
  };

  // ATUALIZAR
  const atualizarAluno = async () => {
    if (!id) return alert("Informe o ID do aluno para atualizar.");
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email }),
      });
      mostrarMensagem("Aluno atualizado com sucesso!");
      listarTodos();
    } catch (err) {
      mostrarMensagem("Erro ao atualizar aluno");
    }
  };

  // DELETAR
  const deletarAluno = async () => {
    if (!id) return alert("Informe o ID do aluno para deletar.");
    if (!window.confirm("Tem certeza que deseja excluir este aluno?")) return;
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      mostrarMensagem("Aluno deletado com sucesso!");
      listarTodos();
    } catch (err) {
      mostrarMensagem("Erro ao deletar aluno");
    }
  };

  // MENSAGEM TEMPORÁRIA
  const mostrarMensagem = (texto) => {
    setMensagem(texto);
    setTimeout(() => setMensagem(""), 3000);
  };

  // Carregar lista ao abrir
  useEffect(() => {
    listarTodos();
  }, []);

  return (
    <div className="container">
      <h1>Painel de Administração de Estudantes</h1>
      {mensagem && <div id="mensagem">{mensagem}</div>}

      <h2>Dados do Estudante</h2>
      <div className="inputs">
        <input
          type="text"
          placeholder="ID (para Buscar/Atualizar/Deletar)"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="crud-buttons">
        <button onClick={inserirAluno}>Inserir</button>
        <button onClick={buscarPorId}>Buscar por ID</button>
        <button onClick={atualizarAluno}>Atualizar</button>
        <button onClick={deletarAluno}>Deletar</button>
      </div>

      <hr />

      <h2>Lista de Estudantes</h2>
      <button onClick={listarTodos}>Listar Todos</button>

      <div className="tabela-wrapper">
        <table id="tabelaUsuarios">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {estudantes.length === 0 ? (
              <tr>
                <td colSpan="3">Nenhum aluno encontrado.</td>
              </tr>
            ) : (
              estudantes.map((aluno) => (
                <tr key={aluno.id}>
                  <td>{aluno.id}</td>
                  <td>{aluno.nome}</td>
                  <td>{aluno.email}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminPainel;
