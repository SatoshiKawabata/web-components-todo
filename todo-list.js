import VirtualDom from './virtual-dom.js';

export default class TodoList extends HTMLElement {
  static get observedAttributes() {
    return ['todo'];
  }

  constructor() {
    super();
    this.attachShadow({
      mode: 'open'
    });

    this.onClickAdd = this.onClickAdd.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.updateState({ todos: [] });
  }

  updateState(state) {
    const { todos } = state;
    this.state = state;
    const node = VirtualDom.h('div', {},
      VirtualDom.h('style', {}, `
        .todo {
          color: red;
        }
      `),
      VirtualDom.h('input', { type: 'text'}),
      VirtualDom.h('button', {
        onclick: this.onClickAdd
      }, 'add'),
      ...todos.map((todo, i) => {
        return VirtualDom.h('c-todo', {
          content: todo,
          ondelete: this.onDelete.bind(this, i),
          class: 'todo'
        });
      })
    );
    VirtualDom.updateElement(this.shadowRoot, node, this.currentNode);
    this.currentNode = node;
  }

  onDelete(i, e) {
    this.state.todos.splice(i, 1);
    this.updateState(this.state);
  }

  onClickAdd() {
    const input = this.shadowRoot.querySelector('input');
    const { value } = input;
    this.state.todos.push(value);
    this.updateState(this.state);
  }

  connectedCallback() {
    console.log('connectedCallback', this);
    this.updateState({ todos: this.props.todos });
  }

  disconnectedCallback() {
    console.log('disconnectedCallback', this);
  }

  attributeChangedCallback(attributeName, oldValue, newValue, namespace) {
    console.log('attributeChangeedCallback', this, attributeName, oldValue, newValue, namespace);
  }

  adoptedCallback(oldDocument, newDocument) {
    console.log('adoptedCallback', this);
  }
}
