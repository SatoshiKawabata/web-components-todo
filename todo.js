import VirtualDom from './virtual-dom.js';

export default class Todo extends HTMLElement {
  static get observedAttributes() {
    return ['content'];
  }

  constructor() {
    super();
    this.attachShadow({
      mode: 'open'
    });
    this.updateState({ text: '' });
  }

  updateState(state) {
    const { text } = state;
    this.state = state;
    const node = VirtualDom.h('div', {},
      VirtualDom.h('p', {
        class: 'text'
      }, text),
      VirtualDom.h('button', {
        onclick: () => {
          this.dispatchEvent(new Event('delete'));
        }
      }, 'delete')
    );
    VirtualDom.updateElement(this.shadowRoot, node, this.currentNode);
    this.currentNode = node;
  }

  connectedCallback() {
    console.log('connectedCallback', this);
  }
  disconnectedCallback() {
    console.log('disconnectedCallback', this);
  }

  attributeChangedCallback(attributeName, oldValue, newValue, namespace) {
    console.log('attributeChangeedCallback', this, attributeName, oldValue, newValue, namespace);
    if (attributeName === 'content') {
      this.updateState({ text: newValue });
    }
  }

  adoptedCallback(oldDocument, newDocument) {
    console.log('adoptedCallback', this);
  }
}
