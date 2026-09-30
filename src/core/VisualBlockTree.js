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

  static find(nodes, id) {
    for (const node of nodes || []) {
      if (node.id === id) return { node, list: nodes, parent: null };
      const nested = this.find(node.children, id);
      if (nested) return { ...nested, parent: node };
      const next = node.next ? this.find([node.next], id) : null;
      if (next) return { ...next, parent: node };
      for (const [propertyId, value] of Object.entries(node.properties || {})) {
        if (value && typeof value === 'object' && value.id) {
          const found = this.find([value], id);
          if (found) return { ...found, parent: node, propertyId };
        }
      }
      for (const body of Object.values(node.bodies || {})) {
        const found = this.find(body, id);
        if (found) return { ...found, parent: node };
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
        if (node.next) list.splice(index, 1, node.next);
        else list.splice(index, 1);
        node.next = null;
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