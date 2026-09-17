const typeHierarchy = {
  Any: new Set(['Any', 'number', 'string', 'boolean', 'Instance', 'Part', 'Model', 'Player', 'Character', 'Humanoid', 'Vector3', 'CFrame', 'Color3', 'Tool', 'Sound', 'Animation', 'Table']),
  number: new Set(['number']),
  string: new Set(['string']),
  boolean: new Set(['boolean']),
  Instance: new Set(['Instance', 'Part', 'Model', 'Player', 'Character', 'Humanoid', 'Tool', 'Sound', 'Animation']),
  Part: new Set(['Part']),
  Model: new Set(['Model']),
  Player: new Set(['Player']),
  Character: new Set(['Character']),
  Humanoid: new Set(['Humanoid']),
  Vector3: new Set(['Vector3']),
  CFrame: new Set(['CFrame']),
  Color3: new Set(['Color3']),
  Tool: new Set(['Tool']),
  Sound: new Set(['Sound']),
  Animation: new Set(['Animation']),
  Table: new Set(['Table']),
};

const coercions = {
  number: new Set(['number', 'string']),
  string: new Set(['string', 'number', 'boolean']),
  boolean: new Set(['boolean', 'number', 'string']),
  Instance: new Set(['Part', 'Model', 'Character', 'Player']),
  Part: new Set(['Part']),
  Model: new Set(['Model', 'Character']),
  Character: new Set(['Character']),
};

export class TypeSystem {
  static isAssignable(target, source) {
    if (!target || !source) {
      return true;
    }

    if (target === 'Any' || source === 'Any') {
      return true;
    }

    if (target === source) {
      return true;
    }

    return Array.from(typeHierarchy[target] || []).includes(source) || Array.from(typeHierarchy[source] || []).includes(target);
  }

  static coerceIfSafe(target, source) {
    if (this.isAssignable(target, source)) {
      return target;
    }

    if (coercions[target] && coercions[target].has(source)) {
      return target;
    }

    return null;
  }

  static isValid(type) {
    return Boolean(typeHierarchy[type] || type === 'Any');
  }
}

export default TypeSystem;
