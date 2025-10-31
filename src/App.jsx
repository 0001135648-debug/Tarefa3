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
  const [filtroHistorico, setFiltroHistorico] = useState("todas");

  // 🌗 Controle de tema
  const [isDarkMode, setIsDarkMode] = useState(
    () => JSON.parse(localStorage.getItem("isDarkMode")) || false
  );

  // 🔄 Atualiza localStorage quando o tema muda
  useEffect(() => {
    localStorage.setItem("isDarkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // 💾 Salvar tarefas e histórico no localStorage
  useEffect(
    () => localStorage.setItem("tarefas", JSON.stringify(tarefas)),
    [tarefas]
  );
  useEffect(
    () => localStorage.setItem("historico", JSON.stringify(historico)),
    [historico]
  );

  // ➕ Adicionar tarefa
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

  // ✅ Alternar conclusão
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

  // ❌ Remover tarefa
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

  // ✏️ Editar tarefa
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

  // 📋 Filtrar histórico
  const historicoFiltrado = historico.filter((h) => {
    if (filtroHistorico === "Concluída") return h.acao === "Concluída";
    if (filtroHistorico === "Pendente") return h.acao === "Pendente";
    if (filtroHistorico === "Removida") return h.acao === "Removida";
    if (filtroHistorico === "Adicionada") return h.acao === "Adicionada";
    return true;
  });

  return (
    <div className={`app ${isDarkMode ? "dark-mode" : "light-mode"}`}>
      <h1>📝 Lista de Tarefas</h1>

      {/* Campo de entrada */}
      <div className="input-area">
        <input
          type="text"
          placeholder="Digite uma nova tarefa..."
          value={novaTarefa}
          onChange={(e) => setNovaTarefa(e.target.value)}
        />
        <button onClick={adicionarTarefa}>Adicionar</button>
      </div>

      {/* Lista de tarefas */}
      <TodoList
        tarefas={tarefas}
        onToggle={alternarConclusao}
        onRemover={removerTarefa}
        onEditar={editarTarefa}
      />

      {/* Histórico filtrável */}
      <div className="historico">
        <h2>📜 Histórico de Ações</h2>
        <div className="filtros">
          {["todas", "Concluída", "Pendente", "Removida", "Adicionada"].map(
            (filtro) => (
              <button
                key={filtro}
                onClick={() => setFiltroHistorico(filtro)}
                className={filtroHistorico === filtro ? "ativo" : ""}
              >
                {filtro === "todas" ? "Todas" : filtro + "s"}
              </button>
            )
          )}
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

      {/* 🌗 Alternar tema */}
      <div className="theme-toggle">
        <button onClick={() => setIsDarkMode(!isDarkMode)}>
          {isDarkMode ? "☀️ Modo Claro" : "🌙 Modo Escuro"}
        </button>
      </div>
    </div>
  );
}

export default App;
