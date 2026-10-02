import { VISUAL_TYPES } from './VisualBlockDefinition.js';

const parents = Object.freeze({
  [VISUAL_TYPES.NUMBER]: [],
  [VISUAL_TYPES.TEXT]: [],
  [VISUAL_TYPES.BOOLEAN]: [],
  [VISUAL_TYPES.PLAYER]: [VISUAL_TYPES.OBJECT],
  [VISUAL_TYPES.OBJECT]: [],
  [VISUAL_TYPES.POSITION]: [],
  [VISUAL_TYPES.COLOR]: [],
  [VISUAL_TYPES.SOUND]: [VISUAL_TYPES.OBJECT],
  [VISUAL_TYPES.FUNCTION]: [VISUAL_TYPES.OBJECT],
  [VISUAL_TYPES.ENUM]: [],
  [VISUAL_TYPES.ANY]: [],
});

export class VisualTypeSystem {
  static isValid(type) {
    return Object.prototype.hasOwnProperty.call(parents, type);
  }

  static isAssignable(target, source) {
    if (!target || !source || target === VISUAL_TYPES.ANY || source === VISUAL_TYPES.ANY) return true;
    if (target === source) return true;
    return (parents[source] || []).some(parent => this.isAssignable(target, parent));
  }

  static outputType(definition) {
    return definition?.output || VISUAL_TYPES.ANY;
  }
}

export default VisualTypeSystem;