import Todo from './todo.js';
import TodoList from './todo-list.js';
import VirtualDom from './virtual-dom.js';
customElements.define('c-todo', Todo);
customElements.define('c-todo-list', TodoList);

const node = VirtualDom.h('c-todo-list', {
  todos: ['todo1', 'todo2']
});
VirtualDom.updateElement(document.body, node);