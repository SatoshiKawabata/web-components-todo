import Todo from './todo.js';
import TodoList from './todo-list.js';
customElements.define('c-todo', Todo);
customElements.define('c-todo-list', TodoList);

const todoList = document.createElement('c-todo-list');
document.body.appendChild(todoList);

todoList.addTodos(['todo1', 'todo2']);