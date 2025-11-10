document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "http://localhost:3000/usuarios";

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


  // Funções de API
  async function listarTodos() {
    const res = await fetch(API_URL);
    const alunos = await res.json();
    renderTabela(alunos);
  }

  async function buscarPorId(id) {
    const res = await fetch(`${API_URL}/${id}`);
    return res.json();
  }

  async function inserirAluno() {
    const dados = {
      nome: nomeInput.value,
      email: emailInput.value,
    };

    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });

    mostrarMensagem("Aluno inserido com sucesso!");
    listarTodos();
  }

  async function atualizarAluno() {
    const id = idInput.value;
    if (!id) return alert("Informe o ID do aluno para atualizar.");

    const dados = {
      nome: nomeInput.value,
      email: emailInput.value,
    };

    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });

    mostrarMensagem("Aluno atualizado com sucesso!");
    listarTodos();
  }

  async function deletarAluno() {
    const id = idInput.value;
    if (!id) return alert("Informe o ID do aluno para deletar.");

    if (!confirm("Tem certeza que deseja excluir este aluno?")) return;

    await fetch(`${API_URL}/${id}`, { method: "DELETE" });

    mostrarMensagem("Aluno deletado com sucesso!");
    listarTodos();
  }


  // Interface
  function renderTabela(alunos) {
    corpoTabela.innerHTML = "";
    if (alunos.length === 0) {
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

  function mostrarMensagem(texto) {
    mensagem.textContent = texto;
    mensagem.style.color = "green";
    setTimeout(() => (mensagem.textContent = ""), 3000);
  }


  // Eventos
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
});
