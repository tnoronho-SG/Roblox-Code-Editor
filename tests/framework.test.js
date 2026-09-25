import test from 'node:test';
import assert from 'node:assert/strict';
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
