import { VISUAL_BLOCK_KINDS } from './VisualBlockDefinition.js';
import { VisualTypeSystem } from './VisualTypeSystem.js';

export class VisualConnectionSystem {
  static canConnectSequence(sourceDefinition, targetDefinition) {
    const sourceKind = sourceDefinition?.kind;
    const targetKind = targetDefinition?.kind;
    return (sourceKind === VISUAL_BLOCK_KINDS.COMMAND || sourceKind === VISUAL_BLOCK_KINDS.STRUCTURE)
      && (targetKind === VISUAL_BLOCK_KINDS.COMMAND || targetKind === VISUAL_BLOCK_KINDS.STRUCTURE);
  }

  static canConnectValue(sourceDefinition, inputDefinition) {
    if (!sourceDefinition || !inputDefinition) return false;
    const sourceKind = sourceDefinition.kind;
    if (sourceKind !== VISUAL_BLOCK_KINDS.VALUE && sourceKind !== VISUAL_BLOCK_KINDS.EXPRESSION) return false;
    if (inputDefinition.accepts && !inputDefinition.accepts.includes(sourceKind)) return false;
    return VisualTypeSystem.isAssignable(inputDefinition.type, VisualTypeSystem.outputType(sourceDefinition));
  }

  static canConnectBody(sourceDefinition, bodyDefinition) {
    return sourceDefinition?.kind === VISUAL_BLOCK_KINDS.COMMAND
      || sourceDefinition?.kind === VISUAL_BLOCK_KINDS.STRUCTURE
      ? bodyDefinition?.accepts === VISUAL_BLOCK_KINDS.COMMAND
      : false;
  }

  static validate(kind, sourceDefinition, targetDefinition) {
    if (kind === 'sequence') return this.canConnectSequence(sourceDefinition, targetDefinition);
    if (kind === 'value') return this.canConnectValue(sourceDefinition, targetDefinition);
    if (kind === 'body') return this.canConnectBody(sourceDefinition, targetDefinition);
    return false;
  }
}

export default VisualConnectionSystem;