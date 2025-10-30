import React, { useState, useEffect } from "react";
import TodoList from "./TodoList";
import "./App.css";

function App() {
  const [tarefas, setTarefas] = useState(
    () => JSON.parse(localStorage.getItem("tarefas")) || []
  );
  const [historico, setHistorico] = useState(
    () => JSON.parse(localStorage.getItem("historico")) || []
  );
  const [novaTarefa, setNovaTarefa] = useState("");
  const [filtroHistorico, setFiltroHistorico] = useState("todas"); // filtro do histórico

  // Salvar no localStorage
  useEffect(
    () => localStorage.setItem("tarefas", JSON.stringify(tarefas)),
    [tarefas]
  );
  useEffect(
    () => localStorage.setItem("historico", JSON.stringify(historico)),
    [historico]
  );

  // Funções de tarefas
  const adicionarTarefa = () => {
    if (!novaTarefa.trim()) return;
    const nova = { id: Date.now(), texto: novaTarefa, concluida: false };
    setTarefas([...tarefas, nova]);
    setHistorico([
      ...historico,
      {
        acao: "Adicionada",
        texto: novaTarefa,
        data: new Date().toLocaleString(),
      },
    ]);
    setNovaTarefa("");
  };

  const alternarConclusao = (id) => {
    setTarefas((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const novaConcluida = !t.concluida;
          setHistorico([
            ...historico,
            {
              acao: novaConcluida ? "Concluída" : "Pendente",
              texto: t.texto,
              data: new Date().toLocaleString(),
            },
          ]);
          return { ...t, concluida: novaConcluida };
        }
        return t;
      })
    );
  };

  const removerTarefa = (id) => {
    const tarefaRemovida = tarefas.find((t) => t.id === id);
    if (!tarefaRemovida) return;
    setTarefas(tarefas.filter((t) => t.id !== id));
    setHistorico([
      ...historico,
      {
        acao: "Removida",
        texto: tarefaRemovida.texto,
        data: new Date().toLocaleString(),
      },
    ]);
  };

  const editarTarefa = (id, novoTexto) => {
    const tarefaAntiga = tarefas.find((t) => t.id === id);
    if (!tarefaAntiga) return;
    setTarefas(
      tarefas.map((t) => (t.id === id ? { ...t, texto: novoTexto } : t))
    );
    setHistorico([
      ...historico,
      {
        acao: "Editada",
        texto: `${tarefaAntiga.texto} → ${novoTexto}`,
        data: new Date().toLocaleString(),
      },
    ]);
  };

  // Lista principal mostra todas as tarefas sem filtro
  const tarefasFiltradas = tarefas;

  // Filtragem do histórico
  const historicoFiltrado = historico.filter((h) => {
    if (filtroHistorico === "Concluída") return h.acao === "Concluída";
    if (filtroHistorico === "Pendente") return h.acao === "Pendente";
    if (filtroHistorico === "Removida") return h.acao === "Removida";
    if (filtroHistorico === "Adicionada") return h.acao === "Adicionada";
    return true; // todas
  });

  return (
    <div className="app">
      <h1>📝 Lista de Tarefas</h1>

      <div className="input-area">
        <input
          type="text"
          placeholder="Digite uma nova tarefa..."
          value={novaTarefa}
          onChange={(e) => setNovaTarefa(e.target.value)}
        />
        <button onClick={adicionarTarefa}>Adicionar</button>
      </div>

      {/* Lista principal */}
      <TodoList
        tarefas={tarefasFiltradas}
        onToggle={alternarConclusao}
        onRemover={removerTarefa}
        onEditar={editarTarefa}
      />

      {/* Histórico filtrável */}
      <div className="historico">
        <h2>📜 Histórico de Ações</h2>
        <div className="filtros">
          <button
            onClick={() => setFiltroHistorico("todas")}
            className={filtroHistorico === "todas" ? "ativo" : ""}
          >
            Todas
          </button>
          <button
            onClick={() => setFiltroHistorico("Concluída")}
            className={filtroHistorico === "Concluída" ? "ativo" : ""}
          >
            Concluídos
          </button>
          <button
            onClick={() => setFiltroHistorico("Pendente")}
            className={filtroHistorico === "Pendente" ? "ativo" : ""}
          >
            Pendentes
          </button>
          <button
            onClick={() => setFiltroHistorico("Removida")}
            className={filtroHistorico === "Removida" ? "ativo" : ""}
          >
            Removidos
          </button>
          <button
            onClick={() => setFiltroHistorico("Adicionada")}
            className={filtroHistorico === "Adicionada" ? "ativo" : ""}
          >
            Adicionados
          </button>
        </div>

        {historicoFiltrado.length === 0 ? (
          <p>Nenhuma ação registrada para este filtro.</p>
        ) : (
          <ul>
            {historicoFiltrado.map((item, index) => (
              <li key={index}>
                <strong>{item.acao}:</strong> {item.texto} <br />
                <small>{item.data}</small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
