import React, { useState } from "react";
import TodoList from "./TodoList";
import "./App.css";

function App() {
  const [tarefas, setTarefas] = useState([]);
  const [novaTarefa, setNovaTarefa] = useState("");

  const adicionarTarefa = () => {
    if (novaTarefa.trim() === "") return;
    const nova = {
      id: Date.now(),
      texto: novaTarefa,
      concluida: false,
    };
    setTarefas([...tarefas, nova]);
    setNovaTarefa("");
  };

  const alternarConclusao = (id) => {
    setTarefas(
      tarefas.map((tarefa) =>
        tarefa.id === id ? { ...tarefa, concluida: !tarefa.concluida } : tarefa
      )
    );
  };

  const removerTarefa = (id) => {
    setTarefas(tarefas.filter((tarefa) => tarefa.id !== id));
  };

  // Função para editar o texto da tarefa
  const editarTarefa = (id, novoTexto) => {
    setTarefas(
      tarefas.map((tarefa) =>
        tarefa.id === id ? { ...tarefa, texto: novoTexto } : tarefa
      )
    );
  };

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

      <TodoList
        tarefas={tarefas}
        onToggle={alternarConclusao}
        onRemover={removerTarefa}
        onEditar={editarTarefa} // Passamos a função de edição
      />
    </div>
  );
}

export default App;
