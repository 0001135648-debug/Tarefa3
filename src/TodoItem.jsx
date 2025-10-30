import React, { useState } from "react";

function TodoItem({ tarefa, onToggle, onRemover, onEditar }) {
  const [editando, setEditando] = useState(false);
  const [novoTexto, setNovoTexto] = useState(tarefa.texto);

  const salvarEdicao = () => {
    if (novoTexto.trim() === "") return;
    onEditar(tarefa.id, novoTexto);
    setEditando(false);
  };

  const cancelarEdicao = () => {
    setNovoTexto(tarefa.texto);
    setEditando(false);
  };

  return (
    <div className="todo-item">
      <input
        type="checkbox"
        checked={tarefa.concluida}
        onChange={() => onToggle(tarefa.id)}
      />

      {editando ? (
        <>
          <input
            type="text"
            value={novoTexto}
            onChange={(e) => setNovoTexto(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && salvarEdicao()}
          />
          <button onClick={salvarEdicao}>Salvar</button>
          <button onClick={cancelarEdicao}>Cancelar</button>
        </>
      ) : (
        <>
          <span className={tarefa.concluida ? "concluida" : ""}>
            {tarefa.texto}
          </span>
          <button onClick={() => setEditando(true)}>Editar</button>
        </>
      )}

      <button onClick={() => onRemover(tarefa.id)}>Remover</button>
    </div>
  );
}

export default TodoItem;
