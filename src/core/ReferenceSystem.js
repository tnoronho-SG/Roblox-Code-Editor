const registry = new Map();

const defaultReferences = [
  {
    id: 'player',
    label: 'Player',
    kind: 'Player',
    expression: 'game.Players.LocalPlayer',
    contexts: ['client', 'server'],
  },
  {
    id: 'workspace',
    label: 'Workspace',
    kind: 'Instance',
    expression: 'workspace',
    contexts: ['both'],
  },
  {
    id: 'character',
    label: 'Character',
    kind: 'Character',
    expression: 'player.Character',
    contexts: ['client', 'server'],
  },
  {
    id: 'humanoid',
    label: 'Humanoid',
    kind: 'Humanoid',
    expression: 'character:FindFirstChildOfClass("Humanoid")',
    contexts: ['client', 'server'],
  },
  {
    id: 'touchedObject',
    label: 'Touched object',
    kind: 'Instance',
    expression: 'hit',
    contexts: ['server', 'client'],
  },
  {
    id: 'clickedObject',
    label: 'Clicked object',
    kind: 'Instance',
    expression: 'hit',
    contexts: ['client'],
  },
];

export class ReferenceSystem {
  static register(reference = {}) {
    const normalized = {
      id: reference.id,
      label: reference.label || reference.id,
      kind: reference.kind || 'Any',
      expression: reference.expression || reference.id,
      contexts: reference.contexts || ['both'],
      ...reference,
    };

    if (!normalized.id) {
      throw new Error('ReferenceSystem.register requires an id.');
    }

    registry.set(normalized.id, normalized);
    return normalized;
  }

  static get(id) {
    return registry.get(id) || null;
  }

  static resolve(id) {
    const reference = this.get(id);
    if (!reference) {
      throw new Error(`Reference "${id}" was not found.`);
    }

    return reference;
  }

  static listAll() {
    return [...registry.values()];
  }

  static reset() {
    registry.clear();
    defaultReferences.forEach(item => this.register(item));
  }
}

ReferenceSystem.reset();

export default ReferenceSystem;
