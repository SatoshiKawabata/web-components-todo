export default class VirtualDom {
  static h(type, props, ...children) {
    return { type, props: props || {}, children };
  }

  static setBooleanProp($target, name, value) {
    if (value) {
      $target.setAttribute(name, value);
      $target[name] = true;
    } else {
      $target[name] = false;
    }
  }

  static removeBooleanProp($target, name) {
    $target.removeAttribute(name);
    $target[name] = false;
  }

  static isEventProp(name) {
    return /^on/.test(name);
  }

  static extractEventName(name) {
    return name.slice(2).toLowerCase();
  }

  static isCustomProp(name) {
    return this.isEventProp(name) || name === 'forceUpdate';
  }

  static setProp($target, name, value) {
    if (this.isCustomProp(name)) {
      return;
    } else if (name === 'className') {
      $target.setAttribute('class', value);
    } else if (typeof value === 'boolean') {
      this.setBooleanProp($target, name, value);
    } else {
      $target.setAttribute(name, value);
    }
  }

  static removeProp($target, name, value) {
    if (this.isCustomProp(name)) {
      return;
    } else if (name === 'className') {
      $target.removeAttribute('class');
    } else if (typeof value === 'boolean') {
      this.removeBooleanProp($target, name);
    } else {
      $target.removeAttribute(name);
    }
  }

  static setProps($target, props) {
    Object.keys(props).forEach(name => {
      this.setProp($target, name, props[name]);
    });
  }

  static updateProp($target, name, newVal, oldVal) {
    if (!newVal) {
      this.removeProp($target, name, oldVal);
    } else if (!oldVal || newVal !== oldVal) {
      this.setProp($target, name, newVal);
    }
  }

  static updateProps($target, newProps, oldProps = {}) {
    const props = Object.assign({}, newProps, oldProps);
    Object.keys(props).forEach(name => {
      this.updateProp($target, name, newProps[name], oldProps[name]);
    });
  }

  static addEventListeners($target, props) {
    Object.keys(props).forEach(name => {
      if (this.isEventProp(name)) {
        $target.addEventListener(
        this.extractEventName(name),
          props[name]
        );
      }
    });
  }

  static createElement(node) {
    if (typeof node === 'string') {
      return document.createTextNode(node);
    }
    const $el = document.createElement(node.type);
    this.setProps($el, node.props);
    this.addEventListeners($el, node.props);
    node.children
      .map(this.createElement.bind(this))
      .forEach($el.appendChild.bind($el));
    return $el;
  }

  static changed(node1, node2) {
    return typeof node1 !== typeof node2 ||
        typeof node1 === 'string' && node1 !== node2 ||
        node1.type !== node2.type ||
        node1.props && node1.props.forceUpdate;
  }

  static updateElement($parent, newNode, oldNode, index = 0) {
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
      this.updateProps(
        $parent.childNodes[index],
        newNode.props,
        oldNode.props
      );
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