import React from "react";
import TodoItem from "./TodoItem";

function TodoList({ tarefas, onToggle, onRemover, onEditar }) {
  return (
    <div>
      {tarefas.length === 0 ? (
        <p>Nenhuma tarefa adicionada ainda.</p>
      ) : (
        tarefas.map((tarefa) => (
          <TodoItem
            key={tarefa.id}
            tarefa={tarefa}
            onToggle={onToggle}
            onRemover={onRemover}
            onEditar={onEditar} // Passamos a função de edição
          />
        ))
      )}
    </div>
  );
}

export default TodoList;
