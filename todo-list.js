export default class TodoList extends HTMLElement {
    static get observedAttributes() {
        return [];
    }

    constructor() {
        super();
        this.attachShadow({
            mode: 'open'
        }).innerHTML = `
            <input type="text">
            <button>add</button>
        `;
    }

    connectedCallback() {
        this.shadowRoot.querySelector('button').addEventListener('click', () => {
            const input = this.shadowRoot.querySelector('input');
            const { value } = input;
            const todo = document.createElement('c-todo');
            todo.setAttribute('content', value);
            this.shadowRoot.appendChild(todo);

            todo.addEventListener('delete', () => {
                const todoElms = this.shadowRoot.querySelectorAll('c-todo');
                for (let i = 0; i < todoElms.length; i++) {
                    if (todoElms[i] === todo) {
                        this.shadowRoot.removeChild(todoElms[i]);
                    }
                }
            });
        });
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

    addTodos(todos) {
        const self = this;
        todos.forEach(value => {
            const todo = document.createElement('c-todo');
            todo.setAttribute('content', value);
            this.shadowRoot.appendChild(todo);
            todo.addEventListener('delete', () => {
                const todoElms = this.shadowRoot.querySelectorAll('c-todo');
                for (let i = 0; i < todoElms.length; i++) {
                    if (todoElms[i] === todo) {
                        this.shadowRoot.removeChild(todoElms[i]);
                    }
                }
            });
        });
    }
}
