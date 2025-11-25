document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "http://localhost:3000/estudantes";

  const idInput = document.getElementById("idEstudante");
  const nomeInput = document.getElementById("nomeEstudante");
  const emailInput = document.getElementById("emailEstudante");
  const corpoTabela = document.getElementById("corpoTabela");
  const mensagem = document.getElementById("mensagem");

  const btnInserir = document.getElementById("btnInserir");
  const btnBuscar = document.getElementById("btnBuscar");
  const btnAtualizar = document.getElementById("btnAtualizar");
  const btnDeletar = document.getElementById("btnDeletar");
  const btnListarTodos = document.getElementById("btnListarTodos");

  // --- Funções de API ---
  async function listarTodos() {
    const res = await fetch(API_URL);
    const alunos = await res.json();
    renderTabela(alunos);
  }

  async function buscarPorId(id) {
    const res = await fetch(`${API_URL}/${id}`);
    if (res.status === 404) return null;
    return res.json();
  }

  async function inserirAluno() {
    const dados = { nome: nomeInput.value, email: emailInput.value };
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });
    if (res.ok) {
      mostrarMensagem("Aluno inserido com sucesso!");
      listarTodos();
    } else {
      mostrarMensagem("Erro ao inserir aluno", "red");
    }
  }

  async function atualizarAluno() {
    const id = idInput.value;
    if (!id) return alert("Informe o ID do aluno para atualizar.");

    const dados = { nome: nomeInput.value, email: emailInput.value };
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });

    if (res.ok) {
      mostrarMensagem("Aluno atualizado com sucesso!");
      listarTodos();
    } else {
      mostrarMensagem("Erro ao atualizar aluno", "red");
    }
  }

  async function deletarAluno() {
    const id = idInput.value;
    if (!id) return alert("Informe o ID do aluno para deletar.");

    if (!confirm("Tem certeza que deseja excluir este aluno?")) return;

    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });

    if (res.ok) {
      mostrarMensagem("Aluno deletado com sucesso!");
      listarTodos();
    } else {
      mostrarMensagem("Erro ao deletar aluno", "red");
    }
  }

  // --- Funções de interface ---
  function renderTabela(alunos) {
    corpoTabela.innerHTML = "";
    if (!alunos || alunos.length === 0) {
      corpoTabela.innerHTML = `<tr><td colspan="3">Nenhum aluno encontrado.</td></tr>`;
      return;
    }
    alunos.forEach((aluno) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${aluno.id}</td>
        <td>${aluno.nome}</td>
        <td>${aluno.email}</td>
      `;
      corpoTabela.appendChild(tr);
    });
  }

  function mostrarMensagem(texto, cor = "green") {
    mensagem.textContent = texto;
    mensagem.style.color = cor;
    setTimeout(() => (mensagem.textContent = ""), 3000);
  }

  // --- Eventos ---
  btnListarTodos.addEventListener("click", listarTodos);
  btnInserir.addEventListener("click", inserirAluno);
  btnBuscar.addEventListener("click", async () => {
    const id = idInput.value;
    if (!id) return alert("Informe o ID para buscar.");
    const aluno = await buscarPorId(id);
    if (aluno) {
      nomeInput.value = aluno.nome;
      emailInput.value = aluno.email;
    } else {
      alert("Aluno não encontrado.");
    }
  });
  btnAtualizar.addEventListener("click", atualizarAluno);
  btnDeletar.addEventListener("click", deletarAluno);

  // Lista todos ao carregar a página
  listarTodos();
});
