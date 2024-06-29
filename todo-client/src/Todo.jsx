import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const response = await axios.get('/api/todos');
    setTodos(response.data);
  };

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const addTodo = async () => {
    const response = await axios.post('/api/todo', {
      text,
    });
    setTodos([...todos, response.data]);
    setText('');
  };

  const toggleComplete = async (id) => {
    const response = await axios.put(`/api/todo/${id}`);
    setTodos(todos.map(todo =>
      todo._id === id ? { ...todo, complete: response.data.complete } : todo
    ));
  };

  const deleteTodo = async (id) => {
    await axios.delete(`/api/todo/${id}`);
    setTodos(todos.filter(todo => todo._id !== id));
  };

  return (
    <div>
      <h1>To-Do List</h1>
      <input
        type="text"
        value={text}
        onChange={handleChange}
      />
      <button onClick={addTodo}>Add Todo</button>
      <ul>
        {todos.map(todo => (
          <li key={todo._id}>
            <span
              style={{
                textDecoration: todo.complete ? 'line-through' : ''
              }}
              onClick={() => toggleComplete(todo._id)}
            >
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo._id)}>x</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Todo;
