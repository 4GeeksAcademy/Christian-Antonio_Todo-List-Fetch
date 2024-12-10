import React from 'react';
import { useState, useEffect } from 'react';
import './styles/index.css';

function App() {
  const [task, setTask] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [count, setCount] = useState(0);
  const [editingTask, setEditingTask] = useState(null); // Track task being edited
  const [editedTaskLabel, setEditedTaskLabel] = useState(''); // Track new label for the task

  const loadTasks = async () => {
    try {
      const response = await fetch('https://playground.4geeks.com/todo/users/khris', {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error('Something went wrong :c');
      }
      const result = await response.json();
      setTask(result.todos);
      setCount(result.todos.length);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const saveToDo = async () => {
    if (newTask.trim() === '') {
      alert('Task empty!!!');
      return;
    }

    try {
      const body = {
        label: newTask,
        is_done: false,
      };

      const response = await fetch('https://playground.4geeks.com/todo/todos/khris', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error('Failed to add task');
      }

      const result = await response.json();
      setTask((prevState) => [...prevState, result]);
      setCount((prevCount) => prevCount + 1);
      setNewTask('');
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      const response = await fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const result = await response.json();
        console.error('Something went wrong!!!', result.description);
        return;
      }

      setTask((prevState) => prevState.filter((task) => task.id !== id));
      setCount((prevCount) => prevCount - 1);
    } catch (error) {
      console.error('Something went wrong!!!', error);
    }
  };

  const editTask = async (id) => {
    try {
      const body = { label: editedTaskLabel, is_done: false };

      const response = await fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error('Something went wrong!!!');
      }

      const updatedTask = await response.json();
      setTask((prevState) =>
        prevState.map((task) => (task.id === id ? updatedTask : task))
      );

      setEditingTask(null);
      setEditedTaskLabel('');
    } catch (error) {
      console.error('Something went wrong!!!', error);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <div className="container">
      <h1>To Do List:</h1>
      <input
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        type="text"
        placeholder="Type your next task:"
      />
      <button id="save" type="submit" onClick={saveToDo}>
        Add
      </button>
      <ul>
        {task.map((item) => (
          <li key={item.id}>
            {editingTask === item.id ? (
              <div>
                <input
                  value={editedTaskLabel}
                  onChange={(e) => setEditedTaskLabel(e.target.value)}
                  placeholder="Edit task label"
                />
                <button onClick={() => editTask(item.id)}>Save</button>
                <button onClick={() => setEditingTask(null)}>Cancel</button>
              </div>
            ) : (
              <div>
                {item.label}
                <button onClick={() => {
                  setEditingTask(item.id);
                  setEditedTaskLabel(item.label);
                }}>
                  Edit
                </button>
                <button onClick={() => deleteTask(item.id)}>
                  <i className="delete-btn"></i> Delete
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
      <span id='counter'>You have {count} tasks left</span>
    </div>
  );
}

export default App;
