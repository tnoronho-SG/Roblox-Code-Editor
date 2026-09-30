import { VISUAL_BLOCK_KINDS } from './VisualBlockDefinition.js';

function makeId() {
  return globalThis.crypto?.randomUUID?.() || `block-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export class VisualBlockTree {
  static createNode(definition, properties = {}) {
    const bodies = Object.fromEntries((definition.bodies || []).map(body => [body.id, []]));
    return {
      id: makeId(),
      type: definition.id,
      definitionId: definition.id,
      properties: { ...properties },
      inputs: { ...properties },
      next: null,
      bodies,
      children: bodies.body,
    };
  }

  static find(nodes, id, parent = null) {
    for (const node of nodes || []) {
      if (node.id === id) return { node, list: nodes, parent };
      const nested = this.find(node.children, id, node);
      if (nested) return nested;
      if (node.next) {
        const next = this.find([node.next], id, node);
        if (next) return next;
      }
      for (const [propertyId, value] of Object.entries(node.properties || {})) {
        if (value && typeof value === 'object' && value.id) {
          if (value.id === id) return { node: value, list: [value], parent: node, propertyId };
          const found = this.find([value], id, node);
          if (found) return found;
        }
      }
      for (const body of Object.values(node.bodies || {})) {
        const found = this.find(body, id, node);
        if (found) return found;
      }
    }
    return null;
  }

  static appendToBody(parent, node, bodyId = 'body') {
    if (!parent.bodies) parent.bodies = { body: parent.children || [] };
    if (!parent.bodies[bodyId]) parent.bodies[bodyId] = [];
    parent.bodies[bodyId].push(node);
    if (bodyId === 'body') parent.children = parent.bodies[bodyId];
    return node;
  }

  static connectSequence(source, target) {
    source.next = target;
    return target;
  }

  static insertBefore(nodes, targetId, insertedNode) {
    const target = this.find(nodes, targetId);
    if (!target || target.node === insertedNode) return false;

    if (target.parent?.next === target.node) {
      let tail = insertedNode;
      while (tail.next) tail = tail.next;
      tail.next = target.node;
      target.parent.next = insertedNode;
      return true;
    }

    const index = target.list?.indexOf(target.node) ?? -1;
    if (index < 0) return false;
    target.list.splice(index, 0, insertedNode);
    return true;
  }

  static insertAfter(nodes, targetId, insertedNode) {
    const target = this.find(nodes, targetId);
    if (!target || target.node === insertedNode) return false;

    if (target.parent?.next === target.node) {
      let tail = insertedNode;
      while (tail.next) tail = tail.next;
      tail.next = target.node.next;
      target.node.next = insertedNode;
      return true;
    }

    const index = target.list?.indexOf(target.node) ?? -1;
    if (index < 0) return false;
    target.list.splice(index + 1, 0, insertedNode);
    return true;
  }

  static connectValue(node, inputId, valueNode) {
    node.properties[inputId] = valueNode;
    node.inputs[inputId] = valueNode;
    return valueNode;
  }

  static detach(nodes, id) {
    const found = this.find(nodes, id);
    if (!found) return null;

    const { node, list, parent, propertyId } = found;
    if (propertyId) {
      delete parent.properties[propertyId];
      delete parent.inputs[propertyId];
    } else if (parent?.next === node) {
      parent.next = node.next;
      node.next = null;
    } else if (list) {
      const index = list.indexOf(node);
      if (index !== -1) {
        list.splice(index, 1);
      }
    }

    return node;
  }

  static count(nodes) {
    return (nodes || []).reduce((count, node) => {
      const values = Object.values(node.properties || {}).filter(value => value && typeof value === 'object' && value.id);
      return count + 1 + this.count(node.children) + this.count(node.next ? [node.next] : []) + this.count(values);
    }, 0);
  }

  static kindOf(definition) {
    return definition?.kind || VISUAL_BLOCK_KINDS.COMMAND;
  }
}

export default VisualBlockTree;