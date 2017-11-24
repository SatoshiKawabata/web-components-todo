export default class Todo extends HTMLElement {
    static get observedAttributes() {
        return ['content'];
    }

    constructor() {
        super();
        this.attachShadow({
            mode: 'open'
        });
        let node = this.h('p', {
            class: 'text'
        }, 'text');
        this.currentNode = [node];
        let elm = this.createElement(node);
        console.log(this.shadowRoot, elm);
        this.shadowRoot.appendChild(elm);
        node = this.h('button', null, 'delete');
        this.currentNode.push(node);
        this.shadowRoot.appendChild(this.createElement(node));
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
            // this.shadowRoot.querySelector('p').innerText = newValue;
            const nodes = [
                this.h('p', {
                        class: 'text'
                    }, newValue),
                this.h('button', null, 'delete')
            ];
            this.currentNode.forEach((n, i) => {
                this.updateElement(this.shadowRoot, nodes[i], n);
            });
        }
	}

	adoptedCallback(oldDocument, newDocument) {
		console.log('adoptedCallback', this);
    }

    h(type, props, ...children) {
        return { type, props: props || {}, children }
    }

    createElement(node) {
        if (typeof node === 'string') {
            return document.createTextNode(node);
          }
          const $el = document.createElement(node.type);
          node.children
            .map(this.createElement)
            .forEach($el.appendChild.bind($el));
          return $el;
    }

    changed(node1, node2) {
        return typeof node1 !== typeof node2 ||
               typeof node1 === 'string' && node1 !== node2 ||
               node1.type !== node2.type
    }


    updateElement($parent, newNode, oldNode, index = 0) {
        if (!oldNode) {
            $parent.appendChild(
            this.createElement(newNode)
            );
        } else if (!newNode) {
            $parent.removeChild(
            $parent.childNodes[index]
            );
        } else if (this.changed(newNode, oldNode)) {
            $parent.replaceChild(
            this.createElement(newNode),
            $parent.childNodes[index]
            );
        } else if (newNode.type) {
            const newLength = newNode.children.length;
            const oldLength = oldNode.children.length;
            for (let i = 0; i < newLength || i < oldLength; i++) {
                this.updateElement(
                    $parent.childNodes[index],
                    newNode.children[i],
                    oldNode.children[i],
                    i
                );
            }
        }
    }
}
