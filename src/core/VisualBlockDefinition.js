export const VISUAL_BLOCK_KINDS = Object.freeze({
  COMMAND: 'COMMAND',
  VALUE: 'VALUE',
  STRUCTURE: 'STRUCTURE',
  EXPRESSION: 'EXPRESSION',
});

export const VISUAL_TYPES = Object.freeze({
  NUMBER: 'NUMBER',
  TEXT: 'TEXT',
  BOOLEAN: 'BOOLEAN',
  PLAYER: 'PLAYER',
  OBJECT: 'OBJECT',
  POSITION: 'POSITION',
  COLOR: 'COLOR',
  SOUND: 'SOUND',
  ANY: 'ANY',
});

const expressionTypes = new Set([
  'operators',
  'logic',
  'math',
]);

const valueTypes = new Set([
  'objects',
  'properties',
  'players',
]);

const commandIds = new Set([
  'set_property',
  'property_set',
  'property_add_assign',
  'property_sub_assign',
  'property_mul_assign',
  'property_div_assign',
  'property_set_alias',
  'attribute_set',
  'attribute_remove',
  'object_destroy',
  'object_clear_all_children',
  'object_remove',
  'object_set_attribute',
  'object_set_network_owner',
  'player_load_character',
  'player_kick',
]);

const expressionIds = new Set([
  'comparison_block',
  'logical_comparison_block',
  'arithmetic_block',
  'logical_operator_block',
  'unary_operator_block',
  'boolean_value',
  'and_block',
  'or_block',
  'not_block',
  'typeof_block',
  'is_nil_block',
  'is_true_block',
  'concatenate_block',
  'length_block',
  'math_unary_block',
  'math_random_block',
  'math_random_range_block',
  'math_binary_block',
]);

const expressionOutputs = Object.freeze({
  boolean_value: VISUAL_TYPES.BOOLEAN,
  comparison_block: VISUAL_TYPES.BOOLEAN,
  logical_comparison_block: VISUAL_TYPES.BOOLEAN,
  and_block: VISUAL_TYPES.BOOLEAN,
  or_block: VISUAL_TYPES.BOOLEAN,
  not_block: VISUAL_TYPES.BOOLEAN,
  is_nil_block: VISUAL_TYPES.BOOLEAN,
  is_true_block: VISUAL_TYPES.BOOLEAN,
  arithmetic_block: VISUAL_TYPES.NUMBER,
  math_unary_block: VISUAL_TYPES.NUMBER,
  math_random_block: VISUAL_TYPES.NUMBER,
  math_random_range_block: VISUAL_TYPES.NUMBER,
  math_binary_block: VISUAL_TYPES.NUMBER,
  length_block: VISUAL_TYPES.NUMBER,
  concatenate_block: VISUAL_TYPES.TEXT,
  typeof_block: VISUAL_TYPES.TEXT,
});

function kindForLegacyDefinition(id, definition) {
  if (definition.kind) return definition.kind;
  if (definition.children) return VISUAL_BLOCK_KINDS.STRUCTURE;
  if (expressionIds.has(id) || expressionTypes.has(definition.type)) return VISUAL_BLOCK_KINDS.EXPRESSION;
  if (commandIds.has(id)) return VISUAL_BLOCK_KINDS.COMMAND;
  if (valueTypes.has(definition.type)) return VISUAL_BLOCK_KINDS.VALUE;
  return VISUAL_BLOCK_KINDS.COMMAND;
}

function visualTypeForMeta(meta = [], inputId = '') {
  if (String(meta[0] || '').trim().toLowerCase() === 'object' || inputId.toLowerCase() === 'object') return VISUAL_TYPES.OBJECT;
  const type = String(meta[1] || '').toLowerCase();
  if (type === 'number') return VISUAL_TYPES.NUMBER;
  if (type === 'boolean') return VISUAL_TYPES.BOOLEAN;
  if (type === 'color') return VISUAL_TYPES.COLOR;
  if (type === 'position' || type === 'vector3' || type === 'cframe') return VISUAL_TYPES.POSITION;
  if (type === 'sound') return VISUAL_TYPES.SOUND;
  if (type === 'player') return VISUAL_TYPES.PLAYER;
  if (type === 'object' || type === 'instance' || type === 'part' || type === 'model') return VISUAL_TYPES.OBJECT;
  if (type === 'text' || type === 'string') return VISUAL_TYPES.TEXT;
  return VISUAL_TYPES.ANY;
}

export function normalizeVisualDefinition(id, definition = {}) {
  const kind = kindForLegacyDefinition(id, definition);
  const inputs = Object.entries(definition.propsMeta || {}).map(([inputId, meta]) => ({
    id: inputId,
    name: meta[0] || inputId,
    type: visualTypeForMeta(meta, inputId),
    required: false,
    accepts: meta[2] === 'socket' ? ['VALUE', 'EXPRESSION'] : ['LITERAL'],
    default: definition.props?.[inputId],
  }));

  return Object.freeze({
    id,
    name: definition.label || id,
    kind,
    category: definition.category || definition.type || 'general',
    appearance: {
      icon: definition.icon || '',
      color: definition.color || null,
    },
    inputs,
    output: kind === VISUAL_BLOCK_KINDS.VALUE || kind === VISUAL_BLOCK_KINDS.EXPRESSION
      ? (definition.output || expressionOutputs[id] || VISUAL_TYPES.ANY)
      : null,
    connections: kind === VISUAL_BLOCK_KINDS.COMMAND || kind === VISUAL_BLOCK_KINDS.STRUCTURE
      ? { previous: VISUAL_BLOCK_KINDS.COMMAND, next: VISUAL_BLOCK_KINDS.COMMAND }
      : { previous: null, next: null },
    bodies: kind === VISUAL_BLOCK_KINDS.STRUCTURE
      ? (definition.bodies || [{ id: 'body', accepts: VISUAL_BLOCK_KINDS.COMMAND }])
      : [],
    legacy: definition,
  });
}

export function normalizeVisualCatalog(definitions = {}) {
  return Object.fromEntries(Object.entries(definitions).map(([id, definition]) => [
    id,
    normalizeVisualDefinition(id, definition),
  ]));
}