export default class Todo extends HTMLElement {
    static get observedAttributes() {
        return ['content'];
    }

    constructor() {
        super();
        this.attachShadow({
            mode: 'open'
        }).innerHTML = `
            <p class="text">todo</p>
            <button>delete</button>
        `;
    }

    connectedCallback() {
        console.log('connectedCallback', this);
        this.shadowRoot.querySelector('button').addEventListener('click', () => {
            this.dispatchEvent(new Event('delete'));
        });
    }
    disconnectedCallback() {
        console.log('disconnectedCallback', this);
	}

	attributeChangedCallback(attributeName, oldValue, newValue, namespace) {
        console.log('attributeChangeedCallback', this, attributeName, oldValue, newValue, namespace);
        if (attributeName === 'content') {
            if (newValue.indexOf('high') > -1) {
                this.shadowRoot.innerHTML += `
                    <style>
                        .text {
                            color: red;
                        }
                    </style>
                `;
            } else if (newValue.indexOf('low') > -1) {
                this.shadowRoot.innerHTML += `
                    <style>
                        .text {
                            color: blue;
                        }
                    </style>
                `;
            }
            this.shadowRoot.querySelector('.text').innerText = newValue;
        }
	}

	adoptedCallback(oldDocument, newDocument) {
		console.log('adoptedCallback', this);
	}
}
