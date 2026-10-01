import { normalizeVisualCatalog } from './src/core/VisualBlockDefinition.js';
import { VisualConnectionSystem } from './src/core/VisualConnectionSystem.js';
import { VisualBlockTree } from './src/core/VisualBlockTree.js';
import { appendVisualProjectMetadata, normalizeVisualProjectTree, readVisualProjectMetadata } from './src/core/VisualProjectFile.js';
import { formatLuauValue, serializeLuauExpression } from './src/core/LuauExpressionSerializer.js';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { GeneratedCodeDisplay, VisualBlockComponent } from './src/ui/VisualBlockComponents.js';

const categories={
  events:{label:'Events',color:'#F4C542',icon:'⚡'},
  control:{label:'Control',color:'#4A90E2',icon:'↻'},
  operators:{label:'Operators',color:'#43A047',icon:'∑'},
  variables:{label:'Variables',color:'#F28C28',icon:'◆'},
  functions:{label:'Functions',color:'#7E57C2',icon:'ƒ'},
  players:{label:'Players',color:'#EC78B5',icon:'♙'},
  character:{label:'Character / Humanoid',color:'#D32F2F',icon:'♟'},
  objects:{label:'Instance / Objects',color:'#2F80ED',icon:'◈'},
  properties:{label:'Properties',color:'#1976D2',icon:'⚙'},
  methods:{label:'Methods',color:'#6A1B9A',icon:'ƒ'},
  sound:{label:'Sound',color:'#7B1FA2',icon:'🔊'},
  world:{label:'Workspace / World',color:'#2E7D32',icon:'🌎'},
  input:{label:'UserInput / Controls',color:'#1565C0',icon:'🎮'},
  multiplayer:{label:'Multiplayer / RemoteEvents',color:'#00838F',icon:'🌐'},
  admin:{label:'Administration',color:'#8E0000',icon:'👑'},
  debug:{label:'Debug',color:'#455A64',icon:'⌕'},
  teams:{label:'Teams / Leaderstats',color:'#C69214',icon:'🏆'},
  tools:{label:'Backpack / Tools',color:'#795548',icon:'🎒'},
  datastore:{label:'DataStore',color:'#455A64',icon:'💾'},
  services:{label:'Roblox Services',color:'#546E7A',icon:'⚙'},
  advanced:{label:'Advanced / Luau',color:'#C62828',icon:'🔴'}
};
const categoryAliases={logic:'operators',math:'operators',movement:'objects',appearance:'properties',audio:'sound',ui:'properties',teleport:'objects'};
function categoryForType(type){return categoryAliases[type]||type}
Object.entries(categoryAliases).forEach(([legacy, current]) => Object.defineProperty(categories, legacy, {value: categories[current], enumerable: false}));
const definitions={
  player_joined:{type:'events',label:'Player joined',icon:'⚡',template:'game.Players.PlayerAdded:Connect(function(player)',children:true},
  when_game_starts:{type:'events',label:'When game starts',icon:'⚡',template:'game:GetService("RunService").Heartbeat:Connect(function()',children:true},
  when_player_joined:{type:'events',label:'When player joins',icon:'⚡',template:'Players.PlayerAdded:Connect(function(player)',props:{variableName:'player'},propsMeta:{variableName:['Player variable','text']},children:true},
  when_player_left:{type:'events',label:'When player leaves',icon:'⚡',template:'Players.PlayerRemoving:Connect(function(player)',props:{variableName:'player'},propsMeta:{variableName:['Player variable','text']},children:true},
  when_player_died:{type:'events',label:'When player dies',icon:'⚡',template:'player.Character.Humanoid.Died:Connect(function()',props:{player:'player'},propsMeta:{player:['Player','text']},children:true},
  when_character_spawned:{type:'events',label:'When character spawns',icon:'⚡',template:'player.CharacterAdded:Connect(function(character)',props:{character:'player.Character'},propsMeta:{character:['Character','text']},children:true},
  when_game_loaded:{type:'events',label:'When game finishes loading',icon:'⚡',template:'game.Loaded:Connect(function()',children:true},
  when_character_removed:{type:'events',label:'When CharacterRemoving',icon:'⚡',template:'player.CharacterRemoving:Connect(function(character)',props:{character:'player.Character'},propsMeta:{character:['Character','text']},children:true},
  when_child_added:{type:'events',label:'When ChildAdded',icon:'⚡',template:'instance.ChildAdded:Connect(function(child)',props:{instance:'workspace'},propsMeta:{instance:['Instance','text']},children:true},
  when_child_removed:{type:'events',label:'When ChildRemoved',icon:'⚡',template:'instance.ChildRemoved:Connect(function(child)',props:{instance:'workspace'},propsMeta:{instance:['Instance','text']},children:true},
  when_descendant_added:{type:'events',label:'When DescendantAdded',icon:'⚡',template:'instance.DescendantAdded:Connect(function(descendant)',props:{instance:'workspace'},propsMeta:{instance:['Instance','text']},children:true},
  when_descendant_removed:{type:'events',label:'When DescendantRemoving',icon:'⚡',template:'instance.DescendantRemoving:Connect(function(descendant)',props:{instance:'workspace'},propsMeta:{instance:['Instance','text']},children:true},
  when_ancestry_changed:{type:'events',label:'When AncestryChanged',icon:'⚡',template:'instance.AncestryChanged:Connect(function(child, parent)',props:{instance:'workspace'},propsMeta:{instance:['Instance','text']},children:true},
  when_object_touched:{type:'events',label:'When object is touched',icon:'⚡',template:'part.Touched:Connect(function(otherPart)',props:{part:'part'},propsMeta:{part:['Object','text']},children:true},
  when_object_stopped_touching:{type:'events',label:'When object stops being touched',icon:'⚡',template:'part.TouchEnded:Connect(function(otherPart)',props:{part:'part'},propsMeta:{part:['Object','text']},children:true},
  when_mouse_click:{type:'events',label:'When MouseClick',icon:'⚡',template:'clickDetector.MouseClick:Connect(function(player)',props:{clickDetector:'clickDetector'},propsMeta:{clickDetector:['ClickDetector','text']},children:true},
  when_mouse_hover_enter:{type:'events',label:'When MouseHoverEnter',icon:'⚡',template:'clickDetector.MouseHoverEnter:Connect(function(player)',props:{clickDetector:'clickDetector'},propsMeta:{clickDetector:['ClickDetector','text']},children:true},
  when_mouse_hover_leave:{type:'events',label:'When MouseHoverLeave',icon:'⚡',template:'clickDetector.MouseHoverLeave:Connect(function(player)',props:{clickDetector:'clickDetector'},propsMeta:{clickDetector:['ClickDetector','text']},children:true},
  when_proximity_prompt:{type:'events',label:'When ProximityPrompt',icon:'⚡',template:'proximityPrompt.Triggered:Connect(function(player)',props:{proximityPrompt:'proximityPrompt'},propsMeta:{proximityPrompt:['ProximityPrompt','text']},children:true},
  when_button_clicked:{type:'events',label:'When button is clicked',icon:'⚡',template:'button.Activated:Connect(function()',props:{button:'button'},propsMeta:{button:['Button','text']},children:true},
  when_object_activated:{type:'events',label:'When [object] is activated',icon:'⚡',template:'{object}.Activated:Connect(function()',props:{object:''},propsMeta:{object:['Object','object','socket']},children:true},
  when_key_pressed:{type:'events',label:'When key is pressed',icon:'⚡',template:'UserInputService.InputBegan:Connect(function(input, gameProcessedEvent)',props:{inputName:'"E"'},propsMeta:{inputName:['Key','text']},children:true},
  when_key_released:{type:'events',label:'When key is released',icon:'⚡',template:'UserInputService.InputEnded:Connect(function(input, gameProcessedEvent)',props:{inputName:'"E"'},propsMeta:{inputName:['Key','text']},children:true},
  when_input_changed:{type:'events',label:'When InputChanged',icon:'⚡',template:'UserInputService.InputChanged:Connect(function(input, gameProcessed)',children:true},
  when_tool_used:{type:'events',label:'When tool is used',icon:'⚡',template:'tool.Activated:Connect(function()',props:{tool:'tool'},propsMeta:{tool:['Tool','text']},children:true},
  when_animation_finished:{type:'events',label:'When animation finishes',icon:'⚡',template:'animationTrack.Ended:Connect(function()',props:{animationTrack:'animationTrack'},propsMeta:{animationTrack:['Animation','text']},children:true},
  when_sound_finished:{type:'events',label:'When sound finishes',icon:'⚡',template:'sound.Ended:Connect(function()',props:{sound:'sound'},propsMeta:{sound:['Sound','text']},children:true},
  when_remote_event_received:{type:'events',label:'When remote event is received',icon:'⚡',template:'remoteEvent.OnClientEvent:Connect(function(...)',props:{remoteEvent:'remoteEvent'},propsMeta:{remoteEvent:['Remote event','text']},children:true},
  when_variable_changed:{type:'events',label:'When variable changes',icon:'⚡',template:'while true do',props:{variable:'score'},propsMeta:{variable:['Variable','text']},children:true},
  every_second:{type:'events',label:'Every second',icon:'⏱',template:'while true do',props:{seconds:'1'},propsMeta:{seconds:['Seconds','number']},children:true},
  every_frame:{type:'events',label:'Every frame',icon:'▣',template:'RunService.RenderStepped:Connect(function(deltaTime)',children:true},
  when_heartbeat:{type:'events',label:'When Heartbeat',icon:'⚡',template:'RunService.Heartbeat:Connect(function(deltaTime)',children:true},
  when_stepped:{type:'events',label:'When Stepped',icon:'⚡',template:'RunService.Stepped:Connect(function(time, deltaTime)',children:true},
  when_on_server_event:{type:'events',label:'When OnServerEvent',icon:'⚡',template:'remoteEvent.OnServerEvent:Connect(function(player, ...)',props:{remoteEvent:'remoteEvent'},propsMeta:{remoteEvent:['Remote event','text']},children:true},
  when_bindable_event:{type:'events',label:'When BindableEvent.Event',icon:'⚡',template:'bindableEvent.Event:Connect(function(...)',props:{bindableEvent:'bindableEvent'},propsMeta:{bindableEvent:['BindableEvent','text']},children:true},
  when_mouse_button_1_click:{type:'events',label:'When MouseButton1Click',icon:'⚡',template:'button.MouseButton1Click:Connect(function()',props:{button:'button'},propsMeta:{button:['Button','text']},children:true},
  when_mouse_button_1_down:{type:'events',label:'When MouseButton1Down',icon:'⚡',template:'button.MouseButton1Down:Connect(function(player)',props:{button:'button'},propsMeta:{button:['Button','text']},children:true},
  when_mouse_button_1_up:{type:'events',label:'When MouseButton1Up',icon:'⚡',template:'button.MouseButton1Up:Connect(function(player)',props:{button:'button'},propsMeta:{button:['Button','text']},children:true},
  when_mouse_enter:{type:'events',label:'When MouseEnter',icon:'⚡',template:'button.MouseEnter:Connect(function(player)',props:{button:'button'},propsMeta:{button:['Button','text']},children:true},
  when_mouse_leave:{type:'events',label:'When MouseLeave',icon:'⚡',template:'button.MouseLeave:Connect(function(player)',props:{button:'button'},propsMeta:{button:['Button','text']},children:true},
  wait:{type:'control',label:'Wait',icon:'◷',template:'task.wait({seconds})',props:{seconds:'1'},propsMeta:{seconds:['Seconds','number']}},
  if_block:{type:'control',label:'If',icon:'◇',template:'if {left} {operator} {right} then',props:{left:'',operator:'>',right:''},propsMeta:{left:['Left','text','socket'],operator:['Operator','operator'],right:['Right','text','socket']},children:true},
  if_else_block:{type:'control',label:'If / Else',icon:'◇',template:'if {left} {operator} {right} then',props:{left:'',operator:'>',right:''},propsMeta:{left:['Left','text','socket'],operator:['Operator','operator'],right:['Right','text','socket']},children:true},
  else_if_block:{type:'control',label:'Else if',icon:'◇',template:'elseif {left} {operator} {right} then',props:{left:'',operator:'>',right:''},propsMeta:{left:['Left','text','socket'],operator:['Operator','operator'],right:['Right','text','socket']},children:true},
  else_block:{type:'control',label:'Else',icon:'◇',template:'else',children:true},
  while_block:{type:'control',label:'While',icon:'↻',template:'while {left} {operator} {right} do',props:{left:'',operator:'>',right:''},propsMeta:{left:['Left','text','socket'],operator:['Operator','operator'],right:['Right','text','socket']},children:true},
  repeat_block:{type:'control',label:'Repeat',icon:'↻',template:'for _ = 1, {times} do',props:{times:'3'},propsMeta:{times:['Times','number','socket']},children:true},
  for_block:{type:'control',label:'For',icon:'↻',template:'for {variable} = {start}, {finish} do',props:{variable:'i',start:'1',finish:'10'},propsMeta:{variable:['Variable','text'],start:['Start','number','socket'],finish:['Finish','number','socket']},children:true},
  for_each_block:{type:'control',label:'For each',icon:'↻',template:'for {value} in pairs({table}) do',props:{value:'value',table:'items'},propsMeta:{value:['Value','text'],table:['Table','text','socket']},children:true},
  repeat_until_block:{type:'control',label:'Repeat until',icon:'↻',template:'repeat',props:{left:'',operator:'>=',right:''},propsMeta:{left:['Left','text','socket'],operator:['Operator','operator'],right:['Right','text','socket']},children:true},
  wait_until_block:{type:'control',label:'Wait until',icon:'◷',template:'repeat task.wait() until {left} {operator} {right}',props:{left:'',operator:'>=',right:''},propsMeta:{left:['Left','text','socket'],operator:['Operator','operator'],right:['Right','text','socket']}},
  break_block:{type:'control',label:'Break',icon:'■',template:'break'},
  continue_block:{type:'control',label:'Continue',icon:'↪',template:'continue'},
  return_value_block:{type:'control',label:'Return value',icon:'↩',template:'return {value}',props:{value:'value'},propsMeta:{value:['Value','text','socket']}},
  return_block:{type:'control',label:'Return',icon:'↩',template:'return'},
  try_block:{type:'control',label:'Try',icon:'⚠',template:'local ok, errorMessage = pcall(function()',children:true},
  catch_block:{type:'control',label:'Catch',icon:'⚠',template:'if not ok then',children:true},
  finally_block:{type:'control',label:'Finally',icon:'⚠',template:'-- finally',children:true},
  execute_block:{type:'control',label:'Execute code',icon:'▶',template:'{code}',props:{code:'-- code'},propsMeta:{code:['Code','text']}},
  stop_script_block:{type:'control',label:'Stop this script',icon:'■',template:'return'},
  function_block:{type:'functions',label:'Function',icon:'ƒ',template:'function {name}()',props:{name:'myFunction'},propsMeta:{name:['Name','text']},children:true},
  function_one_parameter_block:{type:'functions',label:'Function with parameter',icon:'ƒ',template:'function {name}({parameter})',props:{name:'myFunction',parameter:'value'},propsMeta:{name:['Name','text'],parameter:['Parameter','text']},children:true},
  function_two_parameters_block:{type:'functions',label:'Function with two parameters',icon:'ƒ',template:'function {name}({parameter1}, {parameter2})',props:{name:'myFunction',parameter1:'first',parameter2:'second'},propsMeta:{name:['Name','text'],parameter1:['Parameter 1','text'],parameter2:['Parameter 2','text']},children:true},
  function_return_value_block:{type:'functions',label:'Return value',icon:'↩',template:'return {value}',props:{value:'value'},propsMeta:{value:['Value','text','socket']}},
  function_return_block:{type:'functions',label:'Return',icon:'↩',template:'return'},
  call_function_block:{type:'functions',label:'Call function',icon:'▶',template:'{name}()',props:{name:'myFunction'},propsMeta:{name:['Function','text']}},
  call_function_arguments_block:{type:'functions',label:'Call function with arguments',icon:'▶',template:'{name}({arguments})',props:{name:'myFunction',arguments:'value'},propsMeta:{name:['Function','text'],arguments:['Arguments','text','socket']}},
  create_function_block:{type:'functions',label:'Create function',icon:'ƒ',template:'function {name}()',props:{name:'myFunction'},propsMeta:{name:['Name','text']},children:true},
  add_parameter_block:{type:'functions',label:'Add parameter',icon:'ƒ',template:'-- parameter {name}',props:{name:'value'},propsMeta:{name:['Name','text']}},
  add_return_block:{type:'functions',label:'Add return',icon:'↩',template:'return {value}',props:{value:'value'},propsMeta:{value:['Value','text','socket']}},
  anonymous_function_block:{type:'functions',label:'Anonymous function',icon:'ƒ',template:'function()',children:true},
  anonymous_function_parameters_block:{type:'functions',label:'Anonymous function with parameters',icon:'ƒ',template:'function({parameters})',props:{parameters:'value'},propsMeta:{parameters:['Parameters','text']},children:true},
  local_function_block:{type:'functions',label:'Local function',icon:'ƒ',template:'local function {name}()',props:{name:'myFunction'},propsMeta:{name:['Name','text']},children:true},
  function_returns_block:{type:'functions',label:'Function returns',icon:'↩',template:'return {value}',props:{value:'value'},propsMeta:{value:['Value','text','socket']}},
  function_receives_block:{type:'functions',label:'Function receives',icon:'ƒ',template:'-- receives {parameter}',props:{parameter:'value'},propsMeta:{parameter:['Parameter','text']}},
  set_variable:{type:'variables',label:'Set variable',icon:'◆',template:'{name} = {value}',props:{name:'coins',value:'0'},propsMeta:{name:['Variable','text'],value:['Value','any','socket']}},
  local_set_variable:{type:'variables',label:'Local variable',icon:'◆',template:'local {name} = {value}',props:{name:'coins',value:'0'},propsMeta:{name:['Variable','text'],value:['Value','any','socket']}},
  compound_variable:{type:'variables',label:'Change variable',icon:'◆',template:'{name} {operator}= {value}',props:{name:'coins',operator:'+',value:'1'},operatorOptions:['+','-','*','/','..'],propsMeta:{name:['Variable','text'],operator:['Operator','operator'],value:['Value','text']}},
  create_variable:{type:'variables',label:'Create variable',icon:'◆',template:'local {name} = nil',props:{name:'coins'},propsMeta:{name:['Name','text']}},
  delete_variable:{type:'variables',label:'Delete variable',icon:'◆',template:'{name} = nil',props:{name:'coins'},propsMeta:{name:['Name','text']}},
  use_variable:{type:'variables',label:'Use variable',icon:'◆',template:'{name}',props:{name:'coins'},propsMeta:{name:['Variable','text']}},
  show_variable:{type:'variables',label:'Show variable',icon:'◆',template:'print({name})',props:{name:'coins'},propsMeta:{name:['Variable','text']}},
  print_block:{type:'debug',label:'Print',icon:'⌕',template:'print({value})',props:{value:'"Test message"'},propsMeta:{value:['Value','text','socket']}},
  define_variable:{type:'variables',label:'Define variable',icon:'◆',template:'{name} = {value}',props:{name:'coins',value:'0'},propsMeta:{name:['Variable','text'],value:['Value','text']}},
  change_variable:{type:'variables',label:'Change variable by',icon:'◆',template:'{name} += {value}',props:{name:'coins',value:'1'},propsMeta:{name:['Variable','text'],value:['Value','number','socket']}},
  rename_variable:{type:'variables',label:'Rename variable',icon:'◆',template:'local {newName} = {name}\n{name} = nil',props:{name:'coins',newName:'points'},propsMeta:{name:['Name','text'],newName:['New name','text']}},
  local_variable:{type:'variables',label:'Local variable',icon:'◆',template:'local {name}',props:{name:'coins'},propsMeta:{name:['Variable','text']}},
  global_variable:{type:'variables',label:'Global variable',icon:'◆',template:'_G.{name} = nil',props:{name:'coins'},propsMeta:{name:['Name','text']}},
  nil_variable:{type:'variables',label:'Set variable to nil',icon:'◆',template:'{name} = nil',props:{name:'coins'},propsMeta:{name:['Variable','text']}},
  variable_type:{type:'variables',label:'Variable type',icon:'◆',template:'typeof({name})',props:{name:'coins'},propsMeta:{name:['Variable','text']}},
  text_value:{type:'variables',label:'Text value',icon:'T',template:'{value}',props:{value:'text'},propsMeta:{value:['Text','text']},kind:'VALUE',output:'TEXT'},
  number_value:{type:'variables',label:'Number value',icon:'#',template:'{value}',props:{value:'0'},propsMeta:{value:['Number','number']},kind:'VALUE',output:'NUMBER'},
  boolean_value:{type:'variables',label:'Boolean value',icon:'●',template:'{value}',props:{value:'true'},propsMeta:{value:['Boolean','boolean']},kind:'VALUE',output:'BOOLEAN'},
  comparison_block:{type:'operators',label:'Comparison',icon:'≠',template:'{left} {operator} {right}',props:{left:'score',operator:'>',right:'0'},propsMeta:{left:['Left','text','socket'],operator:['Operator','operator'],right:['Right','text','socket']}},
  and_block:{type:'operators',label:'And',icon:'∧',template:'{left} and {right}',props:{left:'true',right:'true'},propsMeta:{left:['Left','text','socket'],right:['Right','text','socket']}},
  or_block:{type:'operators',label:'Or',icon:'∨',template:'{left} or {right}',props:{left:'false',right:'true'},propsMeta:{left:['Left','text','socket'],right:['Right','text','socket']}},
  not_block:{type:'operators',label:'Not',icon:'¬',template:'not {value}',props:{value:'true'},propsMeta:{value:['Value','text','socket']}},
  arithmetic_block:{type:'operators',label:'Arithmetic',icon:'＋',template:'{left} {operator} {right}',props:{left:'1',operator:'+',right:'1'},operatorOptions:['+','-','*','/','%','^'],propsMeta:{left:['Left','number','socket'],operator:['Operator','operator'],right:['Right','number','socket']}},
  logical_comparison_block:{type:'operators',label:'Comparison',icon:'≠',template:'{left} {operator} {right}',props:{left:'a',operator:'==',right:'b'},operatorOptions:['==','~=','>','<','>=','<='],propsMeta:{left:['Left','text','socket'],operator:['Operator','operator'],right:['Right','text','socket']}},
  logical_operator_block:{type:'operators',label:'Logical operator',icon:'∧',template:'{left} {operator} {right}',props:{left:'true',operator:'and',right:'true'},operatorOptions:['and','or'],propsMeta:{left:['Left','text','socket'],operator:['Operator','operator'],right:['Right','text','socket']}},
  unary_operator_block:{type:'operators',label:'Unary operator',icon:'¬',template:'{operator} {value}',props:{operator:'not',value:'value'},operatorOptions:['not','-'],propsMeta:{operator:['Operator','operator'],value:['Value','text','socket']}},
  typeof_block:{type:'operators',label:'Type of',icon:'τ',template:'typeof({value})',props:{value:'value'},propsMeta:{value:['Value','text','socket']}},
  is_nil_block:{type:'operators',label:'Is nil',icon:'∅',template:'{value} == nil',props:{value:'value'},propsMeta:{value:['Value','text','socket']}},
  is_true_block:{type:'operators',label:'Is true',icon:'✓',template:'{value} == true',props:{value:'value'},propsMeta:{value:['Value','text','socket']}},
  concatenate_block:{type:'operators',label:'Concatenate',icon:'..',template:'{left} .. {right}',props:{left:'a',right:'b'},propsMeta:{left:['Left','text','socket'],right:['Right','text','socket']}},
  length_block:{type:'operators',label:'Length',icon:'#',template:'#{value}',props:{value:'value'},propsMeta:{value:['Value','text','socket']}},
  math_unary_block:{type:'operators',label:'Math function',icon:'ƒ',template:'math.{function}({value})',props:{function:'abs',value:'value'},operatorOptions:['abs','floor','ceil','round','sqrt'],propsMeta:{function:['Function','operator'],value:['Value','number','socket']}},
  math_random_block:{type:'operators',label:'Random',icon:'🎲',template:'math.random()',props:{}},
  math_random_range_block:{type:'operators',label:'Random range',icon:'🎲',template:'math.random({minimum}, {maximum})',props:{minimum:'1',maximum:'10'},propsMeta:{minimum:['Minimum','number','socket'],maximum:['Maximum','number','socket']}},
  math_binary_block:{type:'operators',label:'Math function',icon:'ƒ',template:'math.{function}({left}, {right})',props:{function:'max',left:'a',right:'b'},operatorOptions:['max','min'],propsMeta:{function:['Function','operator'],left:['Left','number','socket'],right:['Right','number','socket']}},
  move_object_to:{type:'movement',label:'Move object to',icon:'✦',template:'{target}:PivotTo(CFrame.new({x}, {y}, {z}))',props:{target:'part',x:'0',y:'5',z:'0'},propsMeta:{target:['Target','text','socket'],x:['X','number','socket'],y:['Y','number','socket'],z:['Z','number','socket']}},
  move_object_by:{type:'movement',label:'Move object by',icon:'✦',template:'{target}:PivotTo({target}:GetPivot() + Vector3.new({x}, {y}, {z}))',props:{target:'part',x:'0',y:'0',z:'5'},propsMeta:{target:['Target','text','socket'],x:['X','number','socket'],y:['Y','number','socket'],z:['Z','number','socket']}},
  walk_steps:{type:'movement',label:'Walk steps',icon:'✦',template:'{target}:PivotTo({target}:GetPivot() + Vector3.new({steps}, 0, 0))',props:{target:'character',steps:'1'},propsMeta:{target:['Target','text','socket'],steps:['Steps','number','socket']}},
  move_part_by:{type:'movement',label:'Move part by',icon:'✦',template:'{target}.Position += Vector3.new({x}, {y}, {z})',props:{target:'part',x:'0',y:'0',z:'5'},propsMeta:{target:['Target','text','socket'],x:['X','number','socket'],y:['Y','number','socket'],z:['Z','number','socket']}},
  teleport_object_to:{type:'movement',label:'Teleport object to',icon:'✦',template:'{target}:PivotTo(CFrame.new({x}, {y}, {z}))',props:{target:'part',x:'0',y:'5',z:'0'},propsMeta:{target:['Target','text','socket'],x:['X','number','socket'],y:['Y','number','socket'],z:['Z','number','socket']}},
  rotate_object_by:{type:'movement',label:'Rotate object by',icon:'✦',template:'{target}.Orientation += Vector3.new({x}, {y}, {z})',props:{target:'part',x:'0',y:'0',z:'90'},propsMeta:{target:['Target','text','socket'],x:['X','number','socket'],y:['Y','number','socket'],z:['Z','number','socket']}},
  point_object_to:{type:'movement',label:'Point object to',icon:'✦',template:'{target}:LookAt({x}, {y}, {z})',props:{target:'part',x:'0',y:'5',z:'0'},propsMeta:{target:['Target','text','socket'],x:['X','number','socket'],y:['Y','number','socket'],z:['Z','number','socket']}},
  look_at:{type:'movement',label:'Look at',icon:'✦',template:'{target}.CFrame = CFrame.lookAt({target}.Position, Vector3.new({x}, {y}, {z}))',props:{target:'part',x:'0',y:'5',z:'0'},propsMeta:{target:['Target','text','socket'],x:['X','number','socket'],y:['Y','number','socket'],z:['Z','number','socket']}},
  follow:{type:'movement',label:'Follow',icon:'✦',template:'{target}.CFrame = {target}.CFrame:Lerp(CFrame.new({x}, {y}, {z}), 0.1)',props:{target:'part',x:'0',y:'5',z:'0'},propsMeta:{target:['Target','text','socket'],x:['X','number','socket'],y:['Y','number','socket'],z:['Z','number','socket']}},
  push:{type:'movement',label:'Push',icon:'✦',template:'{target}.Velocity += Vector3.new({x}, {y}, {z})',props:{target:'part',x:'0',y:'0',z:'10'},propsMeta:{target:['Target','text','socket'],x:['X','number','socket'],y:['Y','number','socket'],z:['Z','number','socket']}},
  apply_velocity:{type:'movement',label:'Apply velocity',icon:'✦',template:'{target}.Velocity = Vector3.new({x}, {y}, {z})',props:{target:'part',x:'0',y:'0',z:'10'},propsMeta:{target:['Target','text','socket'],x:['X','number','socket'],y:['Y','number','socket'],z:['Z','number','socket']}},
  stop_motion:{type:'movement',label:'Stop movement',icon:'✦',template:'{target}.Velocity = Vector3.zero\n{target}.AngularVelocity = Vector3.zero',props:{target:'part'},propsMeta:{target:['Target','text','socket']}},
  set_color:{type:'appearance',label:'Set color',icon:'◉',template:'{target}.Color = Color3.fromRGB({r}, {g}, {b})',props:{target:'part',r:'255',g:'255',b:'255'},propsMeta:{target:['Target','text','socket'],r:['R','number','socket'],g:['G','number','socket'],b:['B','number','socket']}},
  set_property:{type:'objects',label:'Set property',icon:'◈',template:'{target}.{property} = {value}',props:{target:'part',property:'Transparency',value:'0.5'},propsMeta:{target:['Target','text','socket'],property:['Property','text'],value:['Value','text','socket']}},
  method_call:{type:'methods',label:'[objeto]:[método]()',icon:'ƒ',template:'{object}:{method}()',props:{object:'workspace',method:'GetChildren'},propsMeta:{object:['Object','text','socket'],method:['Method','text']}},
  method_call_with_arg:{type:'methods',label:'[objeto]:[método]([argumento])',icon:'ƒ',template:'{object}:{method}({arg})',props:{object:'workspace',method:'FindFirstChild',arg:'"Part"'},propsMeta:{object:['Object','text','socket'],method:['Method','text'],arg:['Argument','text','socket']}},
  method_call_with_args:{type:'methods',label:'[objeto]:[método]([argumento1], [argumento2])',icon:'ƒ',template:'{object}:{method}({arg1}, {arg2})',props:{object:'workspace',method:'FindFirstChild',arg1:'"Part"',arg2:'true'},propsMeta:{object:['Object','text','socket'],method:['Method','text'],arg1:['Argument 1','text','socket'],arg2:['Argument 2','text','socket']}},
  method_call_result:{type:'methods',label:'local [resultado] = [objeto]:[método]()',icon:'ƒ',template:'local {result} = {object}:{method}()',props:{result:'children',object:'workspace',method:'GetChildren'},propsMeta:{result:['Result','text'],object:['Object','text','socket'],method:['Method','text']}},
  method_call_result_args:{type:'methods',label:'local [resultado] = [objeto]:[método]([argumentos])',icon:'ƒ',template:'local {result} = {object}:{method}({args})',props:{result:'child',object:'workspace',method:'FindFirstChild',args:'"Part"'},propsMeta:{result:['Result','text'],object:['Object','text','socket'],method:['Method','text'],args:['Arguments','text','socket']}},
  method_call_alias:{type:'methods',label:'chamar método [objeto] → [método]()',icon:'ƒ',template:'{object}:{method}()',props:{object:'workspace',method:'GetChildren'},propsMeta:{object:['Object','text','socket'],method:['Method','text']}},
  method_call_alias_args:{type:'methods',label:'chamar método [objeto] → [método]([argumentos])',icon:'ƒ',template:'{object}:{method}({args})',props:{object:'workspace',method:'FindFirstChild',args:'"Part"'},propsMeta:{object:['Object','text','socket'],method:['Method','text'],args:['Arguments','text','socket']}},
  method_exists_check:{type:'methods',label:'verificar se método [objeto]:[método] existe',icon:'ƒ',template:'{object}["{method}"] ~= nil',props:{object:'workspace',method:'GetChildren'},propsMeta:{object:['Object','text','socket'],method:['Method','text']}},
  method_return_value:{type:'methods',label:'retorno de [objeto]:[método]()',icon:'↩',template:'return {object}:{method}()',props:{object:'workspace',method:'GetChildren'},propsMeta:{object:['Object','text','socket'],method:['Method','text']}},
  method_return_value_args:{type:'methods',label:'retorno de [objeto]:[método]([argumentos])',icon:'↩',template:'return {object}:{method}({args})',props:{object:'workspace',method:'FindFirstChild',args:'"Part"'},propsMeta:{object:['Object','text','socket'],method:['Method','text'],args:['Arguments','text','socket']}},
  property_get:{type:'properties',label:'[objeto].[propriedade]',icon:'⚙',template:'{object}.{property}',props:{object:'workspace',property:'Name'},propsMeta:{object:['Object','text','socket'],property:['Property','text']}},
  property_set:{type:'properties',label:'[objeto].[propriedade] = [valor]',icon:'⚙',template:'{object}.{property} = {value}',props:{object:'workspace',property:'Name',value:'"Novo"'},propsMeta:{object:['Object','text','socket'],property:['Property','text'],value:['Value','text','socket']}},
  local_property_get:{type:'properties',label:'local [variável] = [objeto].[propriedade]',icon:'⚙',template:'local {variable} = {object}.{property}',props:{variable:'name',object:'workspace',property:'Name'},propsMeta:{variable:['Variable','text'],object:['Object','text','socket'],property:['Property','text']}},
  property_add_assign:{type:'properties',label:'[objeto].[propriedade] += [valor]',icon:'⚙',template:'{object}.{property} += {value}',props:{object:'workspace',property:'Transparency',value:'0.1'},propsMeta:{object:['Object','text','socket'],property:['Property','text'],value:['Value','number','socket']}},
  property_sub_assign:{type:'properties',label:'[objeto].[propriedade] -= [valor]',icon:'⚙',template:'{object}.{property} -= {value}',props:{object:'workspace',property:'Transparency',value:'0.1'},propsMeta:{object:['Object','text','socket'],property:['Property','text'],value:['Value','number','socket']}},
  property_mul_assign:{type:'properties',label:'[objeto].[propriedade] *= [valor]',icon:'⚙',template:'{object}.{property} *= {value}',props:{object:'workspace',property:'Transparency',value:'2'},propsMeta:{object:['Object','text','socket'],property:['Property','text'],value:['Value','number','socket']}},
  property_div_assign:{type:'properties',label:'[objeto].[propriedade] /= [valor]',icon:'⚙',template:'{object}.{property} /= {value}',props:{object:'workspace',property:'Transparency',value:'2'},propsMeta:{object:['Object','text','socket'],property:['Property','text'],value:['Value','number','socket']}},
  property_get_alias:{type:'properties',label:'obter propriedade [objeto] → [propriedade]',icon:'⚙',template:'{object}.{property}',props:{object:'workspace',property:'Name'},propsMeta:{object:['Object','text','socket'],property:['Property','text']}},
  property_set_alias:{type:'properties',label:'definir propriedade [objeto] → [propriedade] = [valor]',icon:'⚙',template:'{object}.{property} = {value}',props:{object:'workspace',property:'Name',value:'"Novo"'},propsMeta:{object:['Object','text','socket'],property:['Property','text'],value:['Value','text','socket']}},
  property_changed_event:{type:'properties',label:'quando [objeto].[propriedade] mudar',icon:'⚡',template:'{object}.{property}Changed:Connect(function()',props:{object:'workspace',property:'Name'},propsMeta:{object:['Object','text','socket'],property:['Property','text']},children:true},
  property_changed_signal:{type:'properties',label:'[objeto]:GetPropertyChangedSignal([propriedade])',icon:'⚙',template:'{object}:GetPropertyChangedSignal({property})',props:{object:'workspace',property:'"Name"'},propsMeta:{object:['Object','text','socket'],property:['Property','text']}},
  property_check:{type:'properties',label:'verificar [objeto].[propriedade]',icon:'⚙',template:'{object}.{property}',props:{object:'workspace',property:'Name'},propsMeta:{object:['Object','text','socket'],property:['Property','text']}},
  property_type:{type:'properties',label:'tipo de [objeto].[propriedade]',icon:'⚙',template:'typeof({object}.{property})',props:{object:'workspace',property:'Name'},propsMeta:{object:['Object','text','socket'],property:['Property','text']}},
  attribute_get:{type:'properties',label:'atributo [objeto] → [nome]',icon:'⚙',template:'{object}:GetAttribute({name})',props:{object:'workspace',name:'"Score"'},propsMeta:{object:['Object','text','socket'],name:['Attribute name','text']}},
  attribute_set:{type:'properties',label:'definir atributo [objeto] → [nome] = [valor]',icon:'⚙',template:'{object}:SetAttribute({name}, {value})',props:{object:'workspace',name:'"Score"',value:'10'},propsMeta:{object:['Object','text','socket'],name:['Attribute name','text'],value:['Value','text','socket']}},
  attribute_get_value:{type:'properties',label:'obter atributo [objeto] → [nome]',icon:'⚙',template:'{object}:GetAttribute({name})',props:{object:'workspace',name:'"Score"'},propsMeta:{object:['Object','text','socket'],name:['Attribute name','text']}},
  attribute_remove:{type:'properties',label:'remover atributo [objeto] → [nome]',icon:'⚙',template:'{object}:RemoveAttribute({name})',props:{object:'workspace',name:'"Score"'},propsMeta:{object:['Object','text','socket'],name:['Attribute name','text']}},
  game_ref:{type:'objects',label:'game',icon:'◈',template:'game'},
  workspace_ref:{type:'objects',label:'workspace',icon:'◈',template:'workspace'},
  object_reference:{type:'objects',label:'Object',icon:'◈',template:'{object}',props:{object:'workspace'},propsMeta:{object:['Object','text']},kind:'VALUE',output:'OBJECT'},
  object_name:{type:'objects',label:'[objeto].Name',icon:'◈',template:'{object}.Name',props:{object:'workspace'},propsMeta:{object:['Object','text','socket']}},
  object_parent:{type:'objects',label:'[objeto].Parent',icon:'◈',template:'{object}.Parent',props:{object:'workspace'},propsMeta:{object:['Object','text','socket']}},
  object_class_name:{type:'objects',label:'[objeto].ClassName',icon:'◈',template:'{object}.ClassName',props:{object:'workspace'},propsMeta:{object:['Object','text','socket']}},
  object_archivable:{type:'objects',label:'[objeto].Archivable',icon:'◈',template:'{object}.Archivable',props:{object:'workspace'},propsMeta:{object:['Object','text','socket']}},
  object_child_added:{type:'objects',label:'[objeto].ChildAdded',icon:'⚡',template:'{object}.ChildAdded',props:{object:'workspace'},propsMeta:{object:['Object','text','socket']},children:true},
  object_child_removed:{type:'objects',label:'[objeto].ChildRemoved',icon:'⚡',template:'{object}.ChildRemoved',props:{object:'workspace'},propsMeta:{object:['Object','text','socket']},children:true},
  object_descendant_added:{type:'objects',label:'[objeto].DescendantAdded',icon:'⚡',template:'{object}.DescendantAdded',props:{object:'workspace'},propsMeta:{object:['Object','text','socket']},children:true},
  object_descendant_removing:{type:'objects',label:'[objeto].DescendantRemoving',icon:'⚡',template:'{object}.DescendantRemoving',props:{object:'workspace'},propsMeta:{object:['Object','text','socket']},children:true},
  object_ancestry_changed:{type:'objects',label:'[objeto].AncestryChanged',icon:'⚡',template:'{object}.AncestryChanged',props:{object:'workspace'},propsMeta:{object:['Object','text','socket']},children:true},
  object_find_first_child:{type:'objects',label:'[objeto]:FindFirstChild([nome])',icon:'◈',template:'{object}:FindFirstChild({name})',props:{object:'workspace',name:'"Part"'},propsMeta:{object:['Object','text','socket'],name:['Name','text']}},
  object_find_first_child_recursive:{type:'objects',label:'[objeto]:FindFirstChild([nome], [recursive])',icon:'◈',template:'{object}:FindFirstChild({name}, {recursive})',props:{object:'workspace',name:'"Part"',recursive:'true'},propsMeta:{object:['Object','text','socket'],name:['Name','text'],recursive:['Recursive','boolean']}},
  object_wait_for_child:{type:'objects',label:'[objeto]:WaitForChild([nome])',icon:'◈',template:'{object}:WaitForChild({name})',props:{object:'workspace',name:'"Part"'},propsMeta:{object:['Object','text','socket'],name:['Name','text']}},
  object_find_first_child_of_class:{type:'objects',label:'[objeto]:FindFirstChildOfClass([classe])',icon:'◈',template:'{object}:FindFirstChildOfClass({className})',props:{object:'workspace',className:'"Part"'},propsMeta:{object:['Object','text','socket'],className:['Class name','text']}},
  object_find_first_child_which_is_a:{type:'objects',label:'[objeto]:FindFirstChildWhichIsA([classe])',icon:'◈',template:'{object}:FindFirstChildWhichIsA({className})',props:{object:'workspace',className:'"BasePart"'},propsMeta:{object:['Object','text','socket'],className:['Class name','text']}},
  object_get_children:{type:'objects',label:'[objeto]:GetChildren()',icon:'◈',template:'{object}:GetChildren()',props:{object:'workspace'},propsMeta:{object:['Object','text','socket']}},
  object_get_descendants:{type:'objects',label:'[objeto]:GetDescendants()',icon:'◈',template:'{object}:GetDescendants()',props:{object:'workspace'},propsMeta:{object:['Object','text','socket']}},
  object_is_a:{type:'objects',label:'[objeto]:IsA([classe])',icon:'◈',template:'{object}:IsA({className})',props:{object:'workspace',className:'"Instance"'},propsMeta:{object:['Object','text','socket'],className:['Class name','text']}},
  object_is_descendant_of:{type:'objects',label:'[objeto]:IsDescendantOf([ancestral])',icon:'◈',template:'{object}:IsDescendantOf({ancestor})',props:{object:'workspace',ancestor:'workspace'},propsMeta:{object:['Object','text','socket'],ancestor:['Ancestor','text','socket']}},
  object_get_full_name:{type:'objects',label:'[objeto]:GetFullName()',icon:'◈',template:'{object}:GetFullName()',props:{object:'workspace'},propsMeta:{object:['Object','text','socket']}},
  object_clone:{type:'objects',label:'[objeto]:Clone()',icon:'◈',template:'{object}:Clone()',props:{object:'workspace'},propsMeta:{object:['Object','text','socket']}},
  object_destroy:{type:'objects',label:'[objeto]:Destroy()',icon:'◈',template:'{object}:Destroy()',props:{object:'workspace'},propsMeta:{object:['Object','text','socket']}},
  object_clear_all_children:{type:'objects',label:'[objeto]:ClearAllChildren()',icon:'◈',template:'{object}:ClearAllChildren()',props:{object:'workspace'},propsMeta:{object:['Object','text','socket']}},
  object_remove:{type:'objects',label:'[objeto]:Remove()',icon:'◈',template:'{object}:Remove()',props:{object:'workspace'},propsMeta:{object:['Object','text','socket']}},
  object_get_attribute:{type:'objects',label:'[objeto]:GetAttribute([nome])',icon:'◈',template:'{object}:GetAttribute({name})',props:{object:'workspace',name:'"Score"'},propsMeta:{object:['Object','text','socket'],name:['Attribute name','text']}},
  object_set_attribute:{type:'objects',label:'[objeto]:SetAttribute([nome], [valor])',icon:'◈',template:'{object}:SetAttribute({name}, {value})',props:{object:'workspace',name:'"Score"',value:'10'},propsMeta:{object:['Object','text','socket'],name:['Attribute name','text'],value:['Value','text','socket']}},
  object_get_attributes:{type:'objects',label:'[objeto]:GetAttributes()',icon:'◈',template:'{object}:GetAttributes()',props:{object:'workspace'},propsMeta:{object:['Object','text','socket']}},
  object_get_property_changed_signal:{type:'objects',label:'[objeto]:GetPropertyChangedSignal([propriedade])',icon:'◈',template:'{object}:GetPropertyChangedSignal({property})',props:{object:'workspace',property:'"Position"'},propsMeta:{object:['Object','text','socket'],property:['Property','text']}},
  object_is_property_modified:{type:'objects',label:'[objeto]:IsPropertyModified([propriedade])',icon:'◈',template:'{object}:IsPropertyModified({property})',props:{object:'workspace',property:'"Position"'},propsMeta:{object:['Object','text','socket'],property:['Property','text']}},
  object_set_network_owner:{type:'objects',label:'[objeto]:SetNetworkOwner([player])',icon:'◈',template:'{object}:SetNetworkOwner({player})',props:{object:'workspace',player:'player'},propsMeta:{object:['Object','text','socket'],player:['Player','text','socket']}},
  object_get_network_owner:{type:'objects',label:'[objeto]:GetNetworkOwner()',icon:'◈',template:'{object}:GetNetworkOwner()',props:{object:'workspace'},propsMeta:{object:['Object','text','socket']}},
  instance_new:{type:'objects',label:'Instance.new([classe])',icon:'◈',template:'Instance.new({className})',props:{className:'"Part"'},propsMeta:{className:['Class name','text']}},
  instance_new_with_parent:{type:'objects',label:'Instance.new([classe], [parent])',icon:'◈',template:'Instance.new({className}, {parent})',props:{className:'"Part"',parent:'workspace'},propsMeta:{className:['Class name','text'],parent:['Parent','text','socket']}},
  game_get_service:{type:'objects',label:'game:GetService([serviço])',icon:'◈',template:'game:GetService({service})',props:{service:'"RunService"'},propsMeta:{service:['Service','text']}},
  game_get_children:{type:'objects',label:'game:GetChildren()',icon:'◈',template:'game:GetChildren()'},
  game_get_descendants:{type:'objects',label:'game:GetDescendants()',icon:'◈',template:'game:GetDescendants()'},
  game_is_loaded:{type:'objects',label:'game:IsLoaded()',icon:'◈',template:'game:IsLoaded()'},
  game_loaded:{type:'objects',label:'game.Loaded',icon:'⚡',template:'game.Loaded',children:true},
  workspace_current_camera:{type:'objects',label:'workspace.CurrentCamera',icon:'◈',template:'workspace.CurrentCamera'},
  world_workspace:{type:'world',label:'workspace',icon:'🌎',template:'workspace'},
  world_current_camera:{type:'world',label:'workspace.CurrentCamera',icon:'🌎',template:'workspace.CurrentCamera'},
  world_gravity:{type:'world',label:'workspace.Gravity',icon:'🌎',template:'workspace.Gravity'},
  world_fallen_parts_destroy_height:{type:'world',label:'workspace.FallenPartsDestroyHeight',icon:'🌎',template:'workspace.FallenPartsDestroyHeight'},
  world_streaming_enabled:{type:'world',label:'workspace.StreamingEnabled',icon:'🌎',template:'workspace.StreamingEnabled'},
  world_streaming_min_radius:{type:'world',label:'workspace.StreamingMinRadius',icon:'🌎',template:'workspace.StreamingMinRadius'},
  world_streaming_target_radius:{type:'world',label:'workspace.StreamingTargetRadius',icon:'🌎',template:'workspace.StreamingTargetRadius'},
  world_get_part_bounds_in_box:{type:'world',label:'workspace:GetPartBoundsInBox([cframe], [size])',icon:'🌎',template:'workspace:GetPartBoundsInBox({cframe}, {size})',props:{cframe:'CFrame.new()',size:'Vector3.new(10, 10, 10)'},propsMeta:{cframe:['CFrame','text','socket'],size:['Size','text','socket']}},
  world_get_part_bounds_in_radius:{type:'world',label:'workspace:GetPartBoundsInRadius([position], [radius])',icon:'🌎',template:'workspace:GetPartBoundsInRadius({position}, {radius})',props:{position:'Vector3.zero',radius:'10'},propsMeta:{position:['Position','text','socket'],radius:['Radius','number','socket']}},
  world_get_parts_in_part:{type:'world',label:'workspace:GetPartsInPart([part])',icon:'🌎',template:'workspace:GetPartsInPart({part})',props:{part:'part'},propsMeta:{part:['Part','text','socket']}},
  world_raycast:{type:'world',label:'workspace:Raycast([origem], [direção])',icon:'🌎',template:'workspace:Raycast({origin}, {direction})',props:{origin:'Vector3.zero',direction:'Vector3.new(0, -100, 0)'},propsMeta:{origin:['Origin','text','socket'],direction:['Direction','text','socket']}},
  world_find_first_child:{type:'world',label:'workspace:FindFirstChild([nome])',icon:'🌎',template:'workspace:FindFirstChild({name})',props:{name:'"Part"'},propsMeta:{name:['Name','text','socket']}},
  world_wait_for_child:{type:'world',label:'workspace:WaitForChild([nome])',icon:'🌎',template:'workspace:WaitForChild({name})',props:{name:'"Part"'},propsMeta:{name:['Name','text','socket']}},
  world_get_children:{type:'world',label:'workspace:GetChildren()',icon:'🌎',template:'workspace:GetChildren()'},
  world_get_descendants:{type:'world',label:'workspace:GetDescendants()',icon:'🌎',template:'workspace:GetDescendants()'},
  world_child_added:{type:'world',label:'workspace.ChildAdded',icon:'⚡',template:'workspace.ChildAdded',children:true},
  world_child_removed:{type:'world',label:'workspace.ChildRemoved',icon:'⚡',template:'workspace.ChildRemoved',children:true},
  world_descendant_added:{type:'world',label:'workspace.DescendantAdded',icon:'⚡',template:'workspace.DescendantAdded',children:true},
  world_descendant_removing:{type:'world',label:'workspace.DescendantRemoving',icon:'⚡',template:'workspace.DescendantRemoving',children:true},
  world_object_position:{type:'world',label:'[objeto].Position',icon:'🌎',template:'{object}.Position',props:{object:'part'},propsMeta:{object:['Object','text','socket']}},
  world_object_cframe:{type:'world',label:'[objeto].CFrame',icon:'🌎',template:'{object}.CFrame',props:{object:'part'},propsMeta:{object:['Object','text','socket']}},
  world_object_orientation:{type:'world',label:'[objeto].Orientation',icon:'🌎',template:'{object}.Orientation',props:{object:'part'},propsMeta:{object:['Object','text','socket']}},
  world_object_size:{type:'world',label:'[objeto].Size',icon:'🌎',template:'{object}.Size',props:{object:'part'},propsMeta:{object:['Object','text','socket']}},
  world_object_pivot_offset:{type:'world',label:'[objeto].PivotOffset',icon:'🌎',template:'{object}.PivotOffset',props:{object:'part'},propsMeta:{object:['Object','text','socket']}},
  world_object_pivot_to:{type:'world',label:'[objeto]:PivotTo([CFrame])',icon:'🌎',template:'{object}:PivotTo({cframe})',props:{object:'part',cframe:'CFrame.new()'},propsMeta:{object:['Object','text','socket'],cframe:['CFrame','text','socket']}},
  world_object_get_pivot:{type:'world',label:'[objeto]:GetPivot()',icon:'🌎',template:'{object}:GetPivot()',props:{object:'part'},propsMeta:{object:['Object','text','socket']}},
  world_object_get_bounding_box:{type:'world',label:'[objeto]:GetBoundingBox()',icon:'🌎',template:'{object}:GetBoundingBox()',props:{object:'part'},propsMeta:{object:['Object','text','socket']}},
  world_object_get_extents_size:{type:'world',label:'[objeto]:GetExtentsSize()',icon:'🌎',template:'{object}:GetExtentsSize()',props:{object:'part'},propsMeta:{object:['Object','text','socket']}},
  world_terrain:{type:'world',label:'workspace.Terrain',icon:'🌎',template:'workspace.Terrain'},
  world_terrain_water_color:{type:'world',label:'workspace.Terrain.WaterColor',icon:'🌎',template:'workspace.Terrain.WaterColor'},
  world_terrain_water_transparency:{type:'world',label:'workspace.Terrain.WaterTransparency',icon:'🌎',template:'workspace.Terrain.WaterTransparency'},
  world_terrain_water_wave_size:{type:'world',label:'workspace.Terrain.WaterWaveSize',icon:'🌎',template:'workspace.Terrain.WaterWaveSize'},
  world_terrain_water_wave_speed:{type:'world',label:'workspace.Terrain.WaterWaveSpeed',icon:'🌎',template:'workspace.Terrain.WaterWaveSpeed'},
  sound_play:{type:'sound',label:'[sound]:Play()',icon:'🔊',template:'{sound}:Play()',props:{sound:'sound'},propsMeta:{sound:['Sound','text','socket']}},
  sound_stop:{type:'sound',label:'[sound]:Stop()',icon:'🔊',template:'{sound}:Stop()',props:{sound:'sound'},propsMeta:{sound:['Sound','text','socket']}},
  sound_pause:{type:'sound',label:'[sound]:Pause()',icon:'🔊',template:'{sound}:Pause()',props:{sound:'sound'},propsMeta:{sound:['Sound','text','socket']}},
  sound_resume:{type:'sound',label:'[sound]:Resume()',icon:'🔊',template:'{sound}:Resume()',props:{sound:'sound'},propsMeta:{sound:['Sound','text','socket']}},
  sound_playing:{type:'sound',label:'[sound].Playing',icon:'🔊',template:'{sound}.Playing',props:{sound:'sound'},propsMeta:{sound:['Sound','text','socket']}},
  sound_volume:{type:'sound',label:'[sound].Volume',icon:'🔊',template:'{sound}.Volume',props:{sound:'sound'},propsMeta:{sound:['Sound','text','socket']}},
  sound_playback_speed:{type:'sound',label:'[sound].PlaybackSpeed',icon:'🔊',template:'{sound}.PlaybackSpeed',props:{sound:'sound'},propsMeta:{sound:['Sound','text','socket']}},
  sound_time_position:{type:'sound',label:'[sound].TimePosition',icon:'🔊',template:'{sound}.TimePosition',props:{sound:'sound'},propsMeta:{sound:['Sound','text','socket']}},
  sound_time_length:{type:'sound',label:'[sound].TimeLength',icon:'🔊',template:'{sound}.TimeLength',props:{sound:'sound'},propsMeta:{sound:['Sound','text','socket']}},
  sound_looped:{type:'sound',label:'[sound].Looped',icon:'🔊',template:'{sound}.Looped',props:{sound:'sound'},propsMeta:{sound:['Sound','text','socket']}},
  sound_sound_id:{type:'sound',label:'[sound].SoundId',icon:'🔊',template:'{sound}.SoundId',props:{sound:'sound'},propsMeta:{sound:['Sound','text','socket']}},
  sound_rolloff_max_distance:{type:'sound',label:'[sound].RollOffMaxDistance',icon:'🔊',template:'{sound}.RollOffMaxDistance',props:{sound:'sound'},propsMeta:{sound:['Sound','text','socket']}},
  sound_rolloff_min_distance:{type:'sound',label:'[sound].RollOffMinDistance',icon:'🔊',template:'{sound}.RollOffMinDistance',props:{sound:'sound'},propsMeta:{sound:['Sound','text','socket']}},
  sound_rolloff_mode:{type:'sound',label:'[sound].RollOffMode',icon:'🔊',template:'{sound}.RollOffMode',props:{sound:'sound'},propsMeta:{sound:['Sound','text','socket']}},
  sound_clone:{type:'sound',label:'[sound]:Clone()',icon:'🔊',template:'{sound}:Clone()',props:{sound:'sound'},propsMeta:{sound:['Sound','text','socket']}},
  sound_destroy:{type:'sound',label:'[sound]:Destroy()',icon:'🔊',template:'{sound}:Destroy()',props:{sound:'sound'},propsMeta:{sound:['Sound','text','socket']}},
  sound_ended:{type:'sound',label:'[sound].Ended',icon:'⚡',template:'{sound}.Ended',props:{sound:'sound'},propsMeta:{sound:['Sound','text','socket']},children:true},
  sound_loaded:{type:'sound',label:'[sound].Loaded',icon:'⚡',template:'{sound}.Loaded',props:{sound:'sound'},propsMeta:{sound:['Sound','text','socket']},children:true},
  sound_did_loop:{type:'sound',label:'[sound].DidLoop',icon:'⚡',template:'{sound}.DidLoop',props:{sound:'sound'},propsMeta:{sound:['Sound','text','socket']},children:true},
  sound_service:{type:'sound',label:'SoundService',icon:'🔊',template:'game:GetService("SoundService")'},
  sound_service_play_local_sound:{type:'sound',label:'SoundService:PlayLocalSound([sound])',icon:'🔊',template:'game:GetService("SoundService"):PlayLocalSound({sound})',props:{sound:'sound'},propsMeta:{sound:['Sound','text','socket']}},
  sound_service_ambient_reverb:{type:'sound',label:'SoundService.AmbientReverb',icon:'🔊',template:'game:GetService("SoundService").AmbientReverb'},
  sound_service_volume:{type:'sound',label:'SoundService.Volume',icon:'🔊',template:'game:GetService("SoundService").Volume'},
  sound_service_respect_filtering_enabled:{type:'sound',label:'SoundService.RespectFilteringEnabled',icon:'🔊',template:'game:GetService("SoundService").RespectFilteringEnabled'},
  set_walk_speed:{type:'character',label:'Set walk speed',icon:'◍',template:'{character}:FindFirstChildOfClass("Humanoid").WalkSpeed = {speed}',props:{character:'player.Character',speed:'16'},propsMeta:{character:['Character','text','socket'],speed:['Speed','number','socket']}},
  character_humanoid:{type:'character',label:'[character].Humanoid',icon:'◍',template:'{character}.Humanoid',props:{character:'player.Character'},propsMeta:{character:['Character','text','socket']}},
  character_humanoid_root_part:{type:'character',label:'[character].HumanoidRootPart',icon:'◍',template:'{character}.HumanoidRootPart',props:{character:'player.Character'},propsMeta:{character:['Character','text','socket']}},
  character_head:{type:'character',label:'[character].Head',icon:'◍',template:'{character}.Head',props:{character:'player.Character'},propsMeta:{character:['Character','text','socket']}},
  character_primary_part:{type:'character',label:'[character].PrimaryPart',icon:'◍',template:'{character}.PrimaryPart',props:{character:'player.Character'},propsMeta:{character:['Character','text','socket']}},
  character_name:{type:'character',label:'[character].Name',icon:'◍',template:'{character}.Name',props:{character:'player.Character'},propsMeta:{character:['Character','text','socket']}},
  character_parent:{type:'character',label:'[character].Parent',icon:'◍',template:'{character}.Parent',props:{character:'player.Character'},propsMeta:{character:['Character','text','socket']}},
  character_find_first_child:{type:'character',label:'[character]:FindFirstChild([nome])',icon:'◍',template:'{character}:FindFirstChild({name})',props:{character:'player.Character',name:'"Head"'},propsMeta:{character:['Character','text','socket'],name:['Name','text']}},
  character_wait_for_child:{type:'character',label:'[character]:WaitForChild([nome])',icon:'◍',template:'{character}:WaitForChild({name})',props:{character:'player.Character',name:'"Humanoid"'},propsMeta:{character:['Character','text','socket'],name:['Name','text']}},
  humanoid_health:{type:'character',label:'[humanoid].Health',icon:'◍',template:'{humanoid}.Health',props:{humanoid:'player.Character:FindFirstChildOfClass("Humanoid")'},propsMeta:{humanoid:['Humanoid','text','socket']}},
  humanoid_max_health:{type:'character',label:'[humanoid].MaxHealth',icon:'◍',template:'{humanoid}.MaxHealth',props:{humanoid:'player.Character:FindFirstChildOfClass("Humanoid")'},propsMeta:{humanoid:['Humanoid','text','socket']}},
  humanoid_walk_speed:{type:'character',label:'[humanoid].WalkSpeed',icon:'◍',template:'{humanoid}.WalkSpeed',props:{humanoid:'player.Character:FindFirstChildOfClass("Humanoid")'},propsMeta:{humanoid:['Humanoid','text','socket']}},
  humanoid_jump_power:{type:'character',label:'[humanoid].JumpPower',icon:'◍',template:'{humanoid}.JumpPower',props:{humanoid:'player.Character:FindFirstChildOfClass("Humanoid")'},propsMeta:{humanoid:['Humanoid','text','socket']}},
  humanoid_jump_height:{type:'character',label:'[humanoid].JumpHeight',icon:'◍',template:'{humanoid}.JumpHeight',props:{humanoid:'player.Character:FindFirstChildOfClass("Humanoid")'},propsMeta:{humanoid:['Humanoid','text','socket']}},
  humanoid_auto_rotate:{type:'character',label:'[humanoid].AutoRotate',icon:'◍',template:'{humanoid}.AutoRotate',props:{humanoid:'player.Character:FindFirstChildOfClass("Humanoid")'},propsMeta:{humanoid:['Humanoid','text','socket']}},
  humanoid_sit:{type:'character',label:'[humanoid].Sit',icon:'◍',template:'{humanoid}.Sit',props:{humanoid:'player.Character:FindFirstChildOfClass("Humanoid")'},propsMeta:{humanoid:['Humanoid','text','socket']}},
  humanoid_platform_stand:{type:'character',label:'[humanoid].PlatformStand',icon:'◍',template:'{humanoid}.PlatformStand',props:{humanoid:'player.Character:FindFirstChildOfClass("Humanoid")'},propsMeta:{humanoid:['Humanoid','text','socket']}},
  humanoid_floor_material:{type:'character',label:'[humanoid].FloorMaterial',icon:'◍',template:'{humanoid}.FloorMaterial',props:{humanoid:'player.Character:FindFirstChildOfClass("Humanoid")'},propsMeta:{humanoid:['Humanoid','text','socket']}},
  humanoid_move_direction:{type:'character',label:'[humanoid].MoveDirection',icon:'◍',template:'{humanoid}.MoveDirection',props:{humanoid:'player.Character:FindFirstChildOfClass("Humanoid")'},propsMeta:{humanoid:['Humanoid','text','socket']}},
  humanoid_root_part:{type:'character',label:'[humanoid].RootPart',icon:'◍',template:'{humanoid}.RootPart',props:{humanoid:'player.Character:FindFirstChildOfClass("Humanoid")'},propsMeta:{humanoid:['Humanoid','text','socket']}},
  humanoid_take_damage:{type:'character',label:'[humanoid]:TakeDamage([dano])',icon:'◍',template:'{humanoid}:TakeDamage({damage})',props:{humanoid:'player.Character:FindFirstChildOfClass("Humanoid")',damage:'10'},propsMeta:{humanoid:['Humanoid','text','socket'],damage:['Damage','number','socket']}},
  humanoid_move:{type:'character',label:'[humanoid]:Move([direção], [relativeToCamera])',icon:'◍',template:'{humanoid}:Move({direction}, {relativeToCamera})',props:{humanoid:'player.Character:FindFirstChildOfClass("Humanoid")',direction:'Vector3.new(0, 0, -1)',relativeToCamera:'false'},propsMeta:{humanoid:['Humanoid','text','socket'],direction:['Direction','text','socket'],relativeToCamera:['Relative to camera','boolean']}},
  humanoid_move_to:{type:'character',label:'[humanoid]:MoveTo([posição])',icon:'◍',template:'{humanoid}:MoveTo({position})',props:{humanoid:'player.Character:FindFirstChildOfClass("Humanoid")',position:'Vector3.new(0, 0, 0)'},propsMeta:{humanoid:['Humanoid','text','socket'],position:['Position','text','socket']}},
  humanoid_change_state:{type:'character',label:'[humanoid]:ChangeState([estado])',icon:'◍',template:'{humanoid}:ChangeState({state})',props:{humanoid:'player.Character:FindFirstChildOfClass("Humanoid")',state:'Enum.HumanoidStateType.Running'},propsMeta:{humanoid:['Humanoid','text','socket'],state:['State','text']}},
  humanoid_get_state:{type:'character',label:'[humanoid]:GetState()',icon:'◍',template:'{humanoid}:GetState()',props:{humanoid:'player.Character:FindFirstChildOfClass("Humanoid")'},propsMeta:{humanoid:['Humanoid','text','socket']}},
  humanoid_equip_tool:{type:'character',label:'[humanoid]:EquipTool([tool])',icon:'◍',template:'{humanoid}:EquipTool({tool})',props:{humanoid:'player.Character:FindFirstChildOfClass("Humanoid")',tool:'tool'},propsMeta:{humanoid:['Humanoid','text','socket'],tool:['Tool','text','socket']}},
  humanoid_unequip_tools:{type:'character',label:'[humanoid]:UnequipTools()',icon:'◍',template:'{humanoid}:UnequipTools()',props:{humanoid:'player.Character:FindFirstChildOfClass("Humanoid")'},propsMeta:{humanoid:['Humanoid','text','socket']}},
  humanoid_died:{type:'character',label:'[humanoid].Died',icon:'⚡',template:'{humanoid}.Died',props:{humanoid:'player.Character:FindFirstChildOfClass("Humanoid")'},propsMeta:{humanoid:['Humanoid','text','socket']},children:true},
  humanoid_state_changed:{type:'character',label:'[humanoid].StateChanged',icon:'⚡',template:'{humanoid}.StateChanged',props:{humanoid:'player.Character:FindFirstChildOfClass("Humanoid")'},propsMeta:{humanoid:['Humanoid','text','socket']},children:true},
  humanoid_health_changed:{type:'character',label:'[humanoid].HealthChanged',icon:'⚡',template:'{humanoid}.HealthChanged',props:{humanoid:'player.Character:FindFirstChildOfClass("Humanoid")'},propsMeta:{humanoid:['Humanoid','text','socket']},children:true},
  humanoid_move_to_finished:{type:'character',label:'[humanoid].MoveToFinished',icon:'⚡',template:'{humanoid}.MoveToFinished',props:{humanoid:'player.Character:FindFirstChildOfClass("Humanoid")'},propsMeta:{humanoid:['Humanoid','text','socket']},children:true},
  character_pivot_to:{type:'character',label:'[character]:PivotTo([CFrame])',icon:'◍',template:'{character}:PivotTo({cframe})',props:{character:'player.Character',cframe:'CFrame.new(0, 5, 0)'},propsMeta:{character:['Character','text','socket'],cframe:['CFrame','text','socket']}},
  character_get_pivot:{type:'character',label:'[character]:GetPivot()',icon:'◍',template:'{character}:GetPivot()',props:{character:'player.Character'},propsMeta:{character:['Character','text','socket']}},
  character_get_children:{type:'character',label:'[character]:GetChildren()',icon:'◍',template:'{character}:GetChildren()',props:{character:'player.Character'},propsMeta:{character:['Character','text','socket']}},
  character_get_descendants:{type:'character',label:'[character]:GetDescendants()',icon:'◍',template:'{character}:GetDescendants()',props:{character:'player.Character'},propsMeta:{character:['Character','text','socket']}},
  jump_character:{type:'character',label:'Jump character',icon:'◍',template:'local humanoid = {character}:FindFirstChildOfClass("Humanoid")\nif humanoid then\n    humanoid:ChangeState(Enum.HumanoidStateType.Jumping)\nend',props:{character:'player.Character'},propsMeta:{character:['Character','text','socket']}},
  play_sound:{type:'audio',label:'Play sound',icon:'♫',template:'local sound = workspace:FindFirstChild("{sound}") or Instance.new("Sound")\nsound.Name = "{sound}"\nsound.Volume = {volume}\nsound.Parent = workspace\nsound:Play()',props:{sound:'coinSound',volume:'1'},propsMeta:{sound:['Sound','text'],volume:['Volume','number','socket']}},
  show_text:{type:'ui',label:'Show text',icon:'▣',template:'local label = {target}\nif label then\n    label.Text = "{text}"\nend',props:{target:'scoreLabel',text:'Level 1'},propsMeta:{target:['Target','text','socket'],text:['Text','text']}},
  set_score:{type:'variables',label:'Set score',icon:'◆',template:'{variable} = {value}',props:{variable:'score',value:'10'},propsMeta:{variable:['Variable','text'],value:['Value','number']}},
  players_service:{type:'players',label:'game.Players',icon:'♙',template:'game.Players'},
  local_player:{type:'players',label:'Players.LocalPlayer',icon:'♙',template:'game.Players.LocalPlayer'},
  players_get_players:{type:'players',label:'Players:GetPlayers()',icon:'♙',template:'game.Players:GetPlayers()'},
  players_get_player_from_character:{type:'players',label:'Players:GetPlayerFromCharacter([character])',icon:'♙',template:'game.Players:GetPlayerFromCharacter({character})',props:{character:'player.Character'},propsMeta:{character:['Character','text','socket']}},
  players_get_player_by_user_id:{type:'players',label:'Players:GetPlayerByUserId([userId])',icon:'♙',template:'game.Players:GetPlayerByUserId({userId})',props:{userId:'1'},propsMeta:{userId:['UserId','number','socket']}},
  players_player_added:{type:'players',label:'Players.PlayerAdded',icon:'⚡',template:'game.Players.PlayerAdded',children:true},
  players_player_removing:{type:'players',label:'Players.PlayerRemoving',icon:'⚡',template:'game.Players.PlayerRemoving',children:true},
  player_name:{type:'players',label:'[player].Name',icon:'♙',template:'{player}.Name',props:{player:'player'},propsMeta:{player:['Player','text','socket']}},
  player_display_name:{type:'players',label:'[player].DisplayName',icon:'♙',template:'{player}.DisplayName',props:{player:'player'},propsMeta:{player:['Player','text','socket']}},
  player_user_id:{type:'players',label:'[player].UserId',icon:'♙',template:'{player}.UserId',props:{player:'player'},propsMeta:{player:['Player','text','socket']}},
  player_account_age:{type:'players',label:'[player].AccountAge',icon:'♙',template:'{player}.AccountAge',props:{player:'player'},propsMeta:{player:['Player','text','socket']}},
  player_character:{type:'players',label:'[player].Character',icon:'♙',template:'{player}.Character',props:{player:'player'},propsMeta:{player:['Player','text','socket']}},
  player_team:{type:'players',label:'[player].Team',icon:'♙',template:'{player}.Team',props:{player:'player'},propsMeta:{player:['Player','text','socket']}},
  player_team_color:{type:'players',label:'[player].TeamColor',icon:'♙',template:'{player}.TeamColor',props:{player:'player'},propsMeta:{player:['Player','text','socket']}},
  player_neutral:{type:'players',label:'[player].Neutral',icon:'♙',template:'{player}.Neutral',props:{player:'player'},propsMeta:{player:['Player','text','socket']}},
  player_character_added:{type:'players',label:'[player].CharacterAdded',icon:'⚡',template:'{player}.CharacterAdded',props:{player:'player'},propsMeta:{player:['Player','text','socket']},children:true},
  player_character_removing:{type:'players',label:'[player].CharacterRemoving',icon:'⚡',template:'{player}.CharacterRemoving',props:{player:'player'},propsMeta:{player:['Player','text','socket']},children:true},
  player_load_character:{type:'players',label:'[player]:LoadCharacter()',icon:'♙',template:'{player}:LoadCharacter()',props:{player:'player'},propsMeta:{player:['Player','text','socket']}},
  player_kick:{type:'players',label:'[player]:Kick([mensagem])',icon:'♙',template:'{player}:Kick({message})',props:{player:'player',message:'"No cheating!"'},propsMeta:{player:['Player','text','socket'],message:['Message','text']}},
  player_parent:{type:'players',label:'[player].Parent',icon:'♙',template:'{player}.Parent',props:{player:'player'},propsMeta:{player:['Player','text','socket']}},
  get_character_from_player:{type:'players',label:'obter personagem de [player]',icon:'♙',template:'{player}.Character',props:{player:'player'},propsMeta:{player:['Player','text','socket']}},
  get_player_from_character:{type:'players',label:'obter jogador de [character]',icon:'♙',template:'game.Players:GetPlayerFromCharacter({character})',props:{character:'player.Character'},propsMeta:{character:['Character','text','socket']}},
  get_player_by_user_id:{type:'players',label:'obter jogador por UserId [userId]',icon:'♙',template:'game.Players:GetPlayerByUserId({userId})',props:{userId:'1'},propsMeta:{userId:['UserId','number','socket']}},
  for_each_player_in_players_get_players:{type:'players',label:'para cada [player] em Players:GetPlayers()',icon:'↻',template:'for _, {player} in ipairs(game.Players:GetPlayers()) do',props:{player:'player'},propsMeta:{player:['Player','text']},children:true},
  tools_player_backpack:{type:'tools',label:'player.Backpack',icon:'🎒',template:'{player}.Backpack',props:{player:'player'},propsMeta:{player:['Player','text','socket']}},
  tools_player_character:{type:'tools',label:'player.Character',icon:'🎒',template:'{player}.Character',props:{player:'player'},propsMeta:{player:['Player','text','socket']}},
  tools_backpack_get_children:{type:'tools',label:'[backpack]:GetChildren()',icon:'🎒',template:'{backpack}:GetChildren()',props:{backpack:'backpack'},propsMeta:{backpack:['Backpack','text','socket']}},
  tools_backpack_find_first_child:{type:'tools',label:'[backpack]:FindFirstChild([nome])',icon:'🎒',template:'{backpack}:FindFirstChild({name})',props:{backpack:'backpack',name:'"Tool"'},propsMeta:{backpack:['Backpack','text','socket'],name:['Name','text','socket']}},
  tools_backpack_wait_for_child:{type:'tools',label:'[backpack]:WaitForChild([nome])',icon:'🎒',template:'{backpack}:WaitForChild({name})',props:{backpack:'backpack',name:'"Tool"'},propsMeta:{backpack:['Backpack','text','socket'],name:['Name','text','socket']}},
  tools_backpack_child_added:{type:'tools',label:'[backpack].ChildAdded',icon:'⚡',template:'{backpack}.ChildAdded',props:{backpack:'backpack'},propsMeta:{backpack:['Backpack','text','socket']},children:true},
  tools_backpack_child_removed:{type:'tools',label:'[backpack].ChildRemoved',icon:'⚡',template:'{backpack}.ChildRemoved',props:{backpack:'backpack'},propsMeta:{backpack:['Backpack','text','socket']},children:true},
  tools_tool_class:{type:'tools',label:'Tool',icon:'🎒',template:'Tool'},
  tools_new_tool:{type:'tools',label:'Instance.new("Tool")',icon:'🎒',template:'Instance.new("Tool")'},
  tools_tool_name:{type:'tools',label:'[tool].Name',icon:'🎒',template:'{tool}.Name',props:{tool:'tool'},propsMeta:{tool:['Tool','text','socket']}},
  tools_tool_parent:{type:'tools',label:'[tool].Parent',icon:'🎒',template:'{tool}.Parent',props:{tool:'tool'},propsMeta:{tool:['Tool','text','socket']}},
  tools_tool_enabled:{type:'tools',label:'[tool].Enabled',icon:'🎒',template:'{tool}.Enabled',props:{tool:'tool'},propsMeta:{tool:['Tool','text','socket']}},
  tools_tool_requires_handle:{type:'tools',label:'[tool].RequiresHandle',icon:'🎒',template:'{tool}.RequiresHandle',props:{tool:'tool'},propsMeta:{tool:['Tool','text','socket']}},
  tools_tool_can_be_dropped:{type:'tools',label:'[tool].CanBeDropped',icon:'🎒',template:'{tool}.CanBeDropped',props:{tool:'tool'},propsMeta:{tool:['Tool','text','socket']}},
  tools_tool_grip:{type:'tools',label:'[tool].Grip',icon:'🎒',template:'{tool}.Grip',props:{tool:'tool'},propsMeta:{tool:['Tool','text','socket']}},
  tools_tool_grip_pos:{type:'tools',label:'[tool].GripPos',icon:'🎒',template:'{tool}.GripPos',props:{tool:'tool'},propsMeta:{tool:['Tool','text','socket']}},
  tools_tool_grip_forward:{type:'tools',label:'[tool].GripForward',icon:'🎒',template:'{tool}.GripForward',props:{tool:'tool'},propsMeta:{tool:['Tool','text','socket']}},
  tools_tool_grip_right:{type:'tools',label:'[tool].GripRight',icon:'🎒',template:'{tool}.GripRight',props:{tool:'tool'},propsMeta:{tool:['Tool','text','socket']}},
  tools_tool_grip_up:{type:'tools',label:'[tool].GripUp',icon:'🎒',template:'{tool}.GripUp',props:{tool:'tool'},propsMeta:{tool:['Tool','text','socket']}},
  tools_tool_equipped:{type:'tools',label:'[tool].Equipped',icon:'⚡',template:'{tool}.Equipped',props:{tool:'tool'},propsMeta:{tool:['Tool','text','socket']},children:true},
  tools_tool_unequipped:{type:'tools',label:'[tool].Unequipped',icon:'⚡',template:'{tool}.Unequipped',props:{tool:'tool'},propsMeta:{tool:['Tool','text','socket']},children:true},
  tools_tool_activated:{type:'tools',label:'[tool].Activated',icon:'⚡',template:'{tool}.Activated',props:{tool:'tool'},propsMeta:{tool:['Tool','text','socket']},children:true},
  tools_tool_deactivated:{type:'tools',label:'[tool].Deactivated',icon:'⚡',template:'{tool}.Deactivated',props:{tool:'tool'},propsMeta:{tool:['Tool','text','socket']},children:true},
  tools_tool_activate:{type:'tools',label:'[tool]:Activate()',icon:'🎒',template:'{tool}:Activate()',props:{tool:'tool'},propsMeta:{tool:['Tool','text','socket']}},
  tools_tool_deactivate:{type:'tools',label:'[tool]:Deactivate()',icon:'🎒',template:'{tool}:Deactivate()',props:{tool:'tool'},propsMeta:{tool:['Tool','text','socket']}},
  tools_tool_clone:{type:'tools',label:'[tool]:Clone()',icon:'🎒',template:'{tool}:Clone()',props:{tool:'tool'},propsMeta:{tool:['Tool','text','socket']}},
  tools_tool_destroy:{type:'tools',label:'[tool]:Destroy()',icon:'🎒',template:'{tool}:Destroy()',props:{tool:'tool'},propsMeta:{tool:['Tool','text','socket']}},
  tools_tool_handle:{type:'tools',label:'[tool].Handle',icon:'🎒',template:'{tool}.Handle',props:{tool:'tool'},propsMeta:{tool:['Tool','text','socket']}},
  tools_tool_get_children:{type:'tools',label:'[tool]:GetChildren()',icon:'🎒',template:'{tool}:GetChildren()',props:{tool:'tool'},propsMeta:{tool:['Tool','text','socket']}},
  tools_tool_find_first_child:{type:'tools',label:'[tool]:FindFirstChild([nome])',icon:'🎒',template:'{tool}:FindFirstChild({name})',props:{tool:'tool',name:'"Handle"'},propsMeta:{tool:['Tool','text','socket'],name:['Name','text','socket']}},
  tools_humanoid_equip_tool:{type:'tools',label:'[humanoid]:EquipTool([tool])',icon:'🎒',template:'{humanoid}:EquipTool({tool})',props:{humanoid:'humanoid',tool:'tool'},propsMeta:{humanoid:['Humanoid','text','socket'],tool:['Tool','text','socket']}},
  tools_humanoid_unequip_tools:{type:'tools',label:'[humanoid]:UnequipTools()',icon:'🎒',template:'{humanoid}:UnequipTools()',props:{humanoid:'humanoid'},propsMeta:{humanoid:['Humanoid','text','socket']}},
  tools_give_tool_to_player:{type:'tools',label:'dar [tool] para [player]',icon:'🎒',template:'{tool}.Parent = {player}.Backpack',props:{tool:'tool',player:'player'},propsMeta:{tool:['Tool','text','socket'],player:['Player','text','socket']}},
  tools_remove_tool_from_player:{type:'tools',label:'remover [tool] de [player]',icon:'🎒',template:'{tool}.Parent = nil',props:{tool:'tool',player:'player'},propsMeta:{tool:['Tool','text','socket'],player:['Player','text','socket']}},
  tools_get_equipped_tool:{type:'tools',label:'obter ferramenta equipada de [player]',icon:'🎒',template:'{player}.Character:FindFirstChildOfClass("Tool")',props:{player:'player'},propsMeta:{player:['Player','text','socket']}},
  tools_when_equipped:{type:'tools',label:'quando [tool].Equipped([mouse])',icon:'⚡',template:'{tool}.Equipped:Connect(function({mouse})',props:{tool:'tool',mouse:'mouse'},propsMeta:{tool:['Tool','text','socket'],mouse:['Mouse','text','socket']},children:true},
  tools_when_unequipped:{type:'tools',label:'quando [tool].Unequipped',icon:'⚡',template:'{tool}.Unequipped:Connect(function()',props:{tool:'tool'},propsMeta:{tool:['Tool','text','socket']},children:true},
  tools_when_activated:{type:'tools',label:'quando [tool].Activated',icon:'⚡',template:'{tool}.Activated:Connect(function()',props:{tool:'tool'},propsMeta:{tool:['Tool','text','socket']},children:true},
  tools_when_deactivated:{type:'tools',label:'quando [tool].Deactivated',icon:'⚡',template:'{tool}.Deactivated:Connect(function()',props:{tool:'tool'},propsMeta:{tool:['Tool','text','socket']},children:true},
  teams_service:{type:'teams',label:'game.Teams',icon:'🏆',template:'game.Teams'},
  teams_get_teams:{type:'teams',label:'Teams:GetTeams()',icon:'🏆',template:'game.Teams:GetTeams()'},
  teams_get_children:{type:'teams',label:'Teams:GetChildren()',icon:'🏆',template:'game.Teams:GetChildren()'},
  teams_team_added:{type:'teams',label:'Teams.TeamAdded',icon:'⚡',template:'game.Teams.TeamAdded',children:true},
  teams_team_removed:{type:'teams',label:'Teams.TeamRemoved',icon:'⚡',template:'game.Teams.TeamRemoved',children:true},
  teams_team_class:{type:'teams',label:'Team',icon:'🏆',template:'Team'},
  teams_new_team:{type:'teams',label:'Instance.new("Team")',icon:'🏆',template:'Instance.new("Team")'},
  teams_team_name:{type:'teams',label:'[team].Name',icon:'🏆',template:'{team}.Name',props:{team:'team'},propsMeta:{team:['Team','text','socket']}},
  teams_team_color:{type:'teams',label:'[team].TeamColor',icon:'🏆',template:'{team}.TeamColor',props:{team:'team'},propsMeta:{team:['Team','text','socket']}},
  teams_team_auto_assignable:{type:'teams',label:'[team].AutoAssignable',icon:'🏆',template:'{team}.AutoAssignable',props:{team:'team'},propsMeta:{team:['Team','text','socket']}},
  teams_team_parent:{type:'teams',label:'[team].Parent',icon:'🏆',template:'{team}.Parent',props:{team:'team'},propsMeta:{team:['Team','text','socket']}},
  teams_player_team:{type:'teams',label:'player.Team',icon:'🏆',template:'{player}.Team',props:{player:'player'},propsMeta:{player:['Player','text','socket']}},
  teams_player_team_color:{type:'teams',label:'player.TeamColor',icon:'🏆',template:'{player}.TeamColor',props:{player:'player'},propsMeta:{player:['Player','text','socket']}},
  teams_player_neutral:{type:'teams',label:'player.Neutral',icon:'🏆',template:'{player}.Neutral',props:{player:'player'},propsMeta:{player:['Player','text','socket']}},
  teams_set_player_team:{type:'teams',label:'player.Team = [team]',icon:'🏆',template:'{player}.Team = {team}',props:{player:'player',team:'team'},propsMeta:{player:['Player','text','socket'],team:['Team','text','socket']}},
  teams_set_player_neutral:{type:'teams',label:'player.Neutral = [true/false]',icon:'🏆',template:'{player}.Neutral = {neutral}',props:{player:'player',neutral:'true'},propsMeta:{player:['Player','text','socket'],neutral:['Neutral','boolean','socket']}},
  teams_get_player_team:{type:'teams',label:'obter time de [player]',icon:'🏆',template:'{player}.Team',props:{player:'player'},propsMeta:{player:['Player','text','socket']}},
  teams_get_team_players:{type:'teams',label:'obter jogadores do time [team]',icon:'🏆',template:'{team}:GetPlayers()',props:{team:'team'},propsMeta:{team:['Team','text','socket']}},
  teams_for_each_player:{type:'teams',label:'para cada [player] em [team]:GetPlayers()',icon:'↻',template:'for _, {player} in ipairs({team}:GetPlayers()) do',props:{player:'player',team:'team'},propsMeta:{player:['Player','text'],team:['Team','text','socket']},children:true},
  teams_create_leaderstats:{type:'teams',label:'criar leaderstats para [player]',icon:'🏆',template:'local leaderstats = Instance.new("Folder")\nleaderstats.Name = "leaderstats"\nleaderstats.Parent = {player}',props:{player:'player'},propsMeta:{player:['Player','text','socket']}},
  teams_player_leaderstats:{type:'teams',label:'player.leaderstats',icon:'🏆',template:'{player}.leaderstats',props:{player:'player'},propsMeta:{player:['Player','text','socket']}},
  teams_new_int_value:{type:'teams',label:'Instance.new("IntValue")',icon:'🏆',template:'Instance.new("IntValue")'},
  teams_new_number_value:{type:'teams',label:'Instance.new("NumberValue")',icon:'🏆',template:'Instance.new("NumberValue")'},
  teams_new_string_value:{type:'teams',label:'Instance.new("StringValue")',icon:'🏆',template:'Instance.new("StringValue")'},
  teams_value_name:{type:'teams',label:'[valor].Name',icon:'🏆',template:'{value}.Name',props:{value:'stat'},propsMeta:{value:['Value','text','socket']}},
  teams_value_value:{type:'teams',label:'[valor].Value',icon:'🏆',template:'{value}.Value',props:{value:'stat'},propsMeta:{value:['Value','text','socket']}},
  teams_value_parent:{type:'teams',label:'[valor].Parent',icon:'🏆',template:'{value}.Parent',props:{value:'stat'},propsMeta:{value:['Value','text','socket']}},
  teams_create_statistic:{type:'teams',label:'criar estatística [nome] = [valor]',icon:'🏆',template:'local {name} = Instance.new("IntValue")\n{name}.Name = {nameValue}\n{name}.Value = {value}',props:{name:'stat',nameValue:'"Score"',value:'0'},propsMeta:{name:['Variable','text','socket'],nameValue:['Name','text','socket'],value:['Value','number','socket']}},
  teams_get_statistic:{type:'teams',label:'obter estatística [player] → [nome]',icon:'🏆',template:'{player}.leaderstats[{name}]',props:{player:'player',name:'"Score"'},propsMeta:{player:['Player','text','socket'],name:['Name','text','socket']}},
  teams_set_statistic:{type:'teams',label:'definir estatística [player] → [nome] = [valor]',icon:'🏆',template:'{player}.leaderstats[{name}].Value = {value}',props:{player:'player',name:'"Score"',value:'0'},propsMeta:{player:['Player','text','socket'],name:['Name','text','socket'],value:['Value','number','socket']}},
  teams_change_statistic:{type:'teams',label:'alterar estatística [player] → [nome] por [valor]',icon:'🏆',template:'{player}.leaderstats[{name}].Value += {value}',props:{player:'player',name:'"Score"',value:'1'},propsMeta:{player:['Player','text','socket'],name:['Name','text','socket'],value:['Value','number','socket']}},
  teams_statistic_changed:{type:'teams',label:'quando [estatística].Changed',icon:'⚡',template:'{statistic}.Changed:Connect(function()',props:{statistic:'stat'},propsMeta:{statistic:['Statistic','text','socket']},children:true},
  teams_statistic_value_changed:{type:'teams',label:'quando [estatística].Value mudar',icon:'⚡',template:'{statistic}.GetPropertyChangedSignal("Value"):Connect(function()',props:{statistic:'stat'},propsMeta:{statistic:['Statistic','text','socket']},children:true},
  admin_player_kick:{type:'admin',label:'player:Kick([mensagem])',icon:'👑',template:'{player}:Kick({message})',props:{player:'player',message:'"Mensagem"'},propsMeta:{player:['Player','text','socket'],message:['Message','text','socket']}},
  admin_player_user_id:{type:'admin',label:'player.UserId',icon:'👑',template:'{player}.UserId',props:{player:'player'},propsMeta:{player:['Player','text','socket']}},
  admin_player_name:{type:'admin',label:'player.Name',icon:'👑',template:'{player}.Name',props:{player:'player'},propsMeta:{player:['Player','text','socket']}},
  admin_player_display_name:{type:'admin',label:'player.DisplayName',icon:'👑',template:'{player}.DisplayName',props:{player:'player'},propsMeta:{player:['Player','text','socket']}},
  admin_players_get_players:{type:'admin',label:'Players:GetPlayers()',icon:'👑',template:'game.Players:GetPlayers()'},
  admin_players_get_player_by_user_id:{type:'admin',label:'Players:GetPlayerByUserId([userId])',icon:'👑',template:'game.Players:GetPlayerByUserId({userId})',props:{userId:'1'},propsMeta:{userId:['UserId','number','socket']}},
  admin_is_administrator:{type:'admin',label:'é administrador [player]',icon:'👑',template:'isAdministrator({player})',props:{player:'player'},propsMeta:{player:['Player','text','socket']}},
  admin_is_moderator:{type:'admin',label:'é moderador [player]',icon:'👑',template:'isModerator({player})',props:{player:'player'},propsMeta:{player:['Player','text','socket']}},
  admin_add_administrator:{type:'admin',label:'adicionar administrador [userId]',icon:'👑',template:'addAdministrator({userId})',props:{userId:'1'},propsMeta:{userId:['UserId','number','socket']}},
  admin_remove_administrator:{type:'admin',label:'remover administrador [userId]',icon:'👑',template:'removeAdministrator({userId})',props:{userId:'1'},propsMeta:{userId:['UserId','number','socket']}},
  admin_add_moderator:{type:'admin',label:'adicionar moderador [userId]',icon:'👑',template:'addModerator({userId})',props:{userId:'1'},propsMeta:{userId:['UserId','number','socket']}},
  admin_remove_moderator:{type:'admin',label:'remover moderador [userId]',icon:'👑',template:'removeModerator({userId})',props:{userId:'1'},propsMeta:{userId:['UserId','number','socket']}},
  admin_check_permission:{type:'admin',label:'verificar permissão [player] → [permissão]',icon:'👑',template:'hasPermission({player}, {permission})',props:{player:'player',permission:'"kick"'},propsMeta:{player:['Player','text','socket'],permission:['Permission','text','socket']}},
  admin_set_permission:{type:'admin',label:'definir permissão [player] → [permissão]',icon:'👑',template:'setPermission({player}, {permission})',props:{player:'player',permission:'"moderator"'},propsMeta:{player:['Player','text','socket'],permission:['Permission','text','socket']}},
  admin_get_role:{type:'admin',label:'obter cargo [player]',icon:'👑',template:'getRole({player})',props:{player:'player'},propsMeta:{player:['Player','text','socket']}},
  admin_set_role:{type:'admin',label:'definir cargo [player] → [cargo]',icon:'👑',template:'setRole({player}, {role})',props:{player:'player',role:'"Moderator"'},propsMeta:{player:['Player','text','socket'],role:['Role','text','socket']}},
  admin_execute_command:{type:'admin',label:'executar comando [comando]',icon:'👑',template:'executeCommand({command})',props:{command:'"/kick player"'},propsMeta:{command:['Command','text','socket']}},
  admin_command_received:{type:'admin',label:'comando recebido [player] [comando]',icon:'⚡',template:'CommandReceived:Connect(function({player}, {command})',props:{player:'player',command:'command'},propsMeta:{player:['Player','text','socket'],command:['Command','text','socket']},children:true},
  admin_if_has_permission:{type:'admin',label:'se [player] tem permissão [permissão]',icon:'👑',template:'if hasPermission({player}, {permission}) then',props:{player:'player',permission:'"kick"'},propsMeta:{player:['Player','text','socket'],permission:['Permission','text','socket']},children:true},
  admin_if_is_administrator:{type:'admin',label:'se [player] é administrador',icon:'👑',template:'if isAdministrator({player}) then',props:{player:'player'},propsMeta:{player:['Player','text','socket']},children:true},
  admin_if_is_moderator:{type:'admin',label:'se [player] é moderador',icon:'👑',template:'if isModerator({player}) then',props:{player:'player'},propsMeta:{player:['Player','text','socket']},children:true},
  admin_ban_player:{type:'admin',label:'banir [player]',icon:'👑',template:'banPlayer({player})',props:{player:'player'},propsMeta:{player:['Player','text','socket']}},
  admin_unban_user:{type:'admin',label:'desbanir [userId]',icon:'👑',template:'unbanUser({userId})',props:{userId:'1'},propsMeta:{userId:['UserId','number','socket']}},
  admin_teleport_player:{type:'admin',label:'teleportar [player] para [posição]',icon:'👑',template:'{player}:LoadCharacter()\n{player}.Character:PivotTo(CFrame.new({position}))',props:{player:'player',position:'Vector3.zero'},propsMeta:{player:['Player','text','socket'],position:['Position','text','socket']}},
  admin_send_message_player:{type:'admin',label:'enviar mensagem para [player] → [mensagem]',icon:'👑',template:'sendMessage({player}, {message})',props:{player:'player',message:'"Mensagem"'},propsMeta:{player:['Player','text','socket'],message:['Message','text','socket']}},
  admin_send_message_all:{type:'admin',label:'enviar mensagem para todos → [mensagem]',icon:'👑',template:'sendMessageToAll({message})',props:{message:'"Mensagem"'},propsMeta:{message:['Message','text','socket']}},
  multiplayer_replicated_storage:{type:'multiplayer',label:'ReplicatedStorage',icon:'🌐',template:'game:GetService("ReplicatedStorage")'},
  multiplayer_replicated_storage_wait_for_child:{type:'multiplayer',label:'ReplicatedStorage:WaitForChild([nome])',icon:'🌐',template:'ReplicatedStorage:WaitForChild({name})',props:{name:'"RemoteEvent"'},propsMeta:{name:['Name','text','socket']}},
  multiplayer_replicated_storage_find_first_child:{type:'multiplayer',label:'ReplicatedStorage:FindFirstChild([nome])',icon:'🌐',template:'ReplicatedStorage:FindFirstChild({name})',props:{name:'"RemoteEvent"'},propsMeta:{name:['Name','text','socket']}},
  multiplayer_remote_event:{type:'multiplayer',label:'RemoteEvent',icon:'🌐',template:'RemoteEvent'},
  multiplayer_new_remote_event:{type:'multiplayer',label:'Instance.new("RemoteEvent")',icon:'🌐',template:'Instance.new("RemoteEvent")'},
  multiplayer_remote_event_fire_server:{type:'multiplayer',label:'[remoteEvent]:FireServer([argumentos])',icon:'🌐',template:'{remoteEvent}:FireServer({arguments})',props:{remoteEvent:'remoteEvent',arguments:'...'},propsMeta:{remoteEvent:['RemoteEvent','text','socket'],arguments:['Arguments','text','socket']}},
  multiplayer_remote_event_on_server_event:{type:'multiplayer',label:'[remoteEvent].OnServerEvent',icon:'⚡',template:'{remoteEvent}.OnServerEvent',props:{remoteEvent:'remoteEvent'},propsMeta:{remoteEvent:['RemoteEvent','text','socket']},children:true},
  multiplayer_remote_event_fire_client:{type:'multiplayer',label:'[remoteEvent]:FireClient([player], [argumentos])',icon:'🌐',template:'{remoteEvent}:FireClient({player}, {arguments})',props:{remoteEvent:'remoteEvent',player:'player',arguments:'...'},propsMeta:{remoteEvent:['RemoteEvent','text','socket'],player:['Player','text','socket'],arguments:['Arguments','text','socket']}},
  multiplayer_remote_event_fire_all_clients:{type:'multiplayer',label:'[remoteEvent]:FireAllClients([argumentos])',icon:'🌐',template:'{remoteEvent}:FireAllClients({arguments})',props:{remoteEvent:'remoteEvent',arguments:'...'},propsMeta:{remoteEvent:['RemoteEvent','text','socket'],arguments:['Arguments','text','socket']}},
  multiplayer_remote_event_on_client_event:{type:'multiplayer',label:'[remoteEvent].OnClientEvent',icon:'⚡',template:'{remoteEvent}.OnClientEvent',props:{remoteEvent:'remoteEvent'},propsMeta:{remoteEvent:['RemoteEvent','text','socket']},children:true},
  multiplayer_remote_function:{type:'multiplayer',label:'RemoteFunction',icon:'🌐',template:'RemoteFunction'},
  multiplayer_new_remote_function:{type:'multiplayer',label:'Instance.new("RemoteFunction")',icon:'🌐',template:'Instance.new("RemoteFunction")'},
  multiplayer_remote_function_invoke_server:{type:'multiplayer',label:'[remoteFunction]:InvokeServer([argumentos])',icon:'🌐',template:'{remoteFunction}:InvokeServer({arguments})',props:{remoteFunction:'remoteFunction',arguments:'...'},propsMeta:{remoteFunction:['RemoteFunction','text','socket'],arguments:['Arguments','text','socket']}},
  multiplayer_remote_function_on_server_invoke:{type:'multiplayer',label:'[remoteFunction].OnServerInvoke',icon:'⚡',template:'{remoteFunction}.OnServerInvoke',props:{remoteFunction:'remoteFunction'},propsMeta:{remoteFunction:['RemoteFunction','text','socket']},children:true},
  multiplayer_remote_function_invoke_client:{type:'multiplayer',label:'[remoteFunction]:InvokeClient([player], [argumentos])',icon:'🌐',template:'{remoteFunction}:InvokeClient({player}, {arguments})',props:{remoteFunction:'remoteFunction',player:'player',arguments:'...'},propsMeta:{remoteFunction:['RemoteFunction','text','socket'],player:['Player','text','socket'],arguments:['Arguments','text','socket']}},
  multiplayer_remote_function_on_client_invoke:{type:'multiplayer',label:'[remoteFunction].OnClientInvoke',icon:'⚡',template:'{remoteFunction}.OnClientInvoke',props:{remoteFunction:'remoteFunction'},propsMeta:{remoteFunction:['RemoteFunction','text','socket']},children:true},
  multiplayer_remote_event_name:{type:'multiplayer',label:'[remoteEvent].Name',icon:'🌐',template:'{remoteEvent}.Name',props:{remoteEvent:'remoteEvent'},propsMeta:{remoteEvent:['RemoteEvent','text','socket']}},
  multiplayer_remote_event_parent:{type:'multiplayer',label:'[remoteEvent].Parent',icon:'🌐',template:'{remoteEvent}.Parent',props:{remoteEvent:'remoteEvent'},propsMeta:{remoteEvent:['RemoteEvent','text','socket']}},
  multiplayer_remote_function_name:{type:'multiplayer',label:'[remoteFunction].Name',icon:'🌐',template:'{remoteFunction}.Name',props:{remoteFunction:'remoteFunction'},propsMeta:{remoteFunction:['RemoteFunction','text','socket']}},
  multiplayer_remote_function_parent:{type:'multiplayer',label:'[remoteFunction].Parent',icon:'🌐',template:'{remoteFunction}.Parent',props:{remoteFunction:'remoteFunction'},propsMeta:{remoteFunction:['RemoteFunction','text','socket']}},
  multiplayer_when_remote_event_server:{type:'multiplayer',label:'quando [RemoteEvent].OnServerEvent([player], [argumentos])',icon:'⚡',template:'{remoteEvent}.OnServerEvent:Connect(function({player}, {arguments})',props:{remoteEvent:'remoteEvent',player:'player',arguments:'...'},propsMeta:{remoteEvent:['RemoteEvent','text','socket'],player:['Player','text','socket'],arguments:['Arguments','text','socket']},children:true},
  multiplayer_when_remote_event_client:{type:'multiplayer',label:'quando [RemoteEvent].OnClientEvent([argumentos])',icon:'⚡',template:'{remoteEvent}.OnClientEvent:Connect(function({arguments})',props:{remoteEvent:'remoteEvent',arguments:'...'},propsMeta:{remoteEvent:['RemoteEvent','text','socket'],arguments:['Arguments','text','socket']},children:true},
  multiplayer_when_remote_function_server:{type:'multiplayer',label:'quando [RemoteFunction].OnServerInvoke([player], [argumentos])',icon:'⚡',template:'{remoteFunction}.OnServerInvoke = function({player}, {arguments})',props:{remoteFunction:'remoteFunction',player:'player',arguments:'...'},propsMeta:{remoteFunction:['RemoteFunction','text','socket'],player:['Player','text','socket'],arguments:['Arguments','text','socket']},children:true},
  multiplayer_when_remote_function_client:{type:'multiplayer',label:'quando [RemoteFunction].OnClientInvoke([argumentos])',icon:'⚡',template:'{remoteFunction}.OnClientInvoke = function({arguments})',props:{remoteFunction:'remoteFunction',arguments:'...'},propsMeta:{remoteFunction:['RemoteFunction','text','socket'],arguments:['Arguments','text','socket']},children:true},
  services_get_service:{type:'services',label:'game:GetService([serviço])',icon:'⚙',template:'game:GetService({service})',props:{service:'"Players"'},propsMeta:{service:['Service','text','socket']}},
  services_players:{type:'services',label:'Players',icon:'⚙',template:'game:GetService("Players")'},
  services_workspace:{type:'services',label:'Workspace',icon:'⚙',template:'game:GetService("Workspace")'},
  services_replicated_storage:{type:'services',label:'ReplicatedStorage',icon:'⚙',template:'game:GetService("ReplicatedStorage")'},
  services_replicated_first:{type:'services',label:'ReplicatedFirst',icon:'⚙',template:'game:GetService("ReplicatedFirst")'},
  services_server_storage:{type:'services',label:'ServerStorage',icon:'⚙',template:'game:GetService("ServerStorage")'},
  services_server_script_service:{type:'services',label:'ServerScriptService',icon:'⚙',template:'game:GetService("ServerScriptService")'},
  services_starter_gui:{type:'services',label:'StarterGui',icon:'⚙',template:'game:GetService("StarterGui")'},
  services_starter_pack:{type:'services',label:'StarterPack',icon:'⚙',template:'game:GetService("StarterPack")'},
  services_starter_player:{type:'services',label:'StarterPlayer',icon:'⚙',template:'game:GetService("StarterPlayer")'},
  services_lighting:{type:'services',label:'Lighting',icon:'⚙',template:'game:GetService("Lighting")'},
  services_sound_service:{type:'services',label:'SoundService',icon:'⚙',template:'game:GetService("SoundService")'},
  services_teams:{type:'services',label:'Teams',icon:'⚙',template:'game:GetService("Teams")'},
  services_text_chat_service:{type:'services',label:'TextChatService',icon:'⚙',template:'game:GetService("TextChatService")'},
  services_user_input_service:{type:'services',label:'UserInputService',icon:'⚙',template:'game:GetService("UserInputService")'},
  services_context_action_service:{type:'services',label:'ContextActionService',icon:'⚙',template:'game:GetService("ContextActionService")'},
  services_run_service:{type:'services',label:'RunService',icon:'⚙',template:'game:GetService("RunService")'},
  services_tween_service:{type:'services',label:'TweenService',icon:'⚙',template:'game:GetService("TweenService")'},
  services_debris:{type:'services',label:'Debris',icon:'⚙',template:'game:GetService("Debris")'},
  services_collection_service:{type:'services',label:'CollectionService',icon:'⚙',template:'game:GetService("CollectionService")'},
  services_http_service:{type:'services',label:'HttpService',icon:'⚙',template:'game:GetService("HttpService")'},
  services_marketplace_service:{type:'services',label:'MarketplaceService',icon:'⚙',template:'game:GetService("MarketplaceService")'},
  services_teleport_service:{type:'services',label:'TeleportService',icon:'⚙',template:'game:GetService("TeleportService")'},
  services_data_store_service:{type:'services',label:'DataStoreService',icon:'⚙',template:'game:GetService("DataStoreService")'},
  services_memory_store_service:{type:'services',label:'MemoryStoreService',icon:'⚙',template:'game:GetService("MemoryStoreService")'},
  services_messaging_service:{type:'services',label:'MessagingService',icon:'⚙',template:'game:GetService("MessagingService")'},
  services_badge_service:{type:'services',label:'BadgeService',icon:'⚙',template:'game:GetService("BadgeService")'},
  services_pathfinding_service:{type:'services',label:'PathfindingService',icon:'⚙',template:'game:GetService("PathfindingService")'},
  services_physics_service:{type:'services',label:'PhysicsService',icon:'⚙',template:'game:GetService("PhysicsService")'},
  services_proximity_prompt_service:{type:'services',label:'ProximityPromptService',icon:'⚙',template:'game:GetService("ProximityPromptService")'},
  services_localization_service:{type:'services',label:'LocalizationService',icon:'⚙',template:'game:GetService("LocalizationService")'},
  services_content_provider:{type:'services',label:'ContentProvider',icon:'⚙',template:'game:GetService("ContentProvider")'},
  services_insert_service:{type:'services',label:'InsertService',icon:'⚙',template:'game:GetService("InsertService")'},
  services_avatar_editor_service:{type:'services',label:'AvatarEditorService',icon:'⚙',template:'game:GetService("AvatarEditorService")'},
  services_policy_service:{type:'services',label:'PolicyService',icon:'⚙',template:'game:GetService("PolicyService")'},
  services_social_service:{type:'services',label:'SocialService',icon:'⚙',template:'game:GetService("SocialService")'},
  services_test_service:{type:'services',label:'TestService',icon:'⚙',template:'game:GetService("TestService")'},
  services_chat:{type:'services',label:'Chat',icon:'⚙',template:'game:GetService("Chat")'},
  services_localization_get_translator:{type:'services',label:'LocalizationService:GetTranslatorForPlayer([player])',icon:'⚙',template:'LocalizationService:GetTranslatorForPlayer({player})',props:{player:'player'},propsMeta:{player:['Player','text','socket']}},
  services_tween_create:{type:'services',label:'TweenService:Create([objeto], [informações], [propriedades])',icon:'⚙',template:'TweenService:Create({object}, {info}, {properties})',props:{object:'object',info:'TweenInfo.new(1)',properties:'{Transparency = 0}'},propsMeta:{object:['Object','text','socket'],info:['Info','text','socket'],properties:['Properties','text','socket']}},
  services_debris_add_item:{type:'services',label:'Debris:AddItem([objeto], [tempo])',icon:'⚙',template:'Debris:AddItem({object}, {time})',props:{object:'object',time:'5'},propsMeta:{object:['Object','text','socket'],time:['Time','number','socket']}},
  services_collection_add_tag:{type:'services',label:'CollectionService:AddTag([objeto], [tag])',icon:'⚙',template:'CollectionService:AddTag({object}, {tag})',props:{object:'object',tag:'"Collectible"'},propsMeta:{object:['Object','text','socket'],tag:['Tag','text','socket']}},
  services_collection_remove_tag:{type:'services',label:'CollectionService:RemoveTag([objeto], [tag])',icon:'⚙',template:'CollectionService:RemoveTag({object}, {tag})',props:{object:'object',tag:'"Collectible"'},propsMeta:{object:['Object','text','socket'],tag:['Tag','text','socket']}},
  services_collection_has_tag:{type:'services',label:'CollectionService:HasTag([objeto], [tag])',icon:'⚙',template:'CollectionService:HasTag({object}, {tag})',props:{object:'object',tag:'"Collectible"'},propsMeta:{object:['Object','text','socket'],tag:['Tag','text','socket']}},
  services_collection_get_tagged:{type:'services',label:'CollectionService:GetTagged([tag])',icon:'⚙',template:'CollectionService:GetTagged({tag})',props:{tag:'"Collectible"'},propsMeta:{tag:['Tag','text','socket']}},
  services_run_heartbeat:{type:'services',label:'RunService.Heartbeat',icon:'⚡',template:'RunService.Heartbeat',children:true},
  services_run_stepped:{type:'services',label:'RunService.Stepped',icon:'⚡',template:'RunService.Stepped',children:true},
  services_run_render_stepped:{type:'services',label:'RunService.RenderStepped',icon:'⚡',template:'RunService.RenderStepped',children:true},
  services_run_is_server:{type:'services',label:'RunService:IsServer()',icon:'⚙',template:'RunService:IsServer()'},
  services_run_is_client:{type:'services',label:'RunService:IsClient()',icon:'⚙',template:'RunService:IsClient()'},
  services_run_is_studio:{type:'services',label:'RunService:IsStudio()',icon:'⚙',template:'RunService:IsStudio()'},
  services_http_json_encode:{type:'services',label:'HttpService:JSONEncode([valor])',icon:'⚙',template:'HttpService:JSONEncode({value})',props:{value:'data'},propsMeta:{value:['Value','text','socket']}},
  services_http_json_decode:{type:'services',label:'HttpService:JSONDecode([texto])',icon:'⚙',template:'HttpService:JSONDecode({text})',props:{text:'jsonText'},propsMeta:{text:['Text','text','socket']}},
  services_http_generate_guid:{type:'services',label:'HttpService:GenerateGUID()',icon:'⚙',template:'HttpService:GenerateGUID()'},
  services_marketplace_prompt_product_purchase:{type:'services',label:'MarketplaceService:PromptProductPurchase([player], [productId])',icon:'⚙',template:'MarketplaceService:PromptProductPurchase({player}, {productId})',props:{player:'player',productId:'1'},propsMeta:{player:['Player','text','socket'],productId:['ProductId','number','socket']}},
  services_teleport:{type:'services',label:'TeleportService:Teleport([placeId], [player])',icon:'⚙',template:'TeleportService:Teleport({placeId}, {player})',props:{placeId:'1',player:'player'},propsMeta:{placeId:['PlaceId','number','socket'],player:['Player','text','socket']}},
  services_pathfinding_create_path:{type:'services',label:'PathfindingService:CreatePath([configuração])',icon:'⚙',template:'PathfindingService:CreatePath({configuration})',props:{configuration:'{}'},propsMeta:{configuration:['Configuration','text','socket']}},
  datastore_service:{type:'datastore',label:'DataStoreService',icon:'💾',template:'game:GetService("DataStoreService")'},
  datastore_get_data_store:{type:'datastore',label:'DataStoreService:GetDataStore([nome])',icon:'💾',template:'DataStoreService:GetDataStore({name})',props:{name:'"PlayerData"'},propsMeta:{name:['Name','text','socket']}},
  datastore_get_ordered_data_store:{type:'datastore',label:'DataStoreService:GetOrderedDataStore([nome])',icon:'💾',template:'DataStoreService:GetOrderedDataStore({name})',props:{name:'"Leaderboard"'},propsMeta:{name:['Name','text','socket']}},
  datastore_get_async:{type:'datastore',label:'[dataStore]:GetAsync([chave])',icon:'💾',template:'{dataStore}:GetAsync({key})',props:{dataStore:'dataStore',key:'"player_1"'},propsMeta:{dataStore:['DataStore','text','socket'],key:['Key','text','socket']}},
  datastore_set_async:{type:'datastore',label:'[dataStore]:SetAsync([chave], [valor])',icon:'💾',template:'{dataStore}:SetAsync({key}, {value})',props:{dataStore:'dataStore',key:'"player_1"',value:'data'},propsMeta:{dataStore:['DataStore','text','socket'],key:['Key','text','socket'],value:['Value','text','socket']}},
  datastore_update_async:{type:'datastore',label:'[dataStore]:UpdateAsync([chave], [função])',icon:'💾',template:'{dataStore}:UpdateAsync({key}, {functionName})',props:{dataStore:'dataStore',key:'"player_1"',functionName:'updateData'},propsMeta:{dataStore:['DataStore','text','socket'],key:['Key','text','socket'],functionName:['Function','text','socket']}},
  datastore_increment_async:{type:'datastore',label:'[dataStore]:IncrementAsync([chave], [valor])',icon:'💾',template:'{dataStore}:IncrementAsync({key}, {value})',props:{dataStore:'dataStore',key:'"score"',value:'1'},propsMeta:{dataStore:['DataStore','text','socket'],key:['Key','text','socket'],value:['Value','number','socket']}},
  datastore_remove_async:{type:'datastore',label:'[dataStore]:RemoveAsync([chave])',icon:'💾',template:'{dataStore}:RemoveAsync({key})',props:{dataStore:'dataStore',key:'"player_1"'},propsMeta:{dataStore:['DataStore','text','socket'],key:['Key','text','socket']}},
  datastore_on_update:{type:'datastore',label:'[dataStore]:OnUpdate([chave], [função])',icon:'💾',template:'{dataStore}:OnUpdate({key}, {functionName})',props:{dataStore:'dataStore',key:'"player_1"',functionName:'onUpdate'},propsMeta:{dataStore:['DataStore','text','socket'],key:['Key','text','socket'],functionName:['Function','text','socket']}},
  datastore_get_version_async:{type:'datastore',label:'[dataStore]:GetVersionAsync([chave], [versão])',icon:'💾',template:'{dataStore}:GetVersionAsync({key}, {version})',props:{dataStore:'dataStore',key:'"player_1"',version:'"version"'},propsMeta:{dataStore:['DataStore','text','socket'],key:['Key','text','socket'],version:['Version','text','socket']}},
  datastore_list_versions_async:{type:'datastore',label:'[dataStore]:ListVersionsAsync([chave])',icon:'💾',template:'{dataStore}:ListVersionsAsync({key})',props:{dataStore:'dataStore',key:'"player_1"'},propsMeta:{dataStore:['DataStore','text','socket'],key:['Key','text','socket']}},
  datastore_remove_version_async:{type:'datastore',label:'[dataStore]:RemoveVersionAsync([chave], [versão])',icon:'💾',template:'{dataStore}:RemoveVersionAsync({key}, {version})',props:{dataStore:'dataStore',key:'"player_1"',version:'"version"'},propsMeta:{dataStore:['DataStore','text','socket'],key:['Key','text','socket'],version:['Version','text','socket']}},
  datastore_get_data_store_scope:{type:'datastore',label:'DataStoreService:GetDataStore([nome], [escopo])',icon:'💾',template:'DataStoreService:GetDataStore({name}, {scope})',props:{name:'"PlayerData"',scope:'"global"'},propsMeta:{name:['Name','text','socket'],scope:['Scope','text','socket']}},
  datastore_get_ordered_data_store_scope:{type:'datastore',label:'DataStoreService:GetOrderedDataStore([nome], [escopo])',icon:'💾',template:'DataStoreService:GetOrderedDataStore({name}, {scope})',props:{name:'"Leaderboard"',scope:'"global"'},propsMeta:{name:['Name','text','socket'],scope:['Scope','text','socket']}},
  datastore_name:{type:'datastore',label:'[dataStore].Name',icon:'💾',template:'{dataStore}.Name',props:{dataStore:'dataStore'},propsMeta:{dataStore:['DataStore','text','socket']}},
  datastore_scope:{type:'datastore',label:'[dataStore].Scope',icon:'💾',template:'{dataStore}.Scope',props:{dataStore:'dataStore'},propsMeta:{dataStore:['DataStore','text','socket']}},
  datastore_save_player:{type:'datastore',label:'salvar dados do [player]',icon:'💾',template:'savePlayerData({player})',props:{player:'player'},propsMeta:{player:['Player','text','socket']}},
  datastore_load_player:{type:'datastore',label:'carregar dados do [player]',icon:'💾',template:'loadPlayerData({player})',props:{player:'player'},propsMeta:{player:['Player','text','socket']}},
  datastore_create_default_data:{type:'datastore',label:'criar dados padrão [tabela]',icon:'💾',template:'local {table} = createDefaultData()',props:{table:'defaultData'},propsMeta:{table:['Table','text','socket']}},
  datastore_has_player_data:{type:'datastore',label:'verificar se existem dados [player]',icon:'💾',template:'hasPlayerData({player})',props:{player:'player'},propsMeta:{player:['Player','text','socket']}},
  datastore_when_loaded:{type:'datastore',label:'quando dados forem carregados [player]',icon:'⚡',template:'DataLoaded:Connect(function({player})',props:{player:'player'},propsMeta:{player:['Player','text','socket']},children:true},
  datastore_when_saved:{type:'datastore',label:'quando dados forem salvos [player]',icon:'⚡',template:'DataSaved:Connect(function({player})',props:{player:'player'},propsMeta:{player:['Player','text','socket']},children:true},
  datastore_try_execute:{type:'datastore',label:'tentar executar',icon:'💾',template:'local success, result = pcall(function()',children:true},
  datastore_if_error:{type:'datastore',label:'se ocorrer erro [erro]',icon:'⚠',template:'if not success then',props:{error:'errorMessage'},propsMeta:{error:['Error','text','socket']},children:true},
  datastore_retry_save:{type:'datastore',label:'repetir salvamento [n] vezes',icon:'💾',template:'for attempt = 1, {attempts} do',props:{attempts:'3'},propsMeta:{attempts:['Attempts','number','socket']},children:true},
  datastore_auto_save:{type:'datastore',label:'salvar automaticamente a cada [segundos]',icon:'💾',template:'while task.wait({seconds}) do',props:{seconds:'60'},propsMeta:{seconds:['Seconds','number','socket']},children:true},
  datastore_save_on_player_leaving:{type:'datastore',label:'salvar dados quando [player] sair',icon:'⚡',template:'Players.PlayerRemoving:Connect(function({player})',props:{player:'player'},propsMeta:{player:['Player','text','socket']},children:true},
  datastore_save_on_server_close:{type:'datastore',label:'salvar dados quando o servidor fechar',icon:'⚡',template:'game:BindToClose(function()',children:true},
  input_pressed:{type:'input',label:'Input pressed',icon:'⌨',template:'UserInputService.InputBegan:Connect(function(input, gameProcessedEvent)',props:{inputName:'"E"'},propsMeta:{inputName:['Key','text']},children:true},
  input_service:{type:'input',label:'UserInputService',icon:'🎮',template:'game:GetService("UserInputService")'},
  input_began:{type:'input',label:'UserInputService.InputBegan',icon:'⚡',template:'UserInputService.InputBegan',children:true},
  input_changed:{type:'input',label:'UserInputService.InputChanged',icon:'⚡',template:'UserInputService.InputChanged',children:true},
  input_ended:{type:'input',label:'UserInputService.InputEnded',icon:'⚡',template:'UserInputService.InputEnded',children:true},
  input_is_key_down:{type:'input',label:'UserInputService:IsKeyDown([tecla])',icon:'🎮',template:'UserInputService:IsKeyDown({key})',props:{key:'Enum.KeyCode.E'},propsMeta:{key:['Key','text','socket']}},
  input_is_mouse_button_pressed:{type:'input',label:'UserInputService:IsMouseButtonPressed([botão])',icon:'🎮',template:'UserInputService:IsMouseButtonPressed({button})',props:{button:'Enum.UserInputType.MouseButton1'},propsMeta:{button:['Button','text','socket']}},
  input_get_mouse_location:{type:'input',label:'UserInputService:GetMouseLocation()',icon:'🎮',template:'UserInputService:GetMouseLocation()'},
  input_mouse_behavior:{type:'input',label:'UserInputService.MouseBehavior',icon:'🎮',template:'UserInputService.MouseBehavior'},
  input_mouse_icon_enabled:{type:'input',label:'UserInputService.MouseIconEnabled',icon:'🎮',template:'UserInputService.MouseIconEnabled'},
  input_keyboard_enabled:{type:'input',label:'UserInputService.KeyboardEnabled',icon:'🎮',template:'UserInputService.KeyboardEnabled'},
  input_mouse_enabled:{type:'input',label:'UserInputService.MouseEnabled',icon:'🎮',template:'UserInputService.MouseEnabled'},
  input_gamepad_enabled:{type:'input',label:'UserInputService.GamepadEnabled',icon:'🎮',template:'UserInputService.GamepadEnabled'},
  input_touch_enabled:{type:'input',label:'UserInputService.TouchEnabled',icon:'🎮',template:'UserInputService.TouchEnabled'},
  input_key_code:{type:'input',label:'[input].KeyCode',icon:'🎮',template:'{input}.KeyCode',props:{input:'input'},propsMeta:{input:['Input','text','socket']}},
  input_user_input_type:{type:'input',label:'[input].UserInputType',icon:'🎮',template:'{input}.UserInputType',props:{input:'input'},propsMeta:{input:['Input','text','socket']}},
  input_position:{type:'input',label:'[input].Position',icon:'🎮',template:'{input}.Position',props:{input:'input'},propsMeta:{input:['Input','text','socket']}},
  input_delta:{type:'input',label:'[input].Delta',icon:'🎮',template:'{input}.Delta',props:{input:'input'},propsMeta:{input:['Input','text','socket']}},
  input_changed_signal:{type:'input',label:'[input].Changed',icon:'⚡',template:'{input}.Changed',props:{input:'input'},propsMeta:{input:['Input','text','socket']},children:true},
  context_action_bind_action:{type:'input',label:'ContextActionService:BindAction([nome], [função], [touch], [teclas])',icon:'🎮',template:'ContextActionService:BindAction({name}, {functionName}, {touch}, {keys})',props:{name:'"Action"',functionName:'onAction',touch:'true',keys:'Enum.KeyCode.E'},propsMeta:{name:['Name','text','socket'],functionName:['Function','text','socket'],touch:['Touch','boolean','socket'],keys:['Keys','text','socket']}},
  context_action_bind_action_priority:{type:'input',label:'ContextActionService:BindActionAtPriority([nome], [prioridade], [função], [touch], [teclas])',icon:'🎮',template:'ContextActionService:BindActionAtPriority({name}, {priority}, {functionName}, {touch}, {keys})',props:{name:'"Action"',priority:'1',functionName:'onAction',touch:'true',keys:'Enum.KeyCode.E'},propsMeta:{name:['Name','text','socket'],priority:['Priority','number','socket'],functionName:['Function','text','socket'],touch:['Touch','boolean','socket'],keys:['Keys','text','socket']}},
  context_action_unbind_action:{type:'input',label:'ContextActionService:UnbindAction([nome])',icon:'🎮',template:'ContextActionService:UnbindAction({name})',props:{name:'"Action"'},propsMeta:{name:['Name','text','socket']}},
  context_action_unbind_all_actions:{type:'input',label:'ContextActionService:UnbindAllActions()',icon:'🎮',template:'ContextActionService:UnbindAllActions()'},
  context_action_set_title:{type:'input',label:'ContextActionService:SetTitle([nome], [texto])',icon:'🎮',template:'ContextActionService:SetTitle({name}, {text})',props:{name:'"Action"',text:'"Action"'},propsMeta:{name:['Name','text','socket'],text:['Text','text','socket']}},
  context_action_set_position:{type:'input',label:'ContextActionService:SetPosition([nome], [posição])',icon:'🎮',template:'ContextActionService:SetPosition({name}, {position})',props:{name:'"Action"',position:'UDim2.fromScale(0.5, 0.5)'},propsMeta:{name:['Name','text','socket'],position:['Position','text','socket']}},
  enum_key_code:{type:'input',label:'Enum.KeyCode.[tecla]',icon:'🎮',template:'Enum.KeyCode.{key}',props:{key:'E'},propsMeta:{key:['Key','text','socket']}},
  enum_user_input_type:{type:'input',label:'Enum.UserInputType.[tipo]',icon:'🎮',template:'Enum.UserInputType.{inputType}',props:{inputType:'Keyboard'},propsMeta:{inputType:['Type','text','socket']}},
  teleport_to:{type:'teleport',label:'Teleport to',icon:'✈',template:'{character}:PivotTo(CFrame.new({x}, {y}, {z}))',props:{character:'player.Character',x:'0',y:'5',z:'0'},propsMeta:{character:['Character','text','socket'],x:['X','number','socket'],y:['Y','number','socket'],z:['Z','number','socket']}}
};
const advancedBlock=(label,template,props,propsMeta,children=false)=>({type:'advanced',label,icon:'🔴',template,...(props?{props,propsMeta}:{}),...(children?{children:true}:{})});
Object.assign(definitions,{
  advanced_local_variable:advancedBlock('local [variável] = [valor]','local {variable} = {value}',{variable:'value',value:'nil'},{variable:['Variable','text','socket'],value:['Value','text','socket']}),
  advanced_local_function:advancedBlock('local function [nome]([parâmetros])','local function {name}({parameters})',{name:'myFunction',parameters:'...'}, {name:['Name','text','socket'],parameters:['Parameters','text','socket']},true),
  advanced_function:advancedBlock('function [nome]([parâmetros])','function {name}({parameters})',{name:'myFunction',parameters:'...'}, {name:['Name','text','socket'],parameters:['Parameters','text','socket']},true),
  advanced_return:advancedBlock('return [valor]','return {value}',{value:'value'},{value:['Value','text','socket']}),
  advanced_do:advancedBlock('do ... end','do',undefined,undefined,true),
  advanced_if:advancedBlock('if ... then ... end','if {condition} then',{condition:'condition'},{condition:['Condition','text','socket']},true),
  advanced_if_else:advancedBlock('if ... then ... else ... end','if {condition} then',{condition:'condition'},{condition:['Condition','text','socket']},true),
  advanced_for_numeric:advancedBlock('for [i] = [início], [fim] do','for {index} = {start}, {finish} do',{index:'i',start:'1',finish:'10'},{index:['Index','text','socket'],start:['Start','number','socket'],finish:['Finish','number','socket']},true),
  advanced_for_pairs:advancedBlock('for [chave], [valor] in pairs([tabela]) do','for {key}, {value} in pairs({table}) do',{key:'key',value:'value',table:'items'},{key:['Key','text','socket'],value:['Value','text','socket'],table:['Table','text','socket']},true),
  advanced_for_ipairs:advancedBlock('for [índice], [valor] in ipairs([tabela]) do','for {index}, {value} in ipairs({table}) do',{index:'index',value:'value',table:'items'},{index:['Index','text','socket'],value:['Value','text','socket'],table:['Table','text','socket']},true),
  advanced_while:advancedBlock('while [condição] do','while {condition} do',{condition:'condition'},{condition:['Condition','text','socket']},true),
  advanced_repeat:advancedBlock('repeat ... until [condição]','repeat until {condition}',{condition:'condition'},{condition:['Condition','text','socket']},true),
  advanced_break:advancedBlock('break','break'),
  advanced_continue:advancedBlock('continue','continue'),
  advanced_task_wait:advancedBlock('task.wait([segundos])','task.wait({seconds})',{seconds:'1'},{seconds:['Seconds','number','socket']}),
  advanced_task_spawn:advancedBlock('task.spawn([função])','task.spawn({functionName})',{functionName:'myFunction'},{functionName:['Function','text','socket']}),
  advanced_task_defer:advancedBlock('task.defer([função])','task.defer({functionName})',{functionName:'myFunction'},{functionName:['Function','text','socket']}),
  advanced_task_delay:advancedBlock('task.delay([segundos], [função])','task.delay({seconds}, {functionName})',{seconds:'1',functionName:'myFunction'},{seconds:['Seconds','number','socket'],functionName:['Function','text','socket']}),
  advanced_task_cancel:advancedBlock('task.cancel([thread])','task.cancel({thread})',{thread:'thread'},{thread:['Thread','text','socket']}),
  advanced_coroutine_create:advancedBlock('coroutine.create([função])','coroutine.create({functionName})',{functionName:'myFunction'},{functionName:['Function','text','socket']}),
  advanced_coroutine_resume:advancedBlock('coroutine.resume([coroutine], [argumentos])','coroutine.resume({coroutine}, {arguments})',{coroutine:'co',arguments:'...'}, {coroutine:['Coroutine','text','socket'],arguments:['Arguments','text','socket']}),
  advanced_coroutine_yield:advancedBlock('coroutine.yield()','coroutine.yield()'),
  advanced_coroutine_wrap:advancedBlock('coroutine.wrap([função])','coroutine.wrap({functionName})',{functionName:'myFunction'},{functionName:['Function','text','socket']}),
  advanced_coroutine_status:advancedBlock('coroutine.status([coroutine])','coroutine.status({coroutine})',{coroutine:'co'},{coroutine:['Coroutine','text','socket']}),
  advanced_pcall:advancedBlock('pcall([função])','pcall({functionName})',{functionName:'myFunction'},{functionName:['Function','text','socket']}),
  advanced_xpcall:advancedBlock('xpcall([função], [tratamento])','xpcall({functionName}, {handler})',{functionName:'myFunction',handler:'handleError'},{functionName:['Function','text','socket'],handler:['Handler','text','socket']}),
  advanced_error:advancedBlock('error([mensagem])','error({message})',{message:'"Error"'},{message:['Message','text','socket']}),
  advanced_assert:advancedBlock('assert([condição], [mensagem])','assert({condition}, {message})',{condition:'condition',message:'"Invalid"'},{condition:['Condition','text','socket'],message:['Message','text','socket']}),
  advanced_warn:advancedBlock('warn([mensagem])','warn({message})',{message:'"Warning"'},{message:['Message','text','socket']}),
  advanced_print:advancedBlock('print([valores])','print({values})',{values:'value'},{values:['Values','text','socket']}),
  advanced_typeof:advancedBlock('typeof([valor])','typeof({value})',{value:'value'},{value:['Value','text','socket']}),
  advanced_type:advancedBlock('type([valor])','type({value})',{value:'value'},{value:['Value','text','socket']}),
  advanced_tostring:advancedBlock('tostring([valor])','tostring({value})',{value:'value'},{value:['Value','text','socket']}),
  advanced_tonumber:advancedBlock('tonumber([valor])','tonumber({value})',{value:'value'},{value:['Value','text','socket']}),
  advanced_select:advancedBlock('select([índice], [argumentos])','select({index}, {arguments})',{index:'1',arguments:'...'},{index:['Index','number','socket'],arguments:['Arguments','text','socket']}),
  advanced_unpack:advancedBlock('unpack([tabela])','table.unpack({table})',{table:'items'},{table:['Table','text','socket']}),
  advanced_table_insert:advancedBlock('table.insert([tabela], [valor])','table.insert({table}, {value})',{table:'items',value:'value'},{table:['Table','text','socket'],value:['Value','text','socket']}),
  advanced_table_remove:advancedBlock('table.remove([tabela], [índice])','table.remove({table}, {index})',{table:'items',index:'1'},{table:['Table','text','socket'],index:['Index','number','socket']}),
  advanced_table_sort:advancedBlock('table.sort([tabela])','table.sort({table})',{table:'items'},{table:['Table','text','socket']}),
  advanced_table_concat:advancedBlock('table.concat([tabela], [separador])','table.concat({table}, {separator})',{table:'items',separator:'", "'},{table:['Table','text','socket'],separator:['Separator','text','socket']}),
  advanced_table_find:advancedBlock('table.find([tabela], [valor])','table.find({table}, {value})',{table:'items',value:'value'},{table:['Table','text','socket'],value:['Value','text','socket']}),
  advanced_table_clone:advancedBlock('table.clone([tabela])','table.clone({table})',{table:'items'},{table:['Table','text','socket']}),
  advanced_table_clear:advancedBlock('table.clear([tabela])','table.clear({table})',{table:'items'},{table:['Table','text','socket']}),
  advanced_string_upper:advancedBlock('string.upper([texto])','string.upper({text})',{text:'text'},{text:['Text','text','socket']}),
  advanced_string_lower:advancedBlock('string.lower([texto])','string.lower({text})',{text:'text'},{text:['Text','text','socket']}),
  advanced_string_sub:advancedBlock('string.sub([texto], [início], [fim])','string.sub({text}, {start}, {finish})',{text:'text',start:'1',finish:'10'},{text:['Text','text','socket'],start:['Start','number','socket'],finish:['Finish','number','socket']}),
  advanced_string_find:advancedBlock('string.find([texto], [padrão])','string.find({text}, {pattern})',{text:'text',pattern:'pattern'},{text:['Text','text','socket'],pattern:['Pattern','text','socket']}),
  advanced_string_match:advancedBlock('string.match([texto], [padrão])','string.match({text}, {pattern})',{text:'text',pattern:'pattern'},{text:['Text','text','socket'],pattern:['Pattern','text','socket']}),
  advanced_string_gsub:advancedBlock('string.gsub([texto], [padrão], [substituição])','string.gsub({text}, {pattern}, {replacement})',{text:'text',pattern:'pattern',replacement:'replacement'},{text:['Text','text','socket'],pattern:['Pattern','text','socket'],replacement:['Replacement','text','socket']}),
  advanced_string_split:advancedBlock('string.split([texto], [separador])','string.split({text}, {separator})',{text:'text',separator:'", "'},{text:['Text','text','socket'],separator:['Separator','text','socket']}),
  advanced_string_format:advancedBlock('string.format([formato], [argumentos])','string.format({format}, {arguments})',{format:'"%s"',arguments:'value'},{format:['Format','text','socket'],arguments:['Arguments','text','socket']}),
  advanced_metatable:advancedBlock('metatable','metatable'),
  advanced_setmetatable:advancedBlock('setmetatable([tabela], [metatable])','setmetatable({table}, {metatable})',{table:'items',metatable:'meta'},{table:['Table','text','socket'],metatable:['Metatable','text','socket']}),
  advanced_getmetatable:advancedBlock('getmetatable([tabela])','getmetatable({table})',{table:'items'},{table:['Table','text','socket']}),
  advanced_index:advancedBlock('__index','__index'),
  advanced_newindex:advancedBlock('__newindex','__newindex'),
  advanced_tostring_metamethod:advancedBlock('__tostring','__tostring'),
  advanced_call:advancedBlock('__call','__call'),
  advanced_add:advancedBlock('__add','__add'),
  advanced_sub:advancedBlock('__sub','__sub'),
  advanced_mul:advancedBlock('__mul','__mul'),
  advanced_div:advancedBlock('__div','__div'),
  advanced_eq:advancedBlock('__eq','__eq'),
  advanced_lt:advancedBlock('__lt','__lt'),
  advanced_le:advancedBlock('__le','__le'),
  advanced_export_type:advancedBlock('export type [nome] = [tipo]','export type {name} = {typeName}',{name:'PlayerData',typeName:'{ [string]: any }'},{name:['Name','text','socket'],typeName:['Type','text','socket']}),
  advanced_type_alias:advancedBlock('type [nome] = [tipo]','type {name} = {typeName}',{name:'PlayerData',typeName:'string'},{name:['Name','text','socket'],typeName:['Type','text','socket']}),
  advanced_type_assertion:advancedBlock('[variável] :: [tipo]','{variable} :: {typeName}',{variable:'value',typeName:'string'},{variable:['Variable','text','socket'],typeName:['Type','text','socket']}),
  advanced_as_type:advancedBlock('as [tipo]','{value} :: {typeName}',{value:'value',typeName:'string'},{value:['Value','text','socket'],typeName:['Type','text','socket']}),
  advanced_require:advancedBlock('require([ModuleScript])','require({module})',{module:'script.ModuleScript'},{module:['ModuleScript','text','socket']}),
  advanced_module_script:advancedBlock('ModuleScript','ModuleScript'),
  advanced_module_return:advancedBlock('module retorna [valor]','return {value}',{value:'module'},{value:['Value','text','socket']}),
  advanced_script:advancedBlock('script','script'),
  advanced_script_parent:advancedBlock('script.Parent','script.Parent'),
  advanced_script_name:advancedBlock('script.Name','script.Name'),
  advanced_script_full_name:advancedBlock('script:GetFullName()','script:GetFullName()'),
  advanced_global:advancedBlock('_G.[nome]','_G.{name}',{name:'value'},{name:['Name','text','socket']}),
  advanced_shared:advancedBlock('shared.[nome]','shared.{name}',{name:'value'},{name:['Name','text','socket']}),
  advanced_enum:advancedBlock('Enum.[tipo].[valor]','Enum.{enumType}.{value}',{enumType:'KeyCode',value:'E'},{enumType:['Type','text','socket'],value:['Value','text','socket']}),
  advanced_vector3_new:advancedBlock('Vector3.new([x], [y], [z])','Vector3.new({x}, {y}, {z})',{x:'0',y:'0',z:'0'},{x:['X','number','socket'],y:['Y','number','socket'],z:['Z','number','socket']}),
  advanced_cframe_new:advancedBlock('CFrame.new([x], [y], [z])','CFrame.new({x}, {y}, {z})',{x:'0',y:'0',z:'0'},{x:['X','number','socket'],y:['Y','number','socket'],z:['Z','number','socket']}),
  advanced_cframe_angles:advancedBlock('CFrame.Angles([x], [y], [z])','CFrame.Angles({x}, {y}, {z})',{x:'0',y:'0',z:'0'},{x:['X','number','socket'],y:['Y','number','socket'],z:['Z','number','socket']}),
  advanced_color3_new:advancedBlock('Color3.new([r], [g], [b])','Color3.new({r}, {g}, {b})',{r:'1',g:'1',b:'1'},{r:['R','number','socket'],g:['G','number','socket'],b:['B','number','socket']}),
  advanced_color3_rgb:advancedBlock('Color3.fromRGB([r], [g], [b])','Color3.fromRGB({r}, {g}, {b})',{r:'255',g:'255',b:'255'},{r:['R','number','socket'],g:['G','number','socket'],b:['B','number','socket']}),
  advanced_udim2_new:advancedBlock('UDim2.new([xScale], [xOffset], [yScale], [yOffset])','UDim2.new({xScale}, {xOffset}, {yScale}, {yOffset})',{xScale:'0',xOffset:'0',yScale:'0',yOffset:'0'},{xScale:['X Scale','number','socket'],xOffset:['X Offset','number','socket'],yScale:['Y Scale','number','socket'],yOffset:['Y Offset','number','socket']}),
  advanced_brickcolor_new:advancedBlock('BrickColor.new([cor])','BrickColor.new({color})',{color:'"Bright red"'},{color:['Color','text','socket']}),
  advanced_raycast_params_new:advancedBlock('RaycastParams.new()','RaycastParams.new()'),
  advanced_overlap_params_new:advancedBlock('OverlapParams.new()','OverlapParams.new()'),
  advanced_tween_info_new:advancedBlock('TweenInfo.new([tempo])','TweenInfo.new({time})',{time:'1'},{time:['Time','number','socket']}),
  advanced_number_sequence_new:advancedBlock('NumberSequence.new([valor])','NumberSequence.new({value})',{value:'0'},{value:['Value','number','socket']}),
  advanced_number_range_new:advancedBlock('NumberRange.new([mínimo], [máximo])','NumberRange.new({minimum}, {maximum})',{minimum:'0',maximum:'1'},{minimum:['Minimum','number','socket'],maximum:['Maximum','number','socket']}),
  advanced_region3_new:advancedBlock('Region3.new([min], [max])','Region3.new({minimum}, {maximum})',{minimum:'Vector3.zero',maximum:'Vector3.one'},{minimum:['Min','text','socket'],maximum:['Max','text','socket']}),
  advanced_datetime_now:advancedBlock('DateTime.now()','DateTime.now()'),
  advanced_os_time:advancedBlock('os.time()','os.time()'),
  advanced_os_date:advancedBlock('os.date([formato])','os.date({format})',{format:'"!*t"'},{format:['Format','text','socket']}),
  advanced_tick:advancedBlock('tick()','tick()'),
  advanced_time:advancedBlock('time()','time()'),
  advanced_elapsed_time:advancedBlock('elapsedTime()','elapsedTime()'),
  advanced_profile_begin:advancedBlock('debug.profilebegin([nome])','debug.profilebegin({name})',{name:'"Profile"'},{name:['Name','text','socket']}),
  advanced_profile_end:advancedBlock('debug.profileend()','debug.profileend()')
});
const visualDefinitions=normalizeVisualCatalog(definitions);
const libraryOrder=Object.keys(definitions);
const englishLabels={
  player_joined:'player joined',
  when_game_starts:'when game starts',
  when_player_joined:'when player joins',
  when_player_left:'when player leaves',
  when_player_died:'when player dies',
  when_character_spawned:'when character spawns',
  when_object_touched:'when object is touched',
  when_object_stopped_touching:'when object stops being touched',
  when_button_clicked:'when button is clicked',
  when_object_activated:'when [object] is activated',
  when_key_pressed:'when key is pressed',
  when_key_released:'when key is released',
  when_tool_used:'when tool is used',
  when_animation_finished:'when animation finishes',
  when_sound_finished:'when sound finishes',
  when_remote_event_received:'when remote event is received',
  when_variable_changed:'when variable changes',
  every_second:'every second',
  every_frame:'every frame',
  wait:'wait',
  if_block:'if',
  if_else_block:'if / else',
  else_if_block:'else if',
  else_block:'else',
  while_block:'while',
  repeat_block:'repeat',
  for_block:'for',
  for_each_block:'for each',
  repeat_until_block:'repeat until',
  wait_until_block:'wait until',
  break_block:'break',
  continue_block:'continue',
  return_value_block:'return value',
  return_block:'return',
  try_block:'try',
  catch_block:'catch',
  finally_block:'finally',
  execute_block:'execute code',
  stop_script_block:'stop this script',
  function_block:'function name()',
  function_one_parameter_block:'function name(parameter)',
  function_two_parameters_block:'function name(parameter 1, parameter 2)',
  function_return_value_block:'return value',
  function_return_block:'return',
  call_function_block:'call function()',
  call_function_arguments_block:'call function(arguments)',
  create_function_block:'create function',
  add_parameter_block:'add parameter',
  add_return_block:'add return',
  anonymous_function_block:'anonymous function',
  anonymous_function_parameters_block:'anonymous function(parameters)',
  local_function_block:'local function',
  function_returns_block:'function returns',
  function_receives_block:'function receives',
  set_variable:'set variable',
  local_set_variable:'local variable = value',
  compound_variable:'compound assignment',
  create_variable:'create variable',
  delete_variable:'delete variable',
  use_variable:'use variable',
  show_variable:'show variable',
  print_block:'print',
  define_variable:'define variable',
  change_variable:'change variable by',
  rename_variable:'rename variable',
  local_variable:'local variable',
  global_variable:'global variable',
  nil_variable:'variable = nil',
  variable_type:'variable type',
  object_reference:'object',
  text_value:'text value',
  number_value:'number value',
  boolean_value:'boolean',
  comparison_block:'comparison',
  and_block:'and',
  or_block:'or',
  not_block:'not',
  arithmetic_block:'arithmetic',
  logical_comparison_block:'comparison',
  logical_operator_block:'logical operator',
  unary_operator_block:'unary operator',
  typeof_block:'type of',
  is_nil_block:'is nil',
  is_true_block:'is true',
  concatenate_block:'concatenate',
  length_block:'length',
  math_unary_block:'math function',
  math_random_block:'math.random()',
  math_random_range_block:'math.random range',
  math_binary_block:'math function',
  move_object_to:'move object to',
  move_object_by:'move object by',
  walk_steps:'walk steps',
  move_part_by:'move part by',
  teleport_object_to:'teleport object to',
  rotate_object_by:'rotate object by',
  point_object_to:'point object to',
  look_at:'look at',
  follow:'follow',
  push:'push',
  apply_velocity:'apply velocity',
  stop_motion:'stop movement',
  set_color:'set color',
  set_property:'set property',
  set_walk_speed:'set walk speed',
  jump_character:'jump character',
  play_sound:'play sound',
  show_text:'show text',
  set_score:'set score',
  players_service:'game.Players',
  local_player:'Players.LocalPlayer',
  players_get_players:'Players:GetPlayers()',
  players_get_player_from_character:'Players:GetPlayerFromCharacter([character])',
  players_get_player_by_user_id:'Players:GetPlayerByUserId([userId])',
  players_player_added:'Players.PlayerAdded',
  players_player_removing:'Players.PlayerRemoving',
  player_name:'[player].Name',
  player_display_name:'[player].DisplayName',
  player_user_id:'[player].UserId',
  player_account_age:'[player].AccountAge',
  player_character:'[player].Character',
  player_team:'[player].Team',
  player_team_color:'[player].TeamColor',
  player_neutral:'[player].Neutral',
  player_character_added:'[player].CharacterAdded',
  player_character_removing:'[player].CharacterRemoving',
  player_load_character:'[player]:LoadCharacter()',
  player_kick:'[player]:Kick([message])',
  player_parent:'[player].Parent',
  get_character_from_player:'obter personagem de [player]',
  get_player_from_character:'obter jogador de [character]',
  get_player_by_user_id:'obter jogador por UserId [userId]',
  for_each_player_in_players_get_players:'para cada [player] em Players:GetPlayers()',
  input_pressed:'input pressed',
  teleport_to:'teleport to'
};
const portugueseLabels={
  player_joined:'jogador entrou',
  when_game_starts:'quando o jogo começar',
  when_player_joined:'quando jogador entrar',
  when_player_left:'quando jogador sair',
  when_player_died:'quando jogador morrer',
  when_character_spawned:'quando personagem nascer',
  when_object_touched:'quando objeto for tocado',
  when_object_stopped_touching:'quando objeto parar de ser tocado',
  when_button_clicked:'quando botão for clicado',
  when_object_activated:'quando [objeto] for ativado',
  when_key_pressed:'quando tecla for pressionada',
  when_key_released:'quando tecla for solta',
  when_tool_used:'quando ferramenta for usada',
  when_animation_finished:'quando animação terminar',
  when_sound_finished:'quando som terminar',
  when_remote_event_received:'quando evento remoto for recebido',
  when_variable_changed:'quando variável mudar',
  every_second:'a cada segundo',
  every_frame:'a cada frame',
  wait:'esperar',
  if_block:'se',
  if_else_block:'se / senão',
  else_if_block:'senão se',
  else_block:'senão',
  while_block:'enquanto',
  repeat_block:'repetir vezes',
  for_block:'para',
  for_each_block:'para cada',
  repeat_until_block:'repetir até',
  wait_until_block:'esperar até',
  break_block:'quebrar',
  continue_block:'continuar',
  return_value_block:'retornar valor',
  return_block:'retornar',
  try_block:'tentar',
  catch_block:'capturar erro',
  finally_block:'finalizar',
  execute_block:'executar código',
  stop_script_block:'parar este script',
  function_block:'função nome()',
  function_one_parameter_block:'função nome(parâmetro)',
  function_two_parameters_block:'função nome(parâmetro 1, parâmetro 2)',
  function_return_value_block:'retornar valor',
  function_return_block:'retornar',
  call_function_block:'chamar função()',
  call_function_arguments_block:'chamar função(argumentos)',
  create_function_block:'criar função',
  add_parameter_block:'adicionar parâmetro',
  add_return_block:'adicionar retorno',
  anonymous_function_block:'função anônima',
  anonymous_function_parameters_block:'função anônima(parâmetros)',
  local_function_block:'função local',
  function_returns_block:'função retorna',
  function_receives_block:'função recebe',
  set_variable:'definir variável',
  local_set_variable:'variável local = valor',
  compound_variable:'atribuição composta',
  create_variable:'criar variável',
  delete_variable:'deletar variável',
  use_variable:'usar variável',
  show_variable:'mostrar variável',
  print_block:'imprimir',
  define_variable:'definir variável',
  change_variable:'alterar variável por',
  rename_variable:'renomear variável',
  local_variable:'variável local',
  global_variable:'variável global',
  nil_variable:'variável = nil',
  variable_type:'tipo de variável',
  object_reference:'objeto',
  text_value:'valor de texto',
  number_value:'valor numérico',
  boolean_value:'booleano',
  comparison_block:'comparação',
  and_block:'e',
  or_block:'ou',
  not_block:'não',
  arithmetic_block:'aritmética',
  logical_comparison_block:'comparação',
  logical_operator_block:'operador lógico',
  unary_operator_block:'operador unário',
  typeof_block:'tipo de',
  is_nil_block:'é nil',
  is_true_block:'é verdadeiro',
  concatenate_block:'concatenar',
  length_block:'tamanho',
  math_unary_block:'função math',
  math_random_block:'math.random()',
  math_random_range_block:'math.random intervalo',
  math_binary_block:'função math',
  move_object_to:'mover objeto para',
  move_object_by:'mover objeto por',
  walk_steps:'andar passos',
  move_part_by:'mover parte por',
  teleport_object_to:'teleportar objeto para',
  rotate_object_by:'girar objeto em',
  point_object_to:'apontar objeto para',
  look_at:'olhar para',
  follow:'seguir',
  push:'empurrar',
  apply_velocity:'aplicar velocidade',
  stop_motion:'parar movimento',
  set_color:'definir cor',
  set_property:'definir propriedade',
  set_walk_speed:'definir velocidade',
  jump_character:'pular personagem',
  play_sound:'tocar som',
  show_text:'mostrar texto',
  set_score:'definir pontuação',
  players_service:'game.Players',
  local_player:'Players.LocalPlayer',
  players_get_players:'Players:GetPlayers()',
  players_get_player_from_character:'Players:GetPlayerFromCharacter([personagem])',
  players_get_player_by_user_id:'Players:GetPlayerByUserId([userId])',
  players_player_added:'Players.PlayerAdded',
  players_player_removing:'Players.PlayerRemoving',
  player_name:'[jogador].Name',
  player_display_name:'[jogador].DisplayName',
  player_user_id:'[jogador].UserId',
  player_account_age:'[jogador].AccountAge',
  player_character:'[jogador].Character',
  player_team:'[jogador].Team',
  player_team_color:'[jogador].TeamColor',
  player_neutral:'[jogador].Neutral',
  player_character_added:'[jogador].CharacterAdded',
  player_character_removing:'[jogador].CharacterRemoving',
  player_load_character:'[jogador]:LoadCharacter()',
  player_kick:'[jogador]:Kick([mensagem])',
  player_parent:'[jogador].Parent',
  get_character_from_player:'obter personagem de [jogador]',
  get_player_from_character:'obter jogador de [personagem]',
  get_player_by_user_id:'obter jogador por UserId [userId]',
  for_each_player_in_players_get_players:'para cada [jogador] em Players:GetPlayers()',
  input_pressed:'tecla pressionada',
  teleport_to:'teleportar para'
};
const portugueseCategories={
  events:'Eventos',
  control:'Controle',
  operators:'Operadores',
  variables:'Variáveis',
  functions:'Funções',
  players:'Players',
  character:'Character / Humanoid',
  objects:'Instance / Objetos',
  properties:'Propriedades',
  methods:'Métodos',
  sound:'Som',
  world:'Workspace / Mundo',
  input:'UserInput / Controles',
  multiplayer:'Multiplayer / RemoteEvents',
  admin:'Administração',
  debug:'Depuração',
  teams:'Teams / Leaderstats',
  tools:'Backpack / Tools',
  datastore:'DataStore',
  services:'Serviços Roblox',
  advanced:'Avançado / Luau'
};
let state={tree:[],selected:null,category:'events',zoom:100,grid:true,history:[],future:[],language:'en',inlineCode:true,theme:'light',generatedCode:''};
const $=id=>document.getElementById(id); const clone=o=>JSON.parse(JSON.stringify(o));
const blockRoot=createRoot($('treeRoot'));
const codeRoot=createRoot($('codeOutput'));
function renderBlockInput(node,key){const definition=definitions[node.type],meta=definition.propsMeta[key],value=node.properties[key],onChange=event=>updateBlockInput(node.id,key,event.target.value);if(meta[2]==='socket')return React.createElement('div',{key,className:`socket ${value&&typeof value==='object'?'socket-filled':''}`,'data-socket':node.id,'data-prop':key},value&&typeof value==='object'?renderVisualNode(value,true):String(value==null||value===''?meta[0]:value));if(meta[1]==='operator'||meta[1]==='type'||meta[1]==='boolean'){const options=meta[1]==='boolean'?['true','false']:meta[1]==='type'?['Número','Texto','Boolean']:(definition.operatorOptions||['=', '==', '>', '<', '>=', '<=', '!=', '~=']);return React.createElement('select',{key,'data-prop':key,value:value??'',onChange},options.map(option=>React.createElement('option',{key:option,value:option},option)))}return React.createElement('input',{key,type:meta[1]==='number'?'number':'text',step:meta[1]==='number'?'any':undefined,'data-prop':key,value:value??'','aria-label':meta[0],onChange})}
function updateBlockInput(nodeId,propertyId,value){if(VisualBlockTree.setProperty(state.tree,nodeId,propertyId,value))renderTree()}
function renderVisualNode(node,expression=false){const definition=definitions[node.type];return React.createElement(VisualBlockComponent,{key:`${node.id}-${expression?'expression':'block'}`,hasInputs:Object.keys(definition.propsMeta||{}).length>0,node,expression,renderBlock:props=>renderVisualNodeContent({...props,renderBlock:renderVisualNode})})}
function renderVisualNodeContent({node,expression,renderBlock}){const definition=definitions[node.type],visual=visualDefinitions[node.type],color=categories[definition.type].color,keys=Object.keys(definition.propsMeta||{}),label=labelFor(node.type),placeholder=/\[(?:objeto|object|target)\]/i,objectInputKey=keys.find(key=>definition.propsMeta[key][2]==='socket'&&(['object','target'].includes(key.toLowerCase())||['object','target'].includes(String(definition.propsMeta[key][0]).toLowerCase()))),placeholderMatch=objectInputKey&&label.match(placeholder);let labelContent=label;if(placeholderMatch)labelContent=React.createElement(React.Fragment,null,label.slice(0,placeholderMatch.index),renderBlockInput(node,objectInputKey),label.slice(placeholderMatch.index+placeholderMatch[0].length));const inputs=keys.filter(key=>!(placeholderMatch&&key===objectInputKey)).map(key=>renderBlockInput(node,key));const block=React.createElement('div',{className:`block category-${definition.type} block-kind-${visual.kind.toLowerCase()} ${definition.type==='event'?'event':''} ${expression?'expression-block':''} ${state.selected===node.id?'selected':''}`,style:{background:color},draggable:true},React.createElement('span',{className:'block-icon'},definition.icon),React.createElement('div',{className:'block-label'},labelContent),...inputs,React.createElement('button',{className:'delete-mini','data-delete':node.id,title:'Excluir'},'×'));const children=definition.children?React.createElement('div',{className:'nested','data-parent':node.id},(node.children||[]).map(child=>renderBlock(child))):null;const inlineCode=!expression&&state.inlineCode?React.createElement('code',{className:'inline-code'},expressionCode(node)):null;return React.createElement(React.Fragment,null,React.createElement('div',{className:`block-wrap ${expression?'expression-wrap':''} ${state.selected===node.id?'selected':''} ${validate().some(error=>error.id===node.id)?'has-error':''}`,'data-id':node.id,'data-kind':visual.kind},block,children,inlineCode),node.next?renderBlock(node.next):null)}
class VisualTreeCanvas extends React.Component{componentDidMount(){this.props.onCommit()}componentDidUpdate(){this.props.onCommit()}render(){return this.props.tree.map(node=>renderVisualNode(node))}}
function renderReactTree(){const count=countNodes(state.tree);$('dropHint').style.display=count?'none':'flex';$('blockCount').textContent=`${count} bloco${count===1?'':'s'}`;blockRoot.render(React.createElement(VisualTreeCanvas,{tree:state.tree,onCommit:()=>{bindTree();document.querySelectorAll('#canvas [data-prop]').forEach(input=>{input.oninput=null});updateCode()}}))}
function labelFor(key){return state.language==='pt'?(portugueseLabels[key]||definitions[key]?.label||key):(englishLabels[key]||definitions[key]?.label||key)}
function categoryLabel(key){return state.language==='pt'?(portugueseCategories[key]||categories[key].label):categories[key].label}
function snapshot(){state.history.push(clone(state.tree));if(state.history.length>30)state.history.shift();state.future=[]}
function makeNode(key){const d=definitions[key];return VisualBlockTree.createNode(visualDefinitions[key],clone(d.props||{}))}
function findNode(list,id){return VisualBlockTree.find(list,id)}
function getColor(key){return categories[categoryForType(definitions[key].type)].color}
const typingGame={current:'',input:'',score:0,correct:0,wrong:0,totalTyped:0,streak:0,comboHits:0,startTime:0,running:false,timer:null};
const typingAudio={ctx:null,memeFiles:[],memeCache:[],refreshTimer:null,muted:false,volume:0.7};
const defaultMemeFiles=['memes/faaah.mp3','memes/la-ele.mp3','memes/levelup.mp3','memes/oh-my-god-meme.mp3'];
function normalizeMemePath(value){if(!value)return'';const clean=value.trim().replace(/^\.\//,'');if(/^https?:\/\//i.test(clean))return clean;if(clean.startsWith('/'))return clean;return clean.startsWith('memes/')?clean:`memes/${clean}`}
function updateTypingVolumeUi(){const valueNode=$('typingVolumeValue');const muteBtn=$('muteTypingBtn');if(valueNode){const percent=Math.round(typingAudio.volume*100);valueNode.textContent=`${percent}%`;}
if(muteBtn){muteBtn.textContent=typingAudio.muted ? '🔇' : '🔊';muteBtn.title=typingAudio.muted ? 'Ativar som' : 'Silenciar';}
const pool=getMemeAudioPool();pool.forEach(audio=>{audio.volume = (typingAudio.muted ? 0 : typingAudio.volume) * 0.85;})}
function setTypingVolume(nextVolume){const clamped=Math.min(1,Math.max(0,nextVolume));typingAudio.volume=clamped;typingAudio.muted = typingAudio.volume === 0;updateTypingVolumeUi();}
function toggleTypingMute(){typingAudio.muted=!typingAudio.muted;if(typingAudio.volume===0 && !typingAudio.muted) typingAudio.volume=0.7;updateTypingVolumeUi();}
async function refreshMemeLibrary(){
  try {
    const response = await fetch('memes/', {cache:'no-store'});
    if (!response.ok) throw new Error(`Falha ao carregar pasta /memes (${response.status})`);
    const html = await response.text();
    const matches = [...html.matchAll(/href=["']([^"']+\.(?:mp3|wav|ogg|m4a|aac|webm))["']/gi)].map(match => match[1]);
    const discovered = [...new Set(matches.map(normalizeMemePath).filter(Boolean))];
    if (discovered.length) {
      typingAudio.memeFiles = discovered;
      typingAudio.memeCache = [];
      return typingAudio.memeFiles;
    }
  } catch (error) {
    console.warn('Não foi possível atualizar a lista de memes da pasta:', error);
  }
  typingAudio.memeFiles = defaultMemeFiles;
  typingAudio.memeCache = [];
  return typingAudio.memeFiles;
}
function startMemeLibraryRefreshLoop(){if(typingAudio.refreshTimer)return;typingAudio.refreshTimer=setInterval(()=>{refreshMemeLibrary().catch(()=>{})},4000)}
function getTypingAudio(){if(!typingAudio.ctx){const Ctx=window.AudioContext||window.webkitAudioContext;typingAudio.ctx=Ctx?new Ctx():null}return typingAudio.ctx}
function playTypingTone(freq,type,duration,volume){const ctx=getTypingAudio();if(!ctx)return;const osc=ctx.createOscillator();const gain=ctx.createGain();osc.type=type;osc.frequency.value=freq;gain.gain.value=(typingAudio.muted ? 0 : typingAudio.volume) * volume;osc.connect(gain);gain.connect(ctx.destination);osc.start();osc.stop(ctx.currentTime+duration);gain.gain.exponentialRampToValueAtTime(0.0001,ctx.currentTime+duration)}
function playTypingSuccess(){playTypingTone(660,'triangle',0.08,0.05);setTimeout(()=>playTypingTone(880,'triangle',0.1,0.05),80)}
function playTypingError(){playTypingTone(220,'sawtooth',0.12,0.05);setTimeout(()=>playTypingTone(180,'square',0.12,0.04),80)}
function getMemeAudioPool(){if(!typingAudio.memeFiles.length){typingAudio.memeFiles=[...defaultMemeFiles];}if(typingAudio.memeCache.length===typingAudio.memeFiles.length&&typingAudio.memeCache.length>0)return typingAudio.memeCache;typingAudio.memeCache=typingAudio.memeFiles.map(file=>{const audio=new Audio(file);audio.preload='auto';audio.volume=(typingAudio.muted ? 0 : typingAudio.volume)*0.85;audio.load();return audio});return typingAudio.memeCache}
function playComboMemeSound(){const pool=getMemeAudioPool();if(pool.length){const uniqueSources=[...new Set(pool.map(item=>item.src || item.currentSrc || ''))].filter(Boolean);const source = uniqueSources[Math.floor(Math.random()*uniqueSources.length)];if(!source)return;const audio=new Audio(source);audio.preload='auto';audio.volume=(typingAudio.muted ? 0 : typingAudio.volume)*0.85;audio.load();audio.currentTime=0;audio.play().catch(()=>{});return}const ctx=getTypingAudio();if(!ctx)return;const memeIndex=Math.floor(Math.random()*3);const now=ctx.currentTime;if(memeIndex===0){const osc=ctx.createOscillator();const gain=ctx.createGain();osc.type='sawtooth';osc.frequency.setValueAtTime(180,now);osc.frequency.exponentialRampToValueAtTime(80,now+0.42);gain.gain.setValueAtTime(0.0001,now);gain.gain.exponentialRampToValueAtTime(0.12,now+0.02);gain.gain.exponentialRampToValueAtTime(0.0001,now+0.5);osc.connect(gain);gain.connect(ctx.destination);osc.start(now);osc.stop(now+0.5);setTimeout(()=>playTypingTone(120,'triangle',0.12,0.08),80);setTimeout(()=>playTypingTone(90,'triangle',0.18,0.07),170);}else if(memeIndex===1){const buffer=ctx.createBuffer(1,ctx.sampleRate*0.7,ctx.sampleRate);const data=buffer.getChannelData(0);for(let i=0;i<data.length;i++){const t=i/data.length;data[i]=(Math.random()*2-1)*Math.exp(-18*t);}const source=ctx.createBufferSource();const gain=ctx.createGain();source.buffer=buffer;gain.gain.setValueAtTime(0.0001,now);gain.gain.exponentialRampToValueAtTime(0.28,now+0.02);gain.gain.exponentialRampToValueAtTime(0.0001,now+0.7);source.connect(gain);gain.connect(ctx.destination);source.start(now);source.stop(now+0.7);setTimeout(()=>playTypingTone(50,'sine',0.2,0.1),40);setTimeout(()=>playTypingTone(35,'square',0.25,0.09),180);}else{[220,330,440,330,220].forEach((freq,idx)=>setTimeout(()=>playTypingTone(freq,'square',0.12,0.05),idx*90));}}
function getTypingChallengeSource(){
  const currentCode = generate();
  state.generatedCode = currentCode;
  const source = String(currentCode || '').trim();
  return source || '-- Arraste blocos para gerar código Luau';
}
function refreshTypingChallenge(forceReset=false){
  const source = getTypingChallengeSource();
  if (forceReset || typingGame.current !== source) {
    typingGame.current = source;
    typingGame.input = '';
    const input = document.getElementById('typingInput');
    if (input) {
      input.value = '';
      input.setSelectionRange(0, 0);
    }
    renderTypingPrompt();
  }
}
function openTypingHub(){
  document.getElementById('typingHub').classList.remove('hidden');
  refreshTypingChallenge(true);
  const input = document.getElementById('typingInput');
  if (input) {
    input.value = '';
    input.focus();
    input.setSelectionRange(0, 0);
  }
  if(!typingGame.running){setTypingStatus('Pronto para começar. Clique em iniciar.');}
}
function closeTypingHub(){document.getElementById('typingHub').classList.add('hidden');}
function renderTypingPrompt(){
  const prompt = document.getElementById('typingPrompt');
  const target = document.getElementById('typingTarget');
  const text = typingGame.current || '';
  const current = typingGame.input || '';

  function renderChars(includeCurrent=true){
    const spans = [];
    for (let i = 0; i < text.length; i++) {
      let cls = '';
      if (i < current.length) {
        cls = current[i] === text[i] ? 'correct' : 'wrong';
      } else if (includeCurrent && i === current.length) {
        cls = 'current';
      }
      spans.push(`<span class="char ${cls}">${escapeHtml(text[i])}</span>`);
    }
    return spans.join('') || '<span class="char current"> </span>';
  }

  if (target) {
    const fallback = '-- Arraste blocos para gerar código Luau';
    target.innerHTML = renderChars(false) || fallback;
  }

  if (!prompt) return;
  prompt.innerHTML = renderChars(true);
}
function updateTypingStats(){const elapsedSeconds=Math.max((Date.now()-typingGame.startTime)/1000,1);const wpm=Math.max(0,Math.round((typingGame.correct/5)/(elapsedSeconds/60)));const accuracy=typingGame.totalTyped>0?Math.max(0,Math.round((typingGame.correct/(typingGame.correct+typingGame.wrong))*100)):100;document.getElementById('typingScore').textContent=String(typingGame.score);document.getElementById('typingSpeed').textContent=`${wpm} WPM`;document.getElementById('typingAccuracy').textContent=`${accuracy}%`;}
function setTypingStatus(message){document.getElementById('typingStatus').textContent=message;}
function resetTypingGame(){
  const source = getTypingChallengeSource();
  typingGame.current = source;
  typingGame.input = '';
  typingGame.score = 0;
  typingGame.correct = 0;
  typingGame.wrong = 0;
  typingGame.totalTyped = 0;
  typingGame.streak = 0;
  typingGame.comboHits = 0;
  typingGame.startTime = Date.now();
  typingGame.running = false;
  clearInterval(typingGame.timer);
  typingGame.timer = setInterval(()=>{if(typingGame.running){updateTypingStats()}},250);
  renderTypingPrompt();
  updateTypingStats();
  setTypingStatus('Pronto para começar. Clique em iniciar.');
  const input = document.getElementById('typingInput');
  if (input) {
    input.value = '';
    input.setSelectionRange(0, 0);
  }
}
function startTypingGame(){
  if(typingGame.running){return;}
  const source = getTypingChallengeSource();
  typingGame.current = source;
  typingGame.input = '';
  typingGame.running = true;
  typingGame.startTime = Date.now();
  typingGame.score = Math.max(0, typingGame.score);
  setTypingStatus('Digite o código e mantenha o ritmo...');
  const input = document.getElementById('typingInput');
  if (input) {
    input.value = '';
    input.setSelectionRange(0, 0);
    input.focus();
  }
  renderTypingPrompt();
  updateTypingStats();
}
function advanceTypingChallenge(){
  const source = getTypingChallengeSource();
  typingGame.current = source;
  typingGame.input = '';
  const input = document.getElementById('typingInput');
  if (input) {
    input.value = '';
    input.setSelectionRange(0, 0);
  }
  renderTypingPrompt();
  setTypingStatus('Código atualizado.');
}
function handleTypingInput(event){
  if(!typingGame.running){startTypingGame();}
  const target = typingGame.current || '';
  let value = event.target.value;
  if(value.length > target.length){
    value = value.slice(0, target.length);
    event.target.value = value;
  }

  typingGame.input = value;
  let correctChars = 0;
  let wrongChars = 0;
  for(let i = 0; i < value.length; i++){
    if(value[i] === target[i]) correctChars++;
    else wrongChars++;
  }

  typingGame.totalTyped = value.length;
  typingGame.correct = correctChars;
  typingGame.wrong = wrongChars;

  if (wrongChars > 0) {
    typingGame.score = Math.max(0, typingGame.score - 2);
    typingGame.streak = 0;
    typingGame.comboHits = 0;
    setTypingStatus('Erro! Ajuste o código e continue.');
    playTypingError();
  } else if (value.length > 0) {
    const gained = 10 + typingGame.streak * 2;
    typingGame.score += gained;
    typingGame.streak += 1;
    typingGame.comboHits += 1;
    setTypingStatus(`Acerto! +${gained} pontos.`);
    playTypingSuccess();

    if (typingGame.streak >= 5) {
      typingGame.streak = 0;
      typingGame.comboHits = 0;
      typingGame.score += 50;
      setTypingStatus('Combo x5! +50 pontos bônus!');
      playComboMemeSound();
    }
  } else {
    typingGame.streak = 0;
    typingGame.comboHits = 0;
    setTypingStatus('Campo vazio. Digite para começar.');
  }

  if (value === target && target.length > 0) {
    typingGame.score += 100;
    setTypingStatus(`Código concluído! +100 pontos.`);
    playTypingSuccess();

    const panel = document.getElementById('typingPanel');
    const prompt = document.getElementById('typingPrompt');
    if (panel) {
      panel.classList.remove('typing-win');
      void panel.offsetWidth;
      panel.classList.add('typing-win');
      setTimeout(() => panel.classList.remove('typing-win'), 900);
    }
    if (prompt) {
      prompt.classList.remove('typing-win');
      void prompt.offsetWidth;
      prompt.classList.add('typing-win');
      setTimeout(() => prompt.classList.remove('typing-win'), 900);
    }

    setTimeout(() => {
      advanceTypingChallenge();
    }, 700);
    return;
  }

  renderTypingPrompt();
  updateTypingStats();
}
function bindTypingHub(){const openBtn=$('typingHubBtn');const closeBtn=$('closeTypingHub');const startBtn=$('startTypingBtn');const resetBtn=$('resetTypingBtn');const input=$('typingInput');const muteBtn=$('muteTypingBtn');const volumeDownBtn=$('volumeDownBtn');const volumeUpBtn=$('volumeUpBtn');if(openBtn)openBtn.onclick=openTypingHub;if(closeBtn)closeBtn.onclick=closeTypingHub;if(startBtn)startBtn.onclick=startTypingGame;if(resetBtn)resetBtn.onclick=resetTypingGame;if(muteBtn)muteBtn.onclick=toggleTypingMute;if(volumeDownBtn)volumeDownBtn.onclick=()=>setTypingVolume(typingAudio.volume - 0.1);if(volumeUpBtn)volumeUpBtn.onclick=()=>setTypingVolume(typingAudio.volume + 0.1);if(input){input.oninput=handleTypingInput;input.onkeydown=(event)=>{if(event.key==='Tab'){event.preventDefault();const start=input.selectionStart;const end=input.selectionEnd;const value=input.value;input.value=`${value.slice(0,start)}\t${value.slice(end)}`;input.selectionStart=input.selectionEnd=start+1;handleTypingInput({target:input});}};}document.addEventListener('keydown',e=>{if(e.key==='Escape' && $('typingHub') && !$('typingHub').classList.contains('hidden'))closeTypingHub();});updateTypingVolumeUi();}
function initializeMemeFeedback(){refreshMemeLibrary().catch(()=>{});startMemeLibraryRefreshLoop();}
function renderLibrary(){const tabs=Object.entries(categories).map(([key,c])=>`<button class="cat-tab ${state.category===key?'active':''}" data-cat="${key}">${categoryLabel(key)}</button>`).join('');$('categoryTabs').innerHTML=tabs;document.querySelectorAll('.cat-tab').forEach(b=>b.onclick=()=>{state.category=b.dataset.cat;renderLibrary()});const query=$('blockSearch').value.toLowerCase();const items=libraryOrder.filter(k=>categoryForType(definitions[k].type)===state.category&&labelFor(k).toLowerCase().includes(query));$('libraryList').innerHTML=items.map(key=>{const d=definitions[key],visual=visualDefinitions[key],c=categories[categoryForType(d.type)];const descriptor=visual.kind==='STRUCTURE'?(state.language==='pt'?'estrutura com corpo':'structure with body'):visual.kind==='EXPRESSION'?(state.language==='pt'?'expressão':'expression'):visual.kind==='VALUE'?(state.language==='pt'?'valor':'value'):(state.language==='pt'?'comando':'command');return`<div class="library-card" draggable="true" data-key="${key}"><div class="lib-icon" style="background:${c.color}">${d.icon}</div><div><strong>${labelFor(key)}</strong><span>${descriptor}</span></div></div>`}).join('');document.querySelectorAll('.library-card').forEach(card=>{card.ondragstart=e=>e.dataTransfer.setData('block-key',card.dataset.key)})}
function blockInputMarkup(node,key){const d=definitions[node.type],meta=d.propsMeta[key],value=node.properties[key];if(meta[2]==='socket')return`<div class="socket ${value&&typeof value==='object'?'socket-filled':''}" data-socket="${node.id}" data-prop="${key}">${value&&typeof value==='object'?blockMarkup(value,true):escapeHtml(value==null||value===''?meta[0]:value)}</div>`;if(meta[1]==='operator'||meta[1]==='type'||meta[1]==='boolean'){const options=meta[1]==='boolean'?['true','false']:meta[1]==='type'?['Número','Texto','Boolean']:(d.operatorOptions||['=', '==', '>', '<', '>=', '<=', '!=', '~=']);return`<select data-prop="${key}">${options.map(option=>`<option ${option===value?'selected':''}>${option}</option>`).join('')}</select>`}return`<input type="${meta[1]==='number'?'number':'text'}" ${meta[1]==='number'?'step="any"':''} data-prop="${key}" value="${escapeHtml(value??'')}" aria-label="${meta[0]}" />`}
function blockMarkup(node,expression=false){const d=definitions[node.type],visual=visualDefinitions[node.type],c=categories[d.type],keys=Object.keys(d.propsMeta||{}),label=labelFor(node.type),placeholder=/\[(?:objeto|object|target)\]/i;const objectInputKey=keys.find(key=>d.propsMeta[key][2]==='socket'&&(['object','target'].includes(key.toLowerCase())||['object','target'].includes(String(d.propsMeta[key][0]).toLowerCase())));const placeholderMatch=objectInputKey&&label.match(placeholder);const labelMarkup=placeholderMatch?`${escapeHtml(label.slice(0,placeholderMatch.index))}${blockInputMarkup(node,objectInputKey)}${escapeHtml(label.slice(placeholderMatch.index+placeholderMatch[0].length))}`:escapeHtml(label);const inside=keys.filter(key=>!(placeholderMatch&&key===objectInputKey)).map(key=>blockInputMarkup(node,key)).join('');const code=escapeHtml(expressionCode(node));const nextMarkup=node.next?blockMarkup(node.next):'';return`<div class="block-wrap ${expression?'expression-wrap':''}" data-id="${node.id}" data-kind="${visual.kind}"><div class="block category-${d.type} block-kind-${visual.kind.toLowerCase()} ${d.type==='event'?'event':''} ${expression?'expression-block':''} ${state.selected===node.id?'selected':''}" style="background:${c.color}" draggable="true"><span class="block-icon">${d.icon}</span><div class="block-label">${labelMarkup}</div>${inside}<button class="delete-mini" data-delete="${node.id}" title="Excluir">×</button></div>${d.children?`<div class="nested" data-parent="${node.id}">${(node.children||[]).map(child=>blockMarkup(child)).join('')}</div>`:''}${!expression&&state.inlineCode?`<code class="inline-code">${code}</code>`:''}</div>${nextMarkup}`}
function renderTree(){renderReactTree()}
function countNodes(list){return VisualBlockTree.count(list)}
function bindTree(){document.querySelectorAll('.block').forEach(el=>{el.onclick=e=>{if(e.target.matches('input,select,button,.socket'))return;state.selected=el.parentElement.dataset.id;renderTree();renderInspector()};el.ondragstart=e=>{e.stopPropagation();e.dataTransfer.setData('move-id',el.parentElement.dataset.id)};el.ondragover=e=>{e.preventDefault();const before=e.clientY<el.getBoundingClientRect().top+el.offsetHeight/2;el.classList.toggle('drop-before',before);el.classList.toggle('drop-after',!before)};el.ondragleave=()=>{el.classList.remove('drop-before','drop-after')};el.ondrop=e=>{e.preventDefault();e.stopPropagation();el.classList.remove('drop-before','drop-after');const key=e.dataTransfer.getData('block-key'),move=e.dataTransfer.getData('move-id');if(key)addNode(key,el.parentElement.dataset.id);else if(move){const before=e.clientY<el.getBoundingClientRect().top+el.offsetHeight/2;moveNode(move,el.parentElement.dataset.id,before?'before':'after')}}});document.querySelectorAll('.nested').forEach(el=>{el.ondragover=e=>e.preventDefault();el.ondrop=e=>{e.preventDefault();const key=e.dataTransfer.getData('block-key'),move=e.dataTransfer.getData('move-id');if(key)addNode(key,el.dataset.parent);else if(move)moveNode(move,el.dataset.parent,'inside')}});document.querySelectorAll('.socket').forEach(socket=>{socket.ondragover=e=>{e.preventDefault();socket.classList.add('socket-target')};socket.ondragleave=()=>socket.classList.remove('socket-target');socket.ondrop=e=>{e.preventDefault();e.stopPropagation();socket.classList.remove('socket-target');const key=e.dataTransfer.getData('block-key'),moveId=e.dataTransfer.getData('move-id');if(key||moveId)addExpression(key,socket.dataset.socket,socket.dataset.prop,moveId||null)}});document.querySelectorAll('[data-delete]').forEach(b=>{b.onpointerdown=e=>e.stopPropagation();b.onclick=e=>{e.stopPropagation();deleteNode(b.dataset.delete)}});document.querySelectorAll('[data-prop]').forEach(input=>{input.onfocus=()=>snapshot();input.oninput=e=>{const found=findNode(state.tree,input.closest('[data-id]')?.dataset.id||state.selected);if(found){found.node.properties[input.dataset.prop]=input.value;found.node.inputs[input.dataset.prop]=input.value;updateCode()}}})}
function addExpression(key,parentId,property,moveId=null){const target=findNode(state.tree,parentId),moving=moveId?findNode(state.tree,moveId):null,source=moving?visualDefinitions[moving.node.type]:visualDefinitions[key],input=visualDefinitions[target?.node.type]?.inputs.find(item=>item.id===property);if(!target||!source||!input||!VisualConnectionSystem.canConnectValue(source,input)){showToast('Entrada incompatível');return}if(moving&&(moving.node.id===parentId||isDescendant(moving.node,parentId))){showToast('Não é possível conectar um bloco dentro dele mesmo');return}if(moving&&moving.parent===target.node&&moving.propertyId===property)return;snapshot();let node;if(moving){if(moving.propertyId){const defaultValue=clone(definitions[moving.parent.type].props?.[moving.propertyId]??'');moving.parent.properties[moving.propertyId]=clone(defaultValue);moving.parent.inputs[moving.propertyId]=clone(defaultValue)}node=VisualBlockTree.detach(state.tree,moveId)}else node=makeNode(key);if(!node)return;VisualBlockTree.connectValue(target.node,property,node);state.selected=node.id;renderTree();renderInspector()}
function addNode(key,parentId=null){const node=makeNode(key),source=visualDefinitions[key];if(parentId){const parent=findNode(state.tree,parentId);if(!parent){return}const targetDefinition=visualDefinitions[parent.node.type];if(parent.node.children){if(!VisualConnectionSystem.canConnectBody(source,{accepts:'COMMAND'})){showToast('O corpo aceita apenas comandos');return}snapshot();VisualBlockTree.appendToBody(parent.node,node);}
else if(VisualConnectionSystem.canConnectSequence(source,targetDefinition)){snapshot();VisualBlockTree.insertAfter(state.tree,parentId,node);}
else{showToast('Sequência incompatível');return}}
else{if(source.kind=== 'VALUE'||source.kind==='EXPRESSION'){showToast('Conecte este bloco a uma entrada');return}snapshot();state.tree.push(node)}state.selected=node.id;renderTree();renderInspector()}
function deleteNode(id){snapshot();const found=findNode(state.tree,id);if(found){if(found.propertyId){delete found.parent.properties[found.propertyId];delete found.parent.inputs[found.propertyId]}else if(found.parent?.next===found.node)found.parent.next=found.node.next;else if(found.list)found.list.splice(found.list.indexOf(found.node),1);state.selected=null;renderTree();renderInspector()}}
function moveNode(id,targetId,position='after'){if(id===targetId)return;const source=findNode(state.tree,id),target=findNode(state.tree,targetId);if(!source||!target||isDescendant(source.node,targetId))return;const sourceDefinition=visualDefinitions[source.node.type],targetDefinition=visualDefinitions[target.node.type],canSequence=VisualConnectionSystem.canConnectSequence(sourceDefinition,targetDefinition),canBody=target.node.children&&VisualConnectionSystem.canConnectBody(sourceDefinition,{accepts:'COMMAND'});if(position==='before'&&!canSequence&& !canBody){showToast('Sequência incompatível');return}if(position==='inside'&&!canBody){showToast('O corpo aceita apenas comandos');return}if(!canSequence&&!canBody){showToast('Sequência incompatível');return}if(position==='after'&&source.parent===target.node&&target.node.next===source.node)return;if(position==='before'&&source.node.next===target.node)return;if(position==='inside'&&source.parent===target.node&&source.list===target.node.children&&source.list.at(-1)===source.node)return;if(source.list===target.list){const sourceIndex=source.list.indexOf(source.node),targetIndex=target.list.indexOf(target.node);if((position==='before'&&sourceIndex===targetIndex-1)||(position==='after'&&sourceIndex===targetIndex+1))return}snapshot();const moved=VisualBlockTree.detach(state.tree,id);if(!moved)return;let inserted;if(position==='inside'||(position==='after'&&canBody)){VisualBlockTree.appendToBody(target.node,moved);inserted=true}else if(position==='before')inserted=VisualBlockTree.insertBefore(state.tree,targetId,moved);else if(canSequence)inserted=VisualBlockTree.insertAfter(state.tree,targetId,moved);if(!inserted){state.tree.push(moved);showToast('Bloco movido para o início da sequência')}renderTree()}
function isDescendant(node,id){const contains=value=>value&&typeof value==='object'&&(value.id===id||isDescendant(value,id));return(node.children||[]).some(contains)||(node.next&&contains(node.next))||Object.values(node.properties||{}).some(contains)||Object.values(node.bodies||{}).some(body=>body.some(contains))}
function inspectorSummary(node){const category=definitions[node.type].type,language=state.language==='pt'?'pt':'en';const summaries={events:{pt:'Inicia a execução quando este evento acontece.',en:'Starts execution when this event occurs.'},control:{pt:'Controla a ordem ou a repetição das instruções conectadas.',en:'Controls the order or repetition of connected instructions.'},operators:{pt:'Calcula um valor ou avalia uma condição para outros blocos.',en:'Calculates a value or evaluates a condition for other blocks.'},logic:{pt:'Combina ou inverte valores booleanos.',en:'Combines or inverts boolean values.'},math:{pt:'Calcula um resultado numérico.',en:'Calculates a numeric result.'},variables:{pt:'Armazena ou altera valores usados pelo script.',en:'Stores or changes values used by the script.'},functions:{pt:'Define ou chama uma função reutilizável no script.',en:'Defines or calls a reusable function in the script.'},movement:{pt:'Move um objeto ou personagem no mundo do jogo.',en:'Moves an object or character in the game world.'},appearance:{pt:'Altera a aparência de um objeto.',en:'Changes the appearance of an object.'},audio:{pt:'Controla a reprodução de áudio.',en:'Controls audio playback.'},character:{pt:'Consulta ou altera o personagem e suas ações.',en:'Reads or changes the character and its actions.'},players:{pt:'Consulta informações ou executa ações sobre jogadores.',en:'Reads player information or performs actions on players.'},objects:{pt:'Acessa ou altera um objeto do jogo.',en:'Accesses or changes a game object.'},properties:{pt:'Consulta ou altera uma propriedade do jogo.',en:'Reads or changes a game property.'},methods:{pt:'Executa uma ação em um objeto do jogo.',en:'Performs an action on a game object.'},sound:{pt:'Controla a reprodução e as propriedades de áudio.',en:'Controls audio playback and properties.'},input:{pt:'Responde às entradas e aos controles do jogador.',en:'Responds to player input and controls.'},ui:{pt:'Exibe ou atualiza elementos da interface do jogador.',en:'Displays or updates player interface elements.'},teleport:{pt:'Teleporta um personagem ou objeto para outra posição.',en:'Teleports a character or object to another position.'},world:{pt:'Acessa elementos e serviços do mundo do jogo.',en:'Accesses elements and services in the game world.'},multiplayer:{pt:'Envia ou recebe dados entre servidor e jogadores.',en:'Sends or receives data between the server and players.'},datastore:{pt:'Salva ou carrega dados persistentes.',en:'Saves or loads persistent data.'},services:{pt:'Acessa um serviço do Roblox.',en:'Accesses a Roblox service.'},teams:{pt:'Gerencia equipes ou placares dos jogadores.',en:'Manages player teams or leaderboards.'},tools:{pt:'Consulta ou controla ferramentas do jogador.',en:'Reads or controls player tools.'},advanced:{pt:'Executa uma operação avançada em Luau.',en:'Runs an advanced Luau operation.'}};return summaries[category]?.[language]||(language==='pt'?'Executa esta operação no script.':'Runs this operation in the script.')}function renderInspector(){const found=state.selected&&findNode(state.tree,state.selected);if(!found){$('inspectorContent').innerHTML=`<div class="empty-inspector"><div>◌</div><strong>${state.language==='pt'?'Selecione um bloco':'Select a block'}</strong><span>${state.language==='pt'?'As propriedades aparecerão aqui':'Block properties appear here'}</span></div>`;return}const d=definitions[found.node.type],c=categories[d.type],preview=escapeHtml(expressionCode(found.node));$('inspectorContent').innerHTML=`<div class="inspector-title"><div class="lib-icon" style="background:${c.color}">${d.icon}</div><strong>${labelFor(found.node.type)}</strong></div><p class="inspector-summary">${inspectorSummary(found.node)}</p><div class="inspector-preview"><span>${state.language==='pt'?'Instrução gerada':'Generated instruction'}</span><pre><code>${preview}</code></pre></div>`}
function inspectorSummaryForChildren(node){const category=definitions[node.type].type,language=state.language==='pt'?'pt':'en';const descriptions={events:{pt:'Começa uma ação quando algo acontece, como um jogador entrar.',en:'Starts an action when something happens, like a player joining.'},control:{pt:'Escolhe o que acontece depois ou repete uma ação.',en:'Chooses what happens next or repeats an action.'},operators:{pt:'Faz uma conta ou compara valores.',en:'Does math or compares values.'},logic:{pt:'Junta respostas de sim ou não.',en:'Combines yes-or-no answers.'},math:{pt:'Faz uma conta com números.',en:'Does a math problem with numbers.'},variables:{pt:'Guarda um valor para usar depois.',en:'Keeps a value so you can use it later.'},functions:{pt:'Guarda um grupo de ações para usar pelo nome.',en:'Groups actions so you can use them by name.'},movement:{pt:'Move uma peça ou personagem no jogo.',en:'Moves a game part or character.'},appearance:{pt:'Muda a cor ou o visual de uma peça.',en:'Changes a part’s color or look.'},audio:{pt:'Toca ou muda um som.',en:'Plays or changes a sound.'},character:{pt:'Muda ou consulta o personagem do jogador.',en:'Changes or checks the player’s character.'},players:{pt:'Encontra jogadores ou vê informações sobre eles.',en:'Finds players or checks information about them.'},objects:{pt:'Encontra ou usa peças e outros objetos do jogo.',en:'Finds or uses parts and other game objects.'},properties:{pt:'Lê ou muda uma característica, como a cor ou o nome de uma peça.',en:'Reads or changes a detail, like a part’s color or name.'},methods:{pt:'Pede para um objeto fazer algo, como encontrar uma peça.',en:'Asks an object to do something, like find a part.'},sound:{pt:'Consulta ou muda um som do jogo.',en:'Checks or changes a game sound.'},input:{pt:'Faz algo quando o jogador aperta uma tecla ou botão.',en:'Does something when the player presses a key or button.'},ui:{pt:'Mostra ou muda textos e botões na tela.',en:'Shows or changes text and buttons on the screen.'},teleport:{pt:'Leva um personagem ou objeto para outro lugar.',en:'Moves a character or object to another place.'},world:{pt:'Consulta ou muda coisas do cenário do jogo.',en:'Checks or changes things in the game world.'},multiplayer:{pt:'Troca informações entre o jogo e os jogadores.',en:'Shares information between the game and its players.'},datastore:{pt:'Guarda informações para usar depois ou busca algo que já foi guardado.',en:'Saves information for later or gets information that was saved.'},services:{pt:'Usa um recurso pronto do Roblox.',en:'Uses a feature provided by Roblox.'},teams:{pt:'Organiza jogadores em times ou placares.',en:'Organizes players into teams or scoreboards.'},tools:{pt:'Encontra ou muda as ferramentas do jogador.',en:'Finds or changes a player’s tools.'},admin:{pt:'Usa comandos para cuidar do jogo e dos jogadores.',en:'Uses commands to manage the game and its players.'},advanced:{pt:'Executa um comando especial do Roblox.',en:'Runs a special Roblox command.'}};return descriptions[category]?.[language]||(language==='pt'?'Faz uma parte do jogo funcionar.':'Makes part of the game work.')}
inspectorSummary=inspectorSummaryForChildren;
function escapeHtml(value){return String(value).replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[x]))}
function validate(){const errors=[];const vars=new Set();function walk(list){list.forEach(n=>{const d=definitions[n.type];Object.entries(n.properties||{}).forEach(([k,v])=>{if(typeof v!=='object'&&!String(v).trim())errors.push({id:n.id,msg:`${labelFor(n.type)}: ${d.propsMeta?.[k]?.[0]||k} ${state.language==='pt'?'vazio':'is empty'}`})});if(['set_variable'].includes(n.type))vars.add(n.properties.name);walk(n.children||[])})}walk(state.tree);function second(list){list.forEach(n=>{if(['set_variable'].includes(n.type)&&!vars.has(n.properties.name))errors.push({id:n.id,msg:`${dLabel(n)}: ${state.language==='pt'?'variável':'variable'} "${n.properties.name||'?'}" ${state.language==='pt'?'não existe':'does not exist'}`});if(['if_block','if_else_block','else_if_block','while_block','repeat_until_block','wait_until_block'].includes(n.type)){const left=String(n.properties.left ?? n.properties.condition ?? '').trim();const op=String(n.properties.operator ?? '').trim();const right=String(n.properties.right ?? '').trim();const hasStructuredCondition=(left && op && right) || (String(n.properties.condition ?? '').trim() !== '');if(!hasStructuredCondition){errors.push({id:n.id,msg:state.language==='pt'?'Condição incompleta':'Incomplete condition'})}};if(n.children&&(['if_block','if_else_block','else_if_block','while_block','repeat_until_block','player_joined'].includes(n.type))&&n.children.length===0)errors.push({id:n.id,msg:`${dLabel(n)} ${state.language==='pt'?'precisa de blocos internos':'needs inner blocks'}`});second(n.children||[])})}second(state.tree);return errors}function dLabel(n){return labelFor(n.type)}
function generate(){const errors=validate();const grouped=new Map(errors.map(e=>[e.id,e]));document.querySelectorAll('.block-wrap').forEach(e=>e.classList.toggle('has-error',grouped.has(e.dataset.id)));$('errorsPanel').innerHTML=errors.length?`<div class="error-heading" style="color:#d86666"><span style="background:#ffe3e3">!</span><strong>${errors.length} erro${errors.length>1?'s':''} encontrado${errors.length>1?'s':''}</strong></div>${errors.slice(0,3).map(e=>`<div class="error-item"><span>!</span>${e.msg}</div>`).join('')}`:'<div class="error-heading"><span>✓</span><strong>Sem erros de validação</strong></div>';$('validState').innerHTML=errors.length?'<i style="background:#e66c6c"></i> '+errors.length+' erro(s)':'<i></i> válido';const lines=[];function emitList(list,depth=0){list.forEach(node=>emitNode(node,depth))}function emitNode(node,depth=0){const d=definitions[node.type];let line=d.template;Object.entries(node.properties||{}).forEach(([k,v])=>line=line.replaceAll(`{${k}}`,formatValue(node.type,k,v)));if(node.type==='else_block'){lines.push('  '.repeat(depth)+'else');emitList(node.children||[],depth+1);return}if(node.type==='player_joined'){lines.push('  '.repeat(depth)+line);if(d.children)emitList(node.children||[],depth+1);lines.push('  '.repeat(depth)+'end)');return}lines.push('  '.repeat(depth)+line);if(d.children){emitList(node.children||[],depth+1);if(node.type==='repeat_until_block'){lines.push('  '.repeat(depth)+`until ${formatValue(node.type,'left',node.properties.left)} ${normalizeOperator(node.properties.operator)} ${formatValue(node.type,'right',node.properties.right)}`)}else if(node.type==='try_block'){lines.push('  '.repeat(depth)+'end)')}else if(node.type!=='else_block'){lines.push('  '.repeat(depth)+'end')}}}emitList(state.tree);const generated=lines.join('\n')||'-- Arraste blocos para gerar código Luau';state.generatedCode=generated;return generated}
function normalizeOperator(value){if(value===undefined||value===null) return '';const normalized=String(value).trim();if(normalized==='=') return '==';if(normalized==='==') return '==';if(normalized==='~=') return '~=';if(normalized==='≠') return '~=';return normalized}
function formatValue(type,key,value){return formatLuauValue(type,key,value,definitions,normalizeOperator,expressionCode)}
function expressionCode(node){return serializeLuauExpression(node,definitions,normalizeOperator)}
function highlight(code){return escapeHtml(code).replace(/(&quot;.*?&quot;|&quot;.*)/g,'<span class="str">$1</span>').replace(/\b(local|function|then|do|end|while|for|in)\b/g,'<span class="kw">$1</span>').replace(/\b(\d+(?:\.\d+)?)\b/g,'<span class="num">$1</span>').replace(/\b(print|wait|Connect|FindFirstChildOfClass)\b/g,'<span class="fn">$1</span>')}
function refreshInlineCode(){document.querySelectorAll('.inline-code').forEach(code=>{const blockId=code.closest('.block-wrap')?.dataset.id;const found=blockId&&findNode(state.tree,blockId);if(found)code.textContent=expressionCode(found.node)})}
function updateCodeLegacy(){const code=generate();state.generatedCode=code;$('codeOutput').innerHTML=highlight(code);$('lineCount').textContent=`${code.split('\n').length} linhas`;refreshInlineCode();if(!typingGame.running){refreshTypingChallenge();}if(state.selected)renderInspector()}
function updateCode(){const code=generate();state.generatedCode=code;codeRoot.render(React.createElement(GeneratedCodeDisplay,{code,highlight}));$('lineCount').textContent=`${code.split('\n').length} linhas`;refreshInlineCode();if(!typingGame.running){refreshTypingChallenge();}if(state.selected)renderInspector()}
document.addEventListener('focusin',event=>{const input=event.target.closest('[data-prop]');if(!input)return;const blockId=input.closest('.block-wrap')?.dataset.id;if(!blockId)return;state.selected=blockId;document.querySelectorAll('.block').forEach(block=>block.classList.toggle('selected',block.parentElement.dataset.id===blockId));renderInspector()});
document.addEventListener('focusin',event=>{if(event.target.closest('#inspectorContent [data-prop]'))snapshot()});
document.addEventListener('input',event=>{const input=event.target.closest('#inspectorContent [data-prop]');if(!input)return;const found=findNode(state.tree,state.selected);if(!found)return;found.node.properties[input.dataset.prop]=input.value;found.node.inputs[input.dataset.prop]=input.value;const selected=state.selected;state.selected=null;updateCode();state.selected=selected},true);
function undo(){if(!state.history.length)return;state.future.push(clone(state.tree));state.tree=state.history.pop();state.selected=null;renderTree();renderInspector()}function redo(){if(!state.future.length)return;state.history.push(clone(state.tree));state.tree=state.future.pop();renderTree();renderInspector()}
$('canvas').ondragover=e=>e.preventDefault();$('canvas').ondrop=e=>{e.preventDefault();const key=e.dataTransfer.getData('block-key');if(key)addNode(key)};$('blockSearch').oninput=renderLibrary;$('undoBtn').onclick=undo;$('redoBtn').onclick=redo;$('clearBtn').onclick=()=>{if(state.tree.length){snapshot();state.tree=[];state.selected=null;renderTree();renderInspector()}};$('copyBtn').onclick=()=>navigator.clipboard.writeText(generate()).then(()=>{showToast('Código Luau copiado');});$('runBtn').onclick=()=>{const errors=validate();showToast(errors.length?'Corrija os erros antes de testar':'Script pronto para testar no Roblox Studio')};$('renameProject').onclick=()=>{const name=prompt('Nome do script',$('projectTitle').textContent);if(name)$('projectTitle').textContent=name};$('zoomIn').onclick=()=>setZoom(state.zoom+10);$('zoomOut').onclick=()=>setZoom(state.zoom-10);$('gridToggle').onclick=()=>{state.grid=!state.grid;$('canvas').style.backgroundImage=state.grid?'radial-gradient(#d9e0e8 1px,transparent 1px)':'none'};document.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key==='z'){e.preventDefault();undo()}if((e.metaKey||e.ctrlKey)&&e.key==='y'){e.preventDefault();redo()}if(e.key==='Delete'&&state.selected)deleteNode(state.selected)});function setZoom(value){state.zoom=Math.max(70,Math.min(140,value));$('canvasInner').style.transform=`scale(${state.zoom/100})`;$('zoomValue').textContent=state.zoom+'%';$('statusZoom').textContent=state.zoom+'%'}function showToast(text){const t=$('toast');t.textContent=text;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1800)}
function saveProjectFile(){const code=generate(),title=$('projectTitle').textContent.trim()||'Untitled Script',contents=appendVisualProjectMetadata(code,state.tree,title),blob=new Blob([contents],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=`${title.replace(/[<>:"/\\|?*\u0000-\u001f]/g,'-')||'Untitled Script'}.lua`;link.click();setTimeout(()=>URL.revokeObjectURL(url),0);showToast('Código e blocos salvos')}
async function loadProjectFile(file){try{const project=readVisualProjectMetadata(await file.text());if(!project){showToast('Arquivo sem blocos visuais. Use um arquivo salvo pelo app.');return}const tree=normalizeVisualProjectTree(project.tree,definitions);snapshot();state.tree=tree;state.selected=null;$('projectTitle').textContent=project.title||'Untitled Script';renderTree();renderInspector();showToast('Código e blocos carregados')}catch(error){showToast(`Não foi possível carregar: ${error.message}`)}}
$('saveCodeBtn').onclick=saveProjectFile;$('loadCodeBtn').onclick=()=>$('loadCodeInput').click();$('loadCodeInput').onchange=event=>{const file=event.target.files?.[0];if(file)loadProjectFile(file);event.target.value=''};
function duplicateNode(){if(!state.selected)return;const found=findNode(state.tree,state.selected);if(!found)return;snapshot();const copy=clone(found.node);function renew(node){node.id=crypto.randomUUID();(node.children||[]).forEach(renew)}renew(copy);found.list.splice(found.list.indexOf(found.node)+1,0,copy);state.selected=copy.id;renderTree();renderInspector();showToast('Bloco duplicado')}
$('duplicateBtn').onclick=duplicateNode;let hand=false,lastPoint=null;$('handTool').onclick=()=>{hand=!hand;$('handTool').classList.toggle('active',hand);$('selectTool').classList.toggle('active',!hand);$('canvas').style.cursor=hand?'grab':'default'};$('canvas').onpointerdown=e=>{if(!hand)return;lastPoint={x:e.clientX,y:e.clientY,scrollLeft:$('canvas').scrollLeft,scrollTop:$('canvas').scrollTop};$('canvas').setPointerCapture(e.pointerId)};$('canvas').onpointermove=e=>{if(!hand||!lastPoint)return;$('canvas').scrollLeft=lastPoint.scrollLeft-(e.clientX-lastPoint.x);$('canvas').scrollTop=lastPoint.scrollTop-(e.clientY-lastPoint.y)};$('canvas').onpointerup=()=>{lastPoint=null};document.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key==='d'){e.preventDefault();duplicateNode()}});
 $('languageBtn').onclick=()=>{state.language=state.language==='en'?'pt':'en';$('languageBtn').textContent=state.language==='en'?'PT':'EN';renderLibrary();renderTree();renderInspector()};$('inlineCodeBtn').onclick=()=>{state.inlineCode=!state.inlineCode;$('inlineCodeBtn').classList.toggle('active',state.inlineCode);renderTree()};$('themeBtn').onclick=()=>{state.theme=state.theme==='light'?'dark':'light';document.body.classList.toggle('dark-theme',state.theme==='dark');$('themeBtn').textContent=state.theme==='dark'?'☀':'☾';$('themeBtn').title=state.theme==='dark'?'Usar tema claro':'Usar tema escuro'};bindTypingHub();initializeMemeFeedback();resetTypingGame();renderLibrary();renderTree();renderInspector();
