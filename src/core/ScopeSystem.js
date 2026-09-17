const scopes = new Map();

export class ScopeSystem {
  static declare(name, scope = 'local', metadata = {}) {
    scopes.set(name, {
      name,
      scope,
      ...metadata,
    });
    return scopes.get(name);
  }

  static resolve(name) {
    return scopes.get(name) || null;
  }

  static isVisible(name, currentScope) {
    const variable = this.resolve(name);
    if (!variable) return false;
    if (variable.scope === 'global') return true;
    if (variable.scope === 'local') return true;
    return variable.scope === currentScope;
  }

  static listAll() {
    return [...scopes.values()];
  }

  static reset() {
    scopes.clear();
  }
}

export default ScopeSystem;
