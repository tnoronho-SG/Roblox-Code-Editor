const registry = new Map();

export class BlockRegistry {
  static register(config = {}) {
    const normalized = {
      id: config.id,
      category: config.category || 'general',
      name: config.name || config.id,
      type: config.type || 'statement',
      contexts: config.contexts || ['both'],
      definition: config.definition || {},
      generator: config.generator || null,
      color: config.color || '#5B8DEF',
      description: config.description || '',
      tooltip: config.tooltip || '',
      documentation: config.documentation || {},
      validation: config.validation || (() => ({ valid: true, errors: [] })),
      ...config,
    };

    if (!normalized.id) {
      throw new Error('BlockRegistry.register requires an id.');
    }

    registry.set(normalized.id, normalized);
    return normalized;
  }

  static get(id) {
    return registry.get(id) || null;
  }

  static listAll() {
    return [...registry.values()];
  }

  static listByCategory(category) {
    return this.listAll().filter(block => block.category === category);
  }

  static resolveGenerator(id) {
    const block = this.get(id);
    if (!block) {
      throw new Error(`Block "${id}" is not registered.`);
    }
    return block.generator;
  }

  static reset() {
    registry.clear();
  }
}

export default BlockRegistry;
