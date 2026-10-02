import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { readFileSync } from 'node:fs';

import { BlockRegistry } from '../src/core/BlockRegistry.js';
import { TypeSystem } from '../src/core/TypeSystem.js';
import { ContextSystem } from '../src/core/ContextSystem.js';
import { ReferenceSystem } from '../src/core/ReferenceSystem.js';
import { CodeBuilder } from '../src/core/CodeBuilder.js';
import { ScopeSystem } from '../src/core/ScopeSystem.js';
import { moveObjectByBlock } from '../src/blocks/movement/moveObjectBy.js';
import { playerJoinedBlock } from '../src/blocks/events/playerJoined.js';
import { waitBlock } from '../src/blocks/control/wait.js';
import { ifBlock } from '../src/blocks/control/if.js';
import { whileBlock } from '../src/blocks/control/while.js';
import { setVariableBlock } from '../src/blocks/variables/setVariable.js';
import { booleanBlock } from '../src/blocks/logic/boolean.js';
import { comparisonBlock } from '../src/blocks/logic/comparison.js';
import { arithmeticBlock } from '../src/blocks/math/arithmetic.js';
import { setColorBlock } from '../src/blocks/appearance/setColor.js';
import { setPropertyBlock } from '../src/blocks/objects/setProperty.js';
import { andBlock } from '../src/blocks/logic/and.js';
import { orBlock } from '../src/blocks/logic/or.js';
import { notBlock } from '../src/blocks/logic/not.js';
import { movePartByBlock } from '../src/blocks/movement/movePartBy.js';
import { setWalkSpeedBlock } from '../src/blocks/character/setWalkSpeed.js';
import { jumpCharacterBlock } from '../src/blocks/character/jumpCharacter.js';
import { showTextBlock } from '../src/blocks/ui/showText.js';
import { inputPressedBlock } from '../src/blocks/input/inputPressed.js';
import { teleportToBlock } from '../src/blocks/teleport/teleportTo.js';
import { playSoundBlock } from '../src/blocks/audio/playSound.js';
import { setScoreBlock } from '../src/blocks/variables/setScore.js';
import { generateMoveObjectBy } from '../src/generators/luau/movement/moveObjectBy.js';
import { generatePlayerJoined } from '../src/generators/luau/events/playerJoined.js';
import { generateWait } from '../src/generators/luau/control/wait.js';
import { generateIf } from '../src/generators/luau/control/if.js';
import { generateWhile } from '../src/generators/luau/control/while.js';
import { generateSetVariable } from '../src/generators/luau/variables/setVariable.js';
import { generateBoolean } from '../src/generators/luau/logic/boolean.js';
import { generateComparison } from '../src/generators/luau/logic/comparison.js';
import { generateArithmetic } from '../src/generators/luau/math/arithmetic.js';
import { generateSetColor } from '../src/generators/luau/appearance/setColor.js';
import { generateSetProperty } from '../src/generators/luau/objects/setProperty.js';
import { generateAnd } from '../src/generators/luau/logic/and.js';
import { generateOr } from '../src/generators/luau/logic/or.js';
import { generateNot } from '../src/generators/luau/logic/not.js';
import { generateMovePartBy } from '../src/generators/luau/movement/movePartBy.js';
import { generateSetWalkSpeed } from '../src/generators/luau/character/setWalkSpeed.js';
import { generateJumpCharacter } from '../src/generators/luau/character/jumpCharacter.js';
import { generateShowText } from '../src/generators/luau/ui/showText.js';
import { generateInputPressed } from '../src/generators/luau/input/inputPressed.js';
import { generateTeleportTo } from '../src/generators/luau/teleport/teleportTo.js';
import { generatePlaySound } from '../src/generators/luau/audio/playSound.js';
import { generateSetScore } from '../src/generators/luau/variables/setScore.js';
import { normalizeVisualDefinition, VISUAL_BLOCK_KINDS, VISUAL_TYPES } from '../src/core/VisualBlockDefinition.js';
import { VisualTypeSystem } from '../src/core/VisualTypeSystem.js';
import { VisualConnectionSystem } from '../src/core/VisualConnectionSystem.js';
import { VisualBlockTree } from '../src/core/VisualBlockTree.js';
import { appendVisualProjectMetadata, normalizeVisualProjectTree, readVisualProjectMetadata } from '../src/core/VisualProjectFile.js';
import { serializeLuauExpression } from '../src/core/LuauExpressionSerializer.js';
import { ROBLOX_SERVICE_OPTIONS } from '../src/core/RobloxServiceOptions.js';
import { getDefaultEnumState, ROBLOX_ENUM_OPTIONS } from '../src/core/RobloxEnumOptions.js';
import { GeneratedCodeDisplay, InputBlock, InputFreeBlock, VisualBlockComponent } from '../src/ui/VisualBlockComponents.js';

test('React block and output components follow the input-aware component contract', () => {
  assert.ok(InputBlock.prototype instanceof React.Component);
  assert.equal(typeof InputFreeBlock, 'function');
  assert.ok(GeneratedCodeDisplay.prototype instanceof React.Component);
  assert.equal(GeneratedCodeDisplay.getDerivedStateFromProps({ code: 'fresh' }, { code: 'old' }).code, 'fresh');
  assert.equal(typeof VisualBlockComponent, 'function');
});

test('Browser bundle path is relative for GitHub Pages project sites', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

  assert.match(html, /<script type="module" src="dist\/app\.js"><\/script>/);
  assert.doesNotMatch(html, /src="\/dist\/app\.js"/);
});

test('GetService blocks expose the complete service dropdown and generate quoted Luau names', () => {
  const source = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
  const expectedServices = [
    'AnalyticsService', 'AssetService', 'AvatarEditorService', 'BadgeService', 'CaptureService',
    'ChangeHistoryService', 'Chat', 'CollectionService', 'ContentProvider', 'ContextActionService',
    'ControllerService', 'CoreGui', 'DataStoreService', 'Debris', 'GeometryService', 'GroupService',
    'GuiService', 'HapticService', 'HttpService', 'InsertService', 'KeyframeSequenceProvider',
    'LocalizationService', 'LogService', 'MarketplaceService', 'MaterialService', 'MemoryStoreService',
    'MessagingService', 'NetworkClient', 'NetworkServer', 'PathfindingService', 'PhysicsService',
    'Players', 'PolicyService', 'ProximityPromptService', 'ReplicatedFirst', 'ReplicatedStorage',
    'RunService', 'ServerScriptService', 'ServerStorage', 'SoundService', 'StarterGui', 'StarterPack',
    'StarterPlayer', 'Stats', 'StudioService', 'Teams', 'TeleportService', 'TextChatService',
    'TextService', 'TweenService', 'UserInputService', 'UserService', 'VRService', 'VoiceChatService',
    'Workspace',
  ];

  assert.deepEqual(ROBLOX_SERVICE_OPTIONS, expectedServices);
  ['game_get_service', 'services_get_service'].forEach((key) => {
    const definition = source.split('\n').find(line => line.startsWith(`  ${key}:`));
    assert.match(definition, /service:\['Service','service'\]/);
  });
  assert.match(source, /meta\[1\]==='service'/);

  const definition = { get_service: { template: 'game:GetService({service})', props: { service: '"Players"' } } };
  ROBLOX_SERVICE_OPTIONS.forEach((service) => {
    const node = { type: 'get_service', properties: { service: JSON.stringify(service) } };
    assert.equal(serializeLuauExpression(node, definition, String), `game:GetService("${service}")`);
  });
});

test('GetService blocks connect to variable value sockets as object values', () => {
  const source = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
  const variableDefinition = normalizeVisualDefinition('set_variable', {
    type: 'variables',
    props: { value: '0' },
    propsMeta: { value: ['Value', 'any', 'socket'] },
  });
  const variableInput = variableDefinition.inputs[0];

  ['game_get_service', 'services_get_service'].forEach((key) => {
    const definitionLine = source.split('\n').find(line => line.startsWith(`  ${key}:`));
    assert.match(definitionLine, /kind:'VALUE',output:'OBJECT'/);
    const serviceDefinition = normalizeVisualDefinition(key, {
      type: key === 'game_get_service' ? 'objects' : 'services',
      kind: 'VALUE',
      output: 'OBJECT',
    });

    assert.equal(VisualConnectionSystem.canConnectValue(serviceDefinition, variableInput), true);
  });
});

test('Enum block offers category-specific states and generates an Enum expression', () => {
  const source = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
  const enumDefinitionLine = source.split('\n').find(line => line.startsWith('  advanced_enum:'));
  const categories = [
    'KeyCode', 'UserInputType', 'UserInputState', 'HumanoidStateType', 'HumanoidRigType',
    'Material', 'PartType', 'EasingStyle', 'EasingDirection', 'CameraType', 'AnimationPriority',
    'RaycastFilterType', 'ExplosionType', 'TweenStatus', 'TextXAlignment', 'TextYAlignment',
    'TextTruncate', 'FillDirection', 'SortOrder', 'HorizontalAlignment', 'VerticalAlignment',
    'ZIndexBehavior', 'ScrollingDirection', 'SurfaceType', 'CollisionFidelity', 'ModelStreamingMode',
    'PhysicsSteppingMethod', 'ActuatorRelativeTo', 'PositionAlignmentMode', 'OrientationAlignmentMode',
    'PathStatus', 'FontSize', 'FontStyle', 'FormFactor', 'GearType', 'GamepadType', 'TeleportState',
    'TeleportResult', 'ChatVersion', 'TextFilterContext', 'PreferredInput', 'Axis', 'AccessoryType',
    'AvatarAssetType', 'HighlightDepthMode', 'HandlesStyle', 'HapticEffectType', 'InOutInfoType',
    'InputType', 'InputActionType',
  ];

  assert.deepEqual(Object.keys(ROBLOX_ENUM_OPTIONS), categories);
  assert.match(enumDefinitionLine, /\},false,\{kind:'VALUE',output:'ENUM'\}\)/);
  assert.deepEqual(ROBLOX_ENUM_OPTIONS.UserInputState, ['Begin', 'Change', 'End', 'Cancel', 'None']);
  assert.deepEqual(ROBLOX_ENUM_OPTIONS.HumanoidRigType, ['R6', 'R15']);
  assert.deepEqual(ROBLOX_ENUM_OPTIONS.GearType, [
    'Hat', 'Gear', 'MeleeWeapons', 'RangedWeapons', 'Explosives', 'PowerUps', 'NavigationEnhancers',
    'MusicalInstruments', 'SocialItems', 'BuildingTools', 'Transport',
  ]);
  assert.ok(ROBLOX_ENUM_OPTIONS.AccessoryType.includes('Eyelash'));
  assert.ok(ROBLOX_ENUM_OPTIONS.HapticEffectType.includes('GameplayCollision'));
  assert.ok(ROBLOX_ENUM_OPTIONS.InputType.includes('Sin'));
  assert.ok(ROBLOX_ENUM_OPTIONS.GamepadType.includes('Unknown'));
  assert.equal(getDefaultEnumState('HumanoidRigType'), 'R6');
  assert.equal(getDefaultEnumState('CameraType'), 'Fixed');
  assert.equal(getDefaultEnumState('UnknownCategory'), '');
  assert.match(source, /enumState.+ROBLOX_ENUM_OPTIONS\[node\?\.properties\?\.enumType\]/);
  assert.match(source, /propertyId==='enumType'.+getDefaultEnumState\(value\)/);

  const definition = {
    advanced_enum: { template: 'Enum.{enumType}.{value}', props: { enumType: 'KeyCode', value: 'E' } },
  };
  assert.equal(
    serializeLuauExpression({ type: 'advanced_enum', properties: { enumType: 'UserInputState', value: 'Begin' } }, definition, String),
    'Enum.UserInputState.Begin',
  );
});

test('BindAction accepts text, object, boolean, and Enum value blocks in matching sockets', () => {
  const source = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
  const bindActionLine = source.split('\n').find(line => line.startsWith('  context_action_bind_action:'));
  const functionReferenceLine = source.split('\n').find(line => line.startsWith('  function_reference:'));

  assert.match(bindActionLine, /actionName:\['Name','text','socket'\]/);
  assert.match(bindActionLine, /functionName:\['Function','object','socket'\]/);
  assert.match(bindActionLine, /touch:\['Touch','boolean','socket'\]/);
  assert.match(bindActionLine, /keys:\['Keys','enum','socket'\]/);
  assert.match(functionReferenceLine, /template:'\{functionName\}'.+kind:'VALUE',output:'FUNCTION'/);

  const textValue = normalizeVisualDefinition('text_value', { kind: 'VALUE', output: 'TEXT' });
  const callback = normalizeVisualDefinition('function_reference', { kind: 'VALUE', output: 'FUNCTION' });
  const objectValue = normalizeVisualDefinition('object_reference', { kind: 'VALUE', output: 'OBJECT' });
  const booleanValue = normalizeVisualDefinition('boolean_value', { kind: 'VALUE', output: 'BOOLEAN' });
  const enumValue = normalizeVisualDefinition('advanced_enum', { kind: 'VALUE', output: 'ENUM' });
  const nameInput = normalizeVisualDefinition('bind_action', {
    propsMeta: { actionName: ['Name', 'text', 'socket'] },
  }).inputs[0];
  const callbackInput = normalizeVisualDefinition('bind_action', {
    propsMeta: { functionName: ['Function', 'object', 'socket'] },
  }).inputs[0];
  const touchInput = normalizeVisualDefinition('bind_action', {
    propsMeta: { touch: ['Touch', 'boolean', 'socket'] },
  }).inputs[0];
  const keysInput = normalizeVisualDefinition('bind_action', {
    propsMeta: { keys: ['Keys', 'enum', 'socket'] },
  }).inputs[0];

  assert.equal(VisualConnectionSystem.canConnectValue(textValue, nameInput), true);
  assert.equal(VisualConnectionSystem.canConnectValue(callback, callbackInput), true);
  assert.equal(VisualConnectionSystem.canConnectValue(objectValue, callbackInput), true);
  assert.equal(VisualConnectionSystem.canConnectValue(booleanValue, touchInput), true);
  assert.equal(VisualConnectionSystem.canConnectValue(enumValue, keysInput), true);
  assert.equal(VisualConnectionSystem.canConnectValue(enumValue, callbackInput), false);
  assert.equal(VisualConnectionSystem.canConnectValue(callback, keysInput), false);
  assert.equal(VisualConnectionSystem.canConnectValue(textValue, touchInput), false);

  const definitions = {
    function_reference: { template: '{functionName}' },
    bind_action: { template: 'ContextActionService:BindAction({actionName}, {functionName}, {touch}, {keys})' },
  };
  assert.equal(serializeLuauExpression({
    type: 'bind_action',
    properties: { actionName: 'Jump', functionName: 'onAction', touch: 'false', keys: 'Enum.KeyCode.Space' },
  }, definitions, String), 'ContextActionService:BindAction("Jump", onAction, false, Enum.KeyCode.Space)');
});

test('Holding Space pans the canvas unless a text or form editor is active', () => {
  const source = readFileSync(new URL('../app.js', import.meta.url), 'utf8');

  assert.match(source, /function isEditingText\(target\).*target\.closest\('input,textarea,select/);
  assert.match(source, /document\.addEventListener\('keydown',event=>\{if\(isSpaceKey\(event\)\)/);
  assert.match(source, /document\.addEventListener\('keyup',event=>\{if\(!spacePanActive\|\|!isSpaceKey\(event\)\)return;spacePanActive=false;setHandMode\(false\)/);
  assert.match(source, /window\.addEventListener\('blur',\(\)=>\{if\(!spacePanActive\)return;spacePanActive=false;setHandMode\(false\)\}/);
});

test('Editing a literal inside a nested value block updates generated Luau', () => {
  const definitions = {
    assignment: { template: '{value}', props: {} },
    text_expression: { template: 'string.lower({value})', props: {} },
    text_value: { template: '{value}', props: {}, output: 'TEXT' },
  };
  const literal = {
    id: 'literal-1',
    type: 'text_value',
    properties: { value: 'before' },
    inputs: { value: 'before' },
  };
  const expression = {
    id: 'expression-1',
    type: 'text_expression',
    properties: { value: literal },
    inputs: { value: literal },
  };
  const assignment = {
    id: 'assignment-1',
    type: 'assignment',
    properties: { value: expression },
    inputs: { value: expression },
  };

  assert.equal(VisualBlockTree.setProperty([assignment], literal.id, 'value', 'after'), true);
  assert.equal(serializeLuauExpression(assignment, definitions, value => String(value ?? '')), 'string.lower("after")');
});

test('BlockRegistry registers blocks and exposes categories', () => {
  const blockId = 'test_move_object_by';

  BlockRegistry.register({
    id: blockId,
    category: 'movement',
    name: 'Move object by',
    definition: moveObjectByBlock,
    generator: generateMoveObjectBy,
    contexts: ['server', 'client'],
  });

  const block = BlockRegistry.get(blockId);
  assert.ok(block);
  assert.equal(block.category, 'movement');
  assert.ok(BlockRegistry.listByCategory('movement').some(item => item.id === blockId));
});

test('Player category contains the requested Roblox player blocks', () => {
  const source = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
  const required = [
    'players_service',
    'local_player',
    'players_get_players',
    'players_get_player_from_character',
    'players_get_player_by_user_id',
    'players_player_added',
    'players_player_removing',
    'player_name',
    'player_display_name',
    'player_user_id',
    'player_account_age',
    'player_character',
    'player_team',
    'player_team_color',
    'player_neutral',
    'player_character_added',
    'player_character_removing',
    'player_load_character',
    'player_kick',
    'player_parent',
    'get_character_from_player',
    'get_player_from_character',
    'get_player_by_user_id',
    'for_each_player_in_players_get_players',
  ];

  required.forEach((key) => {
    assert.match(source, new RegExp(`${key}:\\s*\\{`));
  });
});

test('Variable assignment blocks expose sockets for connected values', () => {
  const source = readFileSync(new URL('../app.js', import.meta.url), 'utf8');

  ['set_variable', 'local_set_variable'].forEach((key) => {
    const definition = source.split('\n').find(line => line.startsWith(`  ${key}:`));
    assert.ok(definition, `Missing ${key} definition`);
    assert.match(definition, /value:\['Value','any','socket'\]/);
  });

  [['text_value', 'TEXT'], ['number_value', 'NUMBER'], ['boolean_value', 'BOOLEAN']].forEach(([key, output]) => {
    const definition = source.split('\n').find(line => line.startsWith(`  ${key}:`));
    assert.ok(definition, `Missing ${key} definition`);
    assert.match(definition, new RegExp(`kind:'VALUE',output:'${output}'`));
  });
});

test('Activated event block connects an object and provides an event body', () => {
  const source = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
  const definition = source.split('\n').find(line => line.startsWith('  when_object_activated:'));

  assert.ok(definition);
  assert.match(definition, /\{object\}\.Activated:Connect\(function\(\)/);
  assert.match(definition, /object:\['Object','object','socket'\]/);
  assert.match(definition, /children:true/);
});

test('Object reference block outputs a plain object expression', () => {
  const source = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
  const definition = source.split('\n').find(line => line.startsWith('  object_reference:'));
  const objectReference = normalizeVisualDefinition('object_reference', {
    type: 'objects',
    kind: 'VALUE',
    output: VISUAL_TYPES.OBJECT,
  });
  const objectInput = normalizeVisualDefinition('object_name', {
    type: 'objects',
    propsMeta: { object: ['Object', 'text', 'socket'] },
  }).inputs[0];

  assert.ok(definition);
  assert.match(definition, /template:'\{object\}'/);
  assert.doesNotMatch(definition, /\.Name|\.Parent|\.ClassName/);
  assert.equal(objectInput.type, VISUAL_TYPES.OBJECT);
  assert.equal(VisualConnectionSystem.canConnectValue(objectReference, objectInput), true);
});

test('Every block with an object placeholder declares a nestable object socket', () => {
  const source = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
  const objectBlocks = source.split('\n').filter(line =>
    /^\s{2}[a-z0-9_]+:/.test(line) && /label:'[^']*\[(?:objeto|object)\]/i.test(line),
  );

  assert.ok(objectBlocks.length > 0);
  objectBlocks.forEach(definition => {
    assert.match(definition, /propsMeta:\{[^}]*object:\['Object','(?:text|object)','socket'\]/);
  });
});

test('Debug category provides a Print command with a value socket', () => {
  const source = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
  const definition = source.split('\n').find(line => line.startsWith('  print_block:'));
  const printBlock = normalizeVisualDefinition('print_block', {
    type: 'debug',
    propsMeta: { value: ['Value', 'text', 'socket'] },
  });

  assert.match(source, /debug:\{label:'Debug'/);
  assert.match(source, /debug:'Depuração'/);
  assert.ok(definition);
  assert.match(definition, /template:'print\(\{value\}\)'/);
  assert.equal(printBlock.kind, 'COMMAND');
  assert.equal(printBlock.inputs[0].id, 'value');
});

test('Debug comment block is a collapsible structure that preserves child code', () => {
  const source = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
  const definition = source.split('\n').find(line => line.startsWith('  comment_block:'));
  const commentBlock = normalizeVisualDefinition('comment_block', {
    type: 'debug',
    propsMeta: { comment: ['Comment', 'text'] },
    children: true,
  });

  assert.ok(definition);
  assert.match(definition, /template:'-- \{comment\}'/);
  assert.match(definition, /children:true/);
  assert.equal(commentBlock.kind, 'STRUCTURE');
  assert.equal(commentBlock.inputs[0].id, 'comment');
  assert.match(source, /aria-expanded/);
  assert.match(source, /node\.type === 'comment_block'/);
  assert.match(source, /emitList\(node\.children \|\| \[\], depth\)/);
});

test('Forever event block has no inputs and keeps its legacy project id', () => {
  const source = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
  const definition = source.split('\n').find(line => line.startsWith('  every_second:'));
  const foreverBlock = normalizeVisualDefinition('every_second', {
    type: 'events',
    label: 'Forever',
    children: true,
  });

  assert.ok(definition);
  assert.match(definition, /label:'Forever'/);
  assert.match(definition, /template:'while true do'/);
  assert.match(definition, /children:true/);
  assert.doesNotMatch(definition, /props:|propsMeta:/);
  assert.match(source, /every_second:'forever'/);
  assert.match(source, /every_second:'para sempre'/);
  assert.equal(foreverBlock.kind, 'STRUCTURE');
  assert.deepEqual(foreverBlock.inputs, []);
});

test('Edited text and number literal values serialize into connected code', () => {
  const definitions = {
    set_variable: { template: '{name} = {value}', props: { name: 'coins', value: '0' } },
    text_value: { template: '{value}', props: { value: 'text' }, output: 'TEXT' },
    number_value: { template: '{value}', props: { value: '0' }, output: 'NUMBER' },
    text_expression: { template: 'tostring({value})', props: { value: '' }, output: 'TEXT' },
  };
  const normalizeOperator = value => String(value ?? '');
  const textAssignment = {
    type: 'set_variable',
    properties: { name: 'message', value: { type: 'text_value', properties: { value: 'updated text' } } },
  };
  const numberAssignment = {
    type: 'set_variable',
    properties: { name: 'score', value: { type: 'number_value', properties: { value: '42' } } },
  };
  const nestedTextExpression = {
    type: 'text_expression',
    properties: { value: { type: 'text_value', properties: { value: 'updated text' } } },
  };

  assert.equal(serializeLuauExpression(textAssignment, definitions, normalizeOperator), 'message = "updated text"');
  assert.equal(serializeLuauExpression(numberAssignment, definitions, normalizeOperator), 'score = 42');
  assert.equal(serializeLuauExpression(nestedTextExpression, definitions, normalizeOperator), 'tostring("updated text")');
});

test('Block markup uses valid block containers for sockets with nested blocks', () => {
  const source = readFileSync(new URL('../app.js', import.meta.url), 'utf8');

  assert.match(source, /return`<div class="socket /);
  assert.match(source, /<div class="block-label">\$\{labelMarkup\}<\/div>/);
});

test('Object reference updates the enclosing Activated event Luau', () => {
  const definitions = {
    object_reference: { template: '{object}', props: { object: 'workspace' }, output: 'OBJECT' },
    when_object_activated: { template: '{object}.Activated:Connect(function()' },
  };
  const objectReference = {
    id: 'object-1',
    type: 'object_reference',
    properties: { object: 'workspace' },
    inputs: { object: 'workspace' },
  };
  const event = {
    id: 'event-1',
    type: 'when_object_activated',
    properties: { object: objectReference },
    inputs: { object: objectReference },
  };

  assert.equal(serializeLuauExpression(event, definitions, value => String(value ?? '')), 'workspace.Activated:Connect(function()');
  assert.equal(VisualBlockTree.setProperty([event], 'object-1', 'object', 'workspace.OtherPart'), true);
  assert.equal(serializeLuauExpression(event, definitions, value => String(value ?? '')), 'workspace.OtherPart.Activated:Connect(function()');
});

test('Visual project files keep Luau and recover the block tree', () => {
  const tree = [{ id: 'root-1', type: 'set_variable', properties: { name: 'part', value: { id: 'value-1', type: 'object_name', properties: { object: 'workspace' } } } }];
  const source = 'part = workspace.Name';
  const file = appendVisualProjectMetadata(source, tree, 'Projeto: Ação');
  const loaded = readVisualProjectMetadata(file);

  assert.ok(file.startsWith(source));
  assert.match(file, /--\[\[/);
  assert.equal(loaded.code, source);
  assert.equal(loaded.title, 'Projeto: Ação');
  assert.deepEqual(loaded.tree, tree);
  assert.equal(readVisualProjectMetadata(source), null);

  const [restored] = normalizeVisualProjectTree(loaded.tree, {
    set_variable: {},
    object_name: {},
  });
  assert.equal(restored.properties.value.type, 'object_name');
  assert.equal(restored.inputs.value, restored.properties.value);
  assert.equal(restored.children, restored.bodies.body);
});

test('TypeSystem allows compatible assignments and rejects invalid ones', () => {
  assert.equal(TypeSystem.isAssignable('number', 'number'), true);
  assert.equal(TypeSystem.isAssignable('Part', 'Instance'), true);
  assert.equal(TypeSystem.isAssignable('string', 'number'), false);
  assert.equal(TypeSystem.coerceIfSafe('number', 'string'), 'number');
});

test('ScopeSystem manages variable visibility by context', () => {
  ScopeSystem.reset();
  ScopeSystem.declare('coins', 'event', { value: '0' });
  ScopeSystem.declare('speed', 'local', { value: '12' });

  assert.equal(ScopeSystem.resolve('coins').scope, 'event');
  assert.equal(ScopeSystem.isVisible('coins', 'event'), true);
  assert.equal(ScopeSystem.isVisible('speed', 'script'), true);
});

test('ContextSystem resolves server/client compatibility', () => {
  assert.equal(ContextSystem.isCompatible('server', 'server'), true);
  assert.equal(ContextSystem.isCompatible('server', 'client'), false);
  assert.equal(ContextSystem.isCompatible('both', 'server'), true);
});

test('ReferenceSystem resolves common Roblox references', () => {
  ReferenceSystem.register({
    id: 'player',
    label: 'Player',
    kind: 'Player',
    expression: 'game.Players.LocalPlayer',
    contexts: ['client', 'server'],
  });

  assert.equal(ReferenceSystem.resolve('player').expression, 'game.Players.LocalPlayer');
  assert.equal(ReferenceSystem.get('player').kind, 'Player');
});

test('CodeBuilder creates properly indented Luau', () => {
  const code = new CodeBuilder()
    .line('local part = workspace.Part')
    .line('if part then')
    .indent()
    .line('part.Position = Vector3.new(0, 10, 0)')
    .dedent()
    .line('end')
    .build();

  assert.match(code, /local part = workspace\.Part/);
  assert.match(code, /if part then/);
  assert.match(code, /part\.Position = Vector3\.new\(0, 10, 0\)/);
});

test('Movement generator produces valid Luau', () => {
  const code = generateMoveObjectBy({
    target: 'door',
    distance: '10',
    direction: 'Vector3.new(1, 0, 0)',
  });

  assert.match(code, /door/);
  assert.match(code, /10/);
  assert.match(code, /PivotTo|Position/);
});

test('Phase 2 event block is registered and generates Luau', () => {
  BlockRegistry.register({
    id: 'player_joined',
    category: 'events',
    name: 'Player joined',
    definition: playerJoinedBlock,
    generator: generatePlayerJoined,
    contexts: ['server'],
  });

  const block = BlockRegistry.get('player_joined');
  const code = generatePlayerJoined({ body: 'print(player.Name)' });

  assert.ok(block);
  assert.match(code, /Players\.PlayerAdded/);
  assert.match(code, /PlayerAdded:Connect\(/);
  assert.match(code, /PlayerAdded:Connect\(function\(player\)/);
  assert.match(code, /print\(player\.Name\)/);
  assert.match(code, /\nend\)$/);
});

test('Phase 2 control block generates a safe wait statement', () => {
  const code = generateWait({ seconds: '1.5' });

  assert.match(code, /task\.wait\(1\.5\)/);
  assert.match(code, /wait/);
  assert.ok(waitBlock);
});

test('Phase 3 if block generates valid Luau conditionals', () => {
  BlockRegistry.register({
    id: 'if_block',
    category: 'control',
    name: 'If',
    definition: ifBlock,
    generator: generateIf,
    contexts: ['server', 'client', 'both'],
  });

  const code = generateIf({ condition: 'coins > 0', body: 'print("win")' });

  assert.match(code, /if coins > 0 then/);
  assert.match(code, /print\("win"\)/);
  assert.ok(BlockRegistry.get('if_block'));
});

test('If block supports a comparison editor with left, operator and right fields', () => {
  const code = generateIf({ left: 'coins', operator: '>=', right: '10', body: 'print("win")' });

  assert.match(code, /if coins >= 10 then/);
  assert.match(code, /print\("win"\)/);
});

test('Phase 3 while block generates valid Luau loops', () => {
  BlockRegistry.register({
    id: 'while_block',
    category: 'control',
    name: 'While',
    definition: whileBlock,
    generator: generateWhile,
    contexts: ['server', 'client', 'both'],
  });

  const code = generateWhile({ condition: 'coins > 0', body: 'coins -= 1' });

  assert.match(code, /while coins > 0 do/);
  assert.match(code, /coins -= 1/);
  assert.ok(BlockRegistry.get('while_block'));
});

test('Phase 4 variable assignment block generates valid Luau', () => {
  BlockRegistry.register({
    id: 'set_variable',
    category: 'variables',
    name: 'Set variable',
    definition: setVariableBlock,
    generator: generateSetVariable,
    contexts: ['server', 'client', 'both'],
  });

  const code = generateSetVariable({ name: 'coins', value: '10' });

  assert.match(code, /coins\s*=\s*10/);
  assert.ok(BlockRegistry.get('set_variable'));
});

test('Phase 4 variable assignment supports custom string values', () => {
  const code = generateSetVariable({ name: 'message', value: 'hello' });

  assert.match(code, /message\s*=\s*"hello"/);
});

test('Phase 4 logical boolean block generates valid Luau', () => {
  BlockRegistry.register({
    id: 'boolean_value',
    category: 'logic',
    name: 'Boolean',
    definition: booleanBlock,
    generator: generateBoolean,
    contexts: ['server', 'client', 'both'],
  });

  const code = generateBoolean({ value: 'true' });

  assert.match(code, /true/);
  assert.ok(BlockRegistry.get('boolean_value'));
});

test('Phase 5 comparison block generates valid Luau comparisons', () => {
  BlockRegistry.register({
    id: 'comparison_block',
    category: 'logic',
    name: 'Comparison',
    definition: comparisonBlock,
    generator: generateComparison,
    contexts: ['server', 'client', 'both'],
  });

  const code = generateComparison({ left: 'coins', operator: '>', right: '0' });

  assert.match(code, /coins > 0/);
  assert.ok(BlockRegistry.get('comparison_block'));
});

test('Phase 5 arithmetic block generates valid Luau arithmetic', () => {
  BlockRegistry.register({
    id: 'arithmetic_block',
    category: 'math',
    name: 'Arithmetic',
    definition: arithmeticBlock,
    generator: generateArithmetic,
    contexts: ['server', 'client', 'both'],
  });

  const code = generateArithmetic({ left: 'coins', operator: '+', right: '10' });

  assert.match(code, /coins \+ 10/);
  assert.ok(BlockRegistry.get('arithmetic_block'));
});

test('Phase 6 appearance block generates valid Luau color assignment', () => {
  BlockRegistry.register({
    id: 'set_color',
    category: 'appearance',
    name: 'Set color',
    definition: setColorBlock,
    generator: generateSetColor,
    contexts: ['server', 'client', 'both'],
  });

  const code = generateSetColor({ target: 'part', color: 'Color3.fromRGB(255, 0, 0)' });

  assert.match(code, /part\.Color\s*=\s*Color3\.fromRGB\(255, 0, 0\)/);
  assert.ok(BlockRegistry.get('set_color'));
});

test('Phase 6 object property block generates valid Luau property assignment', () => {
  BlockRegistry.register({
    id: 'set_property',
    category: 'objects',
    name: 'Set property',
    definition: setPropertyBlock,
    generator: generateSetProperty,
    contexts: ['server', 'client', 'both'],
  });

  const code = generateSetProperty({ target: 'part', property: 'Transparency', value: '0.5' });

  assert.match(code, /part\.Transparency\s*=\s*0\.5/);
  assert.ok(BlockRegistry.get('set_property'));
});

test('Phase 7 logical and block generates valid Luau conjunctions', () => {
  BlockRegistry.register({
    id: 'and_block',
    category: 'logic',
    name: 'And',
    definition: andBlock,
    generator: generateAnd,
    contexts: ['server', 'client', 'both'],
  });

  const code = generateAnd({ left: 'coins > 0', right: 'lives > 0' });

  assert.match(code, /coins > 0 and lives > 0/);
  assert.ok(BlockRegistry.get('and_block'));
});

test('Phase 7 movement block produces a safe part translation', () => {
  BlockRegistry.register({
    id: 'move_part_by',
    category: 'movement',
    name: 'Move part by',
    definition: movePartByBlock,
    generator: generateMovePartBy,
    contexts: ['server', 'client', 'both'],
  });

  const code = generateMovePartBy({ target: 'part', x: '1', y: '0', z: '2' });

  assert.match(code, /part\.Position\s*=\s*part\.Position\s*\+\s*Vector3\.new\(1, 0, 2\)/);
  assert.ok(BlockRegistry.get('move_part_by'));
});

test('Phase 8 logical or and not blocks generate valid Luau', () => {
  BlockRegistry.register({
    id: 'or_block',
    category: 'logic',
    name: 'Or',
    definition: orBlock,
    generator: generateOr,
    contexts: ['server', 'client', 'both'],
  });

  BlockRegistry.register({
    id: 'not_block',
    category: 'logic',
    name: 'Not',
    definition: notBlock,
    generator: generateNot,
    contexts: ['server', 'client', 'both'],
  });

  const orCode = generateOr({ left: 'isAlive', right: 'hasKey' });
  const notCode = generateNot({ value: 'isDead' });

  assert.match(orCode, /isAlive or hasKey/);
  assert.match(notCode, /not isDead/);
  assert.ok(BlockRegistry.get('or_block'));
  assert.ok(BlockRegistry.get('not_block'));
});

test('Phase 8 character speed block generates valid Luau', () => {
  BlockRegistry.register({
    id: 'set_walk_speed',
    category: 'character',
    name: 'Set walk speed',
    definition: setWalkSpeedBlock,
    generator: generateSetWalkSpeed,
    contexts: ['server', 'client', 'both'],
  });

  const code = generateSetWalkSpeed({ character: 'player.Character', speed: '16' });

  assert.match(code, /player\.Character[\s\S]*WalkSpeed[\s\S]*16/);
  assert.ok(BlockRegistry.get('set_walk_speed'));
});

test('Phase 10 gameplay and audio blocks generate valid Luau', () => {
  BlockRegistry.register({
    id: 'jump_character',
    category: 'character',
    name: 'Jump character',
    definition: jumpCharacterBlock,
    generator: generateJumpCharacter,
    contexts: ['server', 'client', 'both'],
  });

  BlockRegistry.register({
    id: 'play_sound',
    category: 'audio',
    name: 'Play sound',
    definition: playSoundBlock,
    generator: generatePlaySound,
    contexts: ['server', 'client', 'both'],
  });

  const jumpCode = generateJumpCharacter({ character: 'player.Character' });
  const soundCode = generatePlaySound({ sound: 'coinSound', volume: '0.8' });

  assert.match(jumpCode, /Jump|HumanoidStateType|Jumping/);
  assert.match(soundCode, /coinSound|Sound|Play\(|volume/);
  assert.ok(BlockRegistry.get('jump_character'));
  assert.ok(BlockRegistry.get('play_sound'));
});

test('Phase 11 UI and score blocks generate valid Luau', () => {
  BlockRegistry.register({
    id: 'show_text',
    category: 'ui',
    name: 'Show text',
    definition: showTextBlock,
    generator: generateShowText,
    contexts: ['client'],
  });

  BlockRegistry.register({
    id: 'set_score',
    category: 'variables',
    name: 'Set score',
    definition: setScoreBlock,
    generator: generateSetScore,
    contexts: ['server', 'client', 'both'],
  });

  const textCode = generateShowText({ target: 'scoreLabel', text: 'Level 1' });
  const scoreCode = generateSetScore({ variable: 'score', value: '10' });

  assert.match(textCode, /scoreLabel|Text|Level 1/);
  assert.match(scoreCode, /score\s*=\s*10/);
  assert.ok(BlockRegistry.get('show_text'));
  assert.ok(BlockRegistry.get('set_score'));
});

test('Phase 9 input and teleport blocks generate valid Luau', () => {
  BlockRegistry.register({
    id: 'input_pressed',
    category: 'input',
    name: 'Input pressed',
    definition: inputPressedBlock,
    generator: generateInputPressed,
    contexts: ['client'],
  });

  BlockRegistry.register({
    id: 'teleport_to',
    category: 'teleport',
    name: 'Teleport to',
    definition: teleportToBlock,
    generator: generateTeleportTo,
    contexts: ['server', 'client'],
  });

  const inputCode = generateInputPressed({ key: 'E' });
  const teleportCode = generateTeleportTo({ character: 'player.Character', position: 'Vector3.new(0, 5, 0)' });

  assert.match(inputCode, /UserInputService|InputBegan|E/);
  assert.match(teleportCode, /player\.Character.*CFrame|Vector3\.new\(0, 5, 0\)/);
  assert.ok(BlockRegistry.get('input_pressed'));
  assert.ok(BlockRegistry.get('teleport_to'));
});

test('Visual definitions classify commands, expressions, structures and values', () => {
  const command = normalizeVisualDefinition('move', {
    type: 'movement',
    label: 'Move',
    propsMeta: { amount: ['Amount', 'number', 'socket'] },
  });
  const expression = normalizeVisualDefinition('greater_than', {
    type: 'operators',
    label: 'Greater than',
    output: VISUAL_TYPES.BOOLEAN,
  });
  const structure = normalizeVisualDefinition('repeat', {
    type: 'control',
    label: 'Repeat',
    children: true,
  });
  const value = normalizeVisualDefinition('player', {
    type: 'players',
    label: 'Player',
    output: VISUAL_TYPES.PLAYER,
  });
  const legacyComparison = normalizeVisualDefinition('comparison_block', {
    type: 'operators',
    label: 'Comparison',
  });
  const propertySetter = normalizeVisualDefinition('set_property', { type: 'objects' });
  const playerKick = normalizeVisualDefinition('player_kick', { type: 'players' });
  const objectValue = normalizeVisualDefinition('object_name', { type: 'objects' });

  assert.equal(command.kind, VISUAL_BLOCK_KINDS.COMMAND);
  assert.equal(expression.kind, VISUAL_BLOCK_KINDS.EXPRESSION);
  assert.equal(structure.kind, VISUAL_BLOCK_KINDS.STRUCTURE);
  assert.equal(value.kind, VISUAL_BLOCK_KINDS.VALUE);
  assert.equal(propertySetter.kind, VISUAL_BLOCK_KINDS.COMMAND);
  assert.equal(playerKick.kind, VISUAL_BLOCK_KINDS.COMMAND);
  assert.equal(objectValue.kind, VISUAL_BLOCK_KINDS.VALUE);
  assert.equal(legacyComparison.output, VISUAL_TYPES.BOOLEAN);
  assert.deepEqual(structure.bodies, [{ id: 'body', accepts: VISUAL_BLOCK_KINDS.COMMAND }]);
});

test('Visual type and connection systems enforce compatible inputs', () => {
  const numberCommand = normalizeVisualDefinition('move', {
    type: 'movement',
    propsMeta: { amount: ['Amount', 'number', 'socket'] },
  });
  const textValue = normalizeVisualDefinition('text', {
    type: 'variables',
    output: VISUAL_TYPES.TEXT,
  });
  const numberExpression = normalizeVisualDefinition('sum', {
    type: 'operators',
    output: VISUAL_TYPES.NUMBER,
  });
  const objectValue = normalizeVisualDefinition('object_name', {
    type: 'objects',
  });
  const variableValueInput = normalizeVisualDefinition('set_variable', {
    type: 'variables',
    propsMeta: { value: ['Value', 'any', 'socket'] },
  }).inputs[0];
  const literalValues = [
    normalizeVisualDefinition('text_value', { type: 'variables', kind: 'VALUE', output: VISUAL_TYPES.TEXT }),
    normalizeVisualDefinition('number_value', { type: 'variables', kind: 'VALUE', output: VISUAL_TYPES.NUMBER }),
    normalizeVisualDefinition('boolean_value', { type: 'variables', kind: 'VALUE', output: VISUAL_TYPES.BOOLEAN }),
  ];
  const literalOnlyCommand = normalizeVisualDefinition('literal_only', {
    type: 'movement',
    propsMeta: { amount: ['Amount', 'number'] },
  });

  assert.equal(VisualTypeSystem.isAssignable(VISUAL_TYPES.NUMBER, VISUAL_TYPES.TEXT), false);
  assert.equal(VisualConnectionSystem.canConnectValue(textValue, numberCommand.inputs[0]), false);
  assert.equal(VisualConnectionSystem.canConnectValue(numberExpression, numberCommand.inputs[0]), true);
  assert.equal(VisualConnectionSystem.canConnectValue(objectValue, variableValueInput), true);
  literalValues.forEach(value => assert.equal(VisualConnectionSystem.canConnectValue(value, variableValueInput), true));
  assert.equal(VisualConnectionSystem.canConnectValue(numberExpression, literalOnlyCommand.inputs[0]), false);
  assert.equal(VisualConnectionSystem.canConnectSequence(numberCommand, numberCommand), true);
  assert.equal(VisualConnectionSystem.canConnectBody(numberCommand, { accepts: VISUAL_BLOCK_KINDS.COMMAND }), true);
});

test('If, If/Else, Else if and While accept literal and object value blocks', () => {
  const source = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
  const conditionTypes = ['if_block', 'if_else_block', 'else_if_block', 'while_block'];
  const variableDefinition = source.split('\n').find(line => line.startsWith('  use_variable:'));
  const variableValue = normalizeVisualDefinition('use_variable', {
    type: 'variables',
    kind: 'VALUE',
    output: VISUAL_TYPES.ANY,
  });
  const valueBlocks = [
    normalizeVisualDefinition('text_value', { type: 'variables', kind: 'VALUE', output: VISUAL_TYPES.TEXT }),
    normalizeVisualDefinition('number_value', { type: 'variables', kind: 'VALUE', output: VISUAL_TYPES.NUMBER }),
    normalizeVisualDefinition('boolean_value', { type: 'variables', kind: 'VALUE', output: VISUAL_TYPES.BOOLEAN }),
    normalizeVisualDefinition('object_reference', { type: 'objects', kind: 'VALUE', output: VISUAL_TYPES.OBJECT }),
    variableValue,
  ];

  assert.ok(variableDefinition);
  assert.match(variableDefinition, /kind:'VALUE',output:'ANY'/);

  conditionTypes.forEach(type => {
    const line = source.split('\n').find(entry => entry.startsWith(`  ${type}:`));
    assert.ok(line, `Missing ${type} definition`);
    assert.match(line, /left:\['Left','any','socket'\]/);
    assert.match(line, /right:\['Right','any','socket'\]/);

    const condition = normalizeVisualDefinition(type, {
      type: 'control',
      propsMeta: {
        left: ['Left', 'any', 'socket'],
        operator: ['Operator', 'operator'],
        right: ['Right', 'any', 'socket'],
      },
      children: true,
    });

    ['left', 'right'].forEach(inputId => {
      const input = condition.inputs.find(item => item.id === inputId);
      valueBlocks.forEach(valueBlock => {
        assert.equal(VisualConnectionSystem.canConnectValue(valueBlock, input), true, `${type}.${inputId} rejects ${valueBlock.output}`);
      });
    });
  });
});

test('Visual block tree represents sequence, value and nested body connections', () => {
  const commandDefinition = normalizeVisualDefinition('move', { type: 'movement' });
  const structureDefinition = normalizeVisualDefinition('repeat', { type: 'control', children: true });
  const expressionDefinition = normalizeVisualDefinition('sum', { type: 'operators', output: VISUAL_TYPES.NUMBER });
  const root = VisualBlockTree.createNode(structureDefinition);
  const command = VisualBlockTree.createNode(commandDefinition);
  const nextCommand = VisualBlockTree.createNode(commandDefinition);
  const expression = VisualBlockTree.createNode(expressionDefinition);

  VisualBlockTree.appendToBody(root, command);
  VisualBlockTree.connectSequence(command, nextCommand);
  VisualBlockTree.connectValue(command, 'amount', expression);

  const found = VisualBlockTree.find([root], nextCommand.id);
  assert.equal(found.node, nextCommand);
  assert.equal(root.children[0], command);
  assert.equal(command.next, nextCommand);
  assert.equal(command.properties.amount, expression);
  assert.equal(VisualBlockTree.count([root]), 4);
});

test('Visual block tree detaches a value without removing its parent block', () => {
  const commandDefinition = normalizeVisualDefinition('move', {
    type: 'movement',
    propsMeta: { amount: ['Amount', 'number', 'socket'] },
  });
  const expressionDefinition = normalizeVisualDefinition('sum', {
    type: 'math',
    output: VISUAL_TYPES.NUMBER,
  });
  const command = VisualBlockTree.createNode(commandDefinition);
  const expression = VisualBlockTree.createNode(expressionDefinition);
  VisualBlockTree.connectValue(command, 'amount', expression);

  assert.equal(VisualBlockTree.detach([command], expression.id), expression);
  assert.equal(command.properties.amount, undefined);
  assert.equal(VisualBlockTree.find([command], expression.id), null);
});

test('Visual block tree keeps nested value blocks discoverable when values are stored in inputs', () => {
  const commandDefinition = normalizeVisualDefinition('move', {
    type: 'movement',
    propsMeta: { amount: ['Amount', 'number', 'socket'] },
  });
  const expressionDefinition = normalizeVisualDefinition('sum', {
    type: 'math',
    output: VISUAL_TYPES.NUMBER,
  });

  const command = VisualBlockTree.createNode(commandDefinition);
  const expression = VisualBlockTree.createNode(expressionDefinition);
  command.properties = {};
  command.inputs.amount = expression;

  const found = VisualBlockTree.find([command], expression.id);
  assert.ok(found);
  assert.equal(found.node, expression);
  assert.equal(found.parent, command);
  assert.equal(found.propertyId, 'amount');
});

test('Visual block tree inserts moved blocks before and after without losing siblings', () => {
  const definition = normalizeVisualDefinition('command', { type: 'movement' });
  const first = VisualBlockTree.createNode(definition);
  const second = VisualBlockTree.createNode(definition);
  const third = VisualBlockTree.createNode(definition);
  const root = [first, second, third];

  const movedBefore = VisualBlockTree.detach(root, third.id);
  assert.equal(VisualBlockTree.insertBefore(root, second.id, movedBefore), true);
  assert.deepEqual(root.map(node => node.id), [first.id, third.id, second.id]);
  assert.equal(VisualBlockTree.insertAfter(root, first.id, VisualBlockTree.detach(root, second.id)), true);
  assert.deepEqual(root.map(node => node.id), [first.id, second.id, third.id]);
});

test('Visual block tree inserts in linked sequences without dropping the tail', () => {
  const definition = normalizeVisualDefinition('command', { type: 'movement' });
  const first = VisualBlockTree.createNode(definition);
  const second = VisualBlockTree.createNode(definition);
  const third = VisualBlockTree.createNode(definition);
  VisualBlockTree.connectSequence(first, second);
  VisualBlockTree.connectSequence(second, third);

  const moved = VisualBlockTree.detach([first], third.id);
  assert.equal(VisualBlockTree.insertBefore([first], second.id, moved), true);
  assert.equal(first.next, third);
  assert.equal(third.next, second);
  assert.equal(second.next, null);
});

test('Visual block tree detaches one linked block without duplicating its tail', () => {
  const definition = normalizeVisualDefinition('command', { type: 'movement' });
  const first = VisualBlockTree.createNode(definition);
  const middle = VisualBlockTree.createNode(definition);
  const last = VisualBlockTree.createNode(definition);
  VisualBlockTree.connectSequence(first, middle);
  VisualBlockTree.connectSequence(middle, last);

  const moved = VisualBlockTree.detach([first], middle.id);
  assert.equal(first.next, last);
  assert.equal(moved.next, null);
  assert.equal(VisualBlockTree.insertBefore([first], first.id, moved), true);
  assert.deepEqual([moved.id, first.id, first.next.id], [middle.id, first.id, last.id]);
  assert.equal(VisualBlockTree.count([moved, first]), 3);
});
