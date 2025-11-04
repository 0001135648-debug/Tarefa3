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
  const [dataAgendada, setDataAgendada] = useState("");
  const [filtroHistorico, setFiltroHistorico] = useState("todas");
  const [isDarkMode, setIsDarkMode] = useState(
    () => JSON.parse(localStorage.getItem("isDarkMode")) || false
  );

  useEffect(() => {
    localStorage.setItem("isDarkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
  }, [tarefas]);

  useEffect(() => {
    localStorage.setItem("historico", JSON.stringify(historico));
  }, [historico]);

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  const adicionarTarefa = () => {
    if (!novaTarefa.trim()) return;

    const nova = {
      id: Date.now(),
      texto: novaTarefa,
      concluida: false,
      scheduledTime: dataAgendada || null,
      notified: false,
      efeitoPendente: false,
    };

    setTarefas((prev) => [...prev, nova]);

    setHistorico((prev) => [
      ...prev,
      {
        acao: "Adicionada",
        texto: novaTarefa,
        data: new Date().toLocaleString(),
      },
    ]);

    setNovaTarefa("");
    setDataAgendada("");
  };

  const alternarConclusao = (id) => {
    setTarefas((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const novaConcluida = !t.concluida;

          setHistorico((prevHist) => [
            ...prevHist,
            {
              acao: novaConcluida ? "Concluída" : "Pendente",
              texto: t.texto,
              data: new Date().toLocaleString(),
            },
          ]);

          if (!novaConcluida) {
            setTimeout(() => {
              setTarefas((prevTarefas) =>
                prevTarefas.map((task) =>
                  task.id === id
                    ? { ...task, efeitoPendente: false }
                    : task
                )
              );
            }, 2000);

            return { ...t, concluida: novaConcluida, efeitoPendente: true };
          }

          return { ...t, concluida: novaConcluida, efeitoPendente: false };
        }
        return t;
      })
    );
  };

  const removerTarefa = (id) => {
    const tarefaRemovida = tarefas.find((t) => t.id === id);
    if (!tarefaRemovida) return;

    setTarefas((prev) => prev.filter((t) => t.id !== id));

    setHistorico((prev) => [
      ...prev,
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

    setTarefas((prev) =>
      prev.map((t) => (t.id === id ? { ...t, texto: novoTexto } : t))
    );

    setHistorico((prev) => [
      ...prev,
      {
        acao: "Editada",
        texto: `${tarefaAntiga.texto} → ${novoTexto}`,
        data: new Date().toLocaleString(),
      },
    ]);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTarefas((prevTarefas) =>
        prevTarefas.map((t) => {
          const agora = new Date();
          if (
            t.scheduledTime &&
            !t.concluida &&
            !t.notified &&
            new Date(t.scheduledTime) <= agora
          ) {
            if (Notification.permission === "granted") {
              new Notification("⏰ Tarefa pendente!", {
                body: `Você ainda não concluiu: ${t.texto}`,
                icon: "/icon.png",
              });
            }
            return { ...t, notified: true };
          }
          return t;
        })
      );
    }, 60000);

    return () => clearInterval(interval);
  }, []);

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

      <div className="input-area">
        <input
          type="text"
          placeholder="Digite uma nova tarefa..."
          value={novaTarefa}
          onChange={(e) => setNovaTarefa(e.target.value)}
        />

        <input
          type="datetime-local"
          value={dataAgendada}
          onChange={(e) => setDataAgendada(e.target.value)}
        />

        <button onClick={adicionarTarefa}>Adicionar</button>
      </div>

      <TodoList
        tarefas={tarefas}
        onToggle={alternarConclusao}
        onRemover={removerTarefa}
        onEditar={editarTarefa}
      />

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

      <div className="theme-toggle">
        <button onClick={() => setIsDarkMode(!isDarkMode)}>
          {isDarkMode ? "☀️ Modo Claro" : "🌙 Modo Escuro"}
        </button>
      </div>
    </div>
  );
}

export default App;
