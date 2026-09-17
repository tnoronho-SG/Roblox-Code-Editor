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
  if_block:{type:'control',label:'If',icon:'◇',template:'if {left} {operator} {right} then',props:{left:'score',operator:'>',right:'0'},propsMeta:{left:['Left','text','socket'],operator:['Operator','operator'],right:['Right','text','socket']},children:true},
  if_else_block:{type:'control',label:'If / Else',icon:'◇',template:'if {left} {operator} {right} then',props:{left:'score',operator:'>',right:'0'},propsMeta:{left:['Left','text','socket'],operator:['Operator','operator'],right:['Right','text','socket']},children:true},
  else_if_block:{type:'control',label:'Else if',icon:'◇',template:'elseif {left} {operator} {right} then',props:{left:'score',operator:'>',right:'0'},propsMeta:{left:['Left','text','socket'],operator:['Operator','operator'],right:['Right','text','socket']},children:true},
  else_block:{type:'control',label:'Else',icon:'◇',template:'else',children:true},
  while_block:{type:'control',label:'While',icon:'↻',template:'while {left} {operator} {right} do',props:{left:'score',operator:'>',right:'0'},propsMeta:{left:['Left','text','socket'],operator:['Operator','operator'],right:['Right','text','socket']},children:true},
  repeat_block:{type:'control',label:'Repeat',icon:'↻',template:'for _ = 1, {times} do',props:{times:'3'},propsMeta:{times:['Times','number','socket']},children:true},
  for_block:{type:'control',label:'For',icon:'↻',template:'for {variable} = {start}, {finish} do',props:{variable:'i',start:'1',finish:'10'},propsMeta:{variable:['Variable','text'],start:['Start','number','socket'],finish:['Finish','number','socket']},children:true},
  for_each_block:{type:'control',label:'For each',icon:'↻',template:'for {value} in pairs({table}) do',props:{value:'value',table:'items'},propsMeta:{value:['Value','text'],table:['Table','text','socket']},children:true},
  repeat_until_block:{type:'control',label:'Repeat until',icon:'↻',template:'repeat',props:{left:'score',operator:'>=',right:'10'},propsMeta:{left:['Left','text','socket'],operator:['Operator','operator'],right:['Right','text','socket']},children:true},
  wait_until_block:{type:'control',label:'Wait until',icon:'◷',template:'repeat task.wait() until {left} {operator} {right}',props:{left:'score',operator:'>=',right:'10'},propsMeta:{left:['Left','text','socket'],operator:['Operator','operator'],right:['Right','text','socket']}},
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
  set_variable:{type:'variables',label:'Set variable',icon:'◆',template:'{name} = {value}',props:{name:'coins',value:'0'},propsMeta:{name:['Variable','text'],value:['Value','text']}},
  local_set_variable:{type:'variables',label:'Local variable',icon:'◆',template:'local {name} = {value}',props:{name:'coins',value:'0'},propsMeta:{name:['Variable','text'],value:['Value','text']}},
  compound_variable:{type:'variables',label:'Change variable',icon:'◆',template:'{name} {operator}= {value}',props:{name:'coins',operator:'+',value:'1'},operatorOptions:['+','-','*','/','..'],propsMeta:{name:['Variable','text'],operator:['Operator','operator'],value:['Value','text']}},
  create_variable:{type:'variables',label:'Create variable',icon:'◆',template:'local {name} = nil',props:{name:'coins'},propsMeta:{name:['Name','text']}},
  delete_variable:{type:'variables',label:'Delete variable',icon:'◆',template:'{name} = nil',props:{name:'coins'},propsMeta:{name:['Name','text']}},
  use_variable:{type:'variables',label:'Use variable',icon:'◆',template:'{name}',props:{name:'coins'},propsMeta:{name:['Variable','text']}},
  show_variable:{type:'variables',label:'Show variable',icon:'◆',template:'print({name})',props:{name:'coins'},propsMeta:{name:['Variable','text']}},
  define_variable:{type:'variables',label:'Define variable',icon:'◆',template:'{name} = {value}',props:{name:'coins',value:'0'},propsMeta:{name:['Variable','text'],value:['Value','text']}},
  change_variable:{type:'variables',label:'Change variable by',icon:'◆',template:'{name} += {value}',props:{name:'coins',value:'1'},propsMeta:{name:['Variable','text'],value:['Value','number','socket']}},
  rename_variable:{type:'variables',label:'Rename variable',icon:'◆',template:'local {newName} = {name}\n{name} = nil',props:{name:'coins',newName:'points'},propsMeta:{name:['Name','text'],newName:['New name','text']}},
  local_variable:{type:'variables',label:'Local variable',icon:'◆',template:'local {name}',props:{name:'coins'},propsMeta:{name:['Variable','text']}},
  global_variable:{type:'variables',label:'Global variable',icon:'◆',template:'_G.{name} = nil',props:{name:'coins'},propsMeta:{name:['Name','text']}},
  nil_variable:{type:'variables',label:'Set variable to nil',icon:'◆',template:'{name} = nil',props:{name:'coins'},propsMeta:{name:['Variable','text']}},
  variable_type:{type:'variables',label:'Variable type',icon:'◆',template:'typeof({name})',props:{name:'coins'},propsMeta:{name:['Variable','text']}},
  boolean_value:{type:'operators',label:'Boolean',icon:'●',template:'{value}',props:{value:'true'},propsMeta:{value:['Value','operator']}},
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
  set_walk_speed:{type:'character',label:'Set walk speed',icon:'◍',template:'{character}:FindFirstChildOfClass("Humanoid").WalkSpeed = {speed}',props:{character:'player.Character',speed:'16'},propsMeta:{character:['Character','text','socket'],speed:['Speed','number','socket']}},
  jump_character:{type:'character',label:'Jump character',icon:'◍',template:'local humanoid = {character}:FindFirstChildOfClass("Humanoid")\nif humanoid then\n    humanoid:ChangeState(Enum.HumanoidStateType.Jumping)\nend',props:{character:'player.Character'},propsMeta:{character:['Character','text','socket']}},
  play_sound:{type:'audio',label:'Play sound',icon:'♫',template:'local sound = workspace:FindFirstChild("{sound}") or Instance.new("Sound")\nsound.Name = "{sound}"\nsound.Volume = {volume}\nsound.Parent = workspace\nsound:Play()',props:{sound:'coinSound',volume:'1'},propsMeta:{sound:['Sound','text'],volume:['Volume','number','socket']}},
  show_text:{type:'ui',label:'Show text',icon:'▣',template:'local label = {target}\nif label then\n    label.Text = "{text}"\nend',props:{target:'scoreLabel',text:'Level 1'},propsMeta:{target:['Target','text','socket'],text:['Text','text']}},
  set_score:{type:'variables',label:'Set score',icon:'◆',template:'{variable} = {value}',props:{variable:'score',value:'10'},propsMeta:{variable:['Variable','text'],value:['Value','number']}},
  input_pressed:{type:'input',label:'Input pressed',icon:'⌨',template:'UserInputService.InputBegan:Connect(function(input, gameProcessedEvent)',props:{inputName:'"E"'},propsMeta:{inputName:['Key','text']},children:true},
  teleport_to:{type:'teleport',label:'Teleport to',icon:'✈',template:'{character}:PivotTo(CFrame.new({x}, {y}, {z}))',props:{character:'player.Character',x:'0',y:'5',z:'0'},propsMeta:{character:['Character','text','socket'],x:['X','number','socket'],y:['Y','number','socket'],z:['Z','number','socket']}}
};
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
  define_variable:'define variable',
  change_variable:'change variable by',
  rename_variable:'rename variable',
  local_variable:'local variable',
  global_variable:'global variable',
  nil_variable:'variable = nil',
  variable_type:'variable type',
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
  define_variable:'definir variável',
  change_variable:'alterar variável por',
  rename_variable:'renomear variável',
  local_variable:'variável local',
  global_variable:'variável global',
  nil_variable:'variável = nil',
  variable_type:'tipo de variável',
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
  teams:'Teams / Leaderstats',
  tools:'Backpack / Tools',
  datastore:'DataStore',
  services:'Serviços Roblox',
  advanced:'Avançado / Luau'
};
let state={tree:[],selected:null,category:'events',zoom:100,grid:true,history:[],future:[],language:'en',inlineCode:true,theme:'light',generatedCode:''};
const $=id=>document.getElementById(id); const clone=o=>JSON.parse(JSON.stringify(o));
function labelFor(key){return state.language==='pt'?(portugueseLabels[key]||definitions[key]?.label||key):(englishLabels[key]||definitions[key]?.label||key)}
function categoryLabel(key){return state.language==='pt'?(portugueseCategories[key]||categories[key].label):categories[key].label}
function snapshot(){state.history.push(clone(state.tree));if(state.history.length>30)state.history.shift();state.future=[]}
function makeNode(key){const d=definitions[key];return{id:crypto.randomUUID(),type:key,properties:clone(d.props||{}),children:d.children?[]:undefined}}
function findNode(list,id,parent=null){for(const node of list){if(node.id===id)return{node,parent,list};if(node.children){const found=findNode(node.children,id,node);if(found)return found}}}
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
function renderLibrary(){const tabs=Object.entries(categories).map(([key,c])=>`<button class="cat-tab ${state.category===key?'active':''}" data-cat="${key}">${categoryLabel(key)}</button>`).join('');$('categoryTabs').innerHTML=tabs;document.querySelectorAll('.cat-tab').forEach(b=>b.onclick=()=>{state.category=b.dataset.cat;renderLibrary()});const query=$('blockSearch').value.toLowerCase();const items=libraryOrder.filter(k=>categoryForType(definitions[k].type)===state.category&&labelFor(k).toLowerCase().includes(query));$('libraryList').innerHTML=items.map(key=>{const d=definitions[key],c=categories[categoryForType(d.type)];return`<div class="library-card" draggable="true" data-key="${key}"><div class="lib-icon" style="background:${c.color}">${d.icon}</div><div><strong>${labelFor(key)}</strong><span>${d.children?(state.language==='pt'?'bloco com área interna':'block with inner area'):(state.language==='pt'?'bloco de ação':'action block')}</span></div></div>`}).join('');document.querySelectorAll('.library-card').forEach(card=>{card.ondragstart=e=>e.dataTransfer.setData('block-key',card.dataset.key)})}
function blockMarkup(node,expression=false){const d=definitions[node.type],c=categories[d.type];let inside='';if(d.propsMeta){inside=Object.keys(d.propsMeta).map(key=>{const meta=d.propsMeta[key],val=node.properties[key];if(meta[2]==='socket')return`<span class="socket ${val&&typeof val==='object'?'socket-filled':''}" data-socket="${node.id}" data-prop="${key}">${val&&typeof val==='object'?blockMarkup(val,true):escapeHtml(val??meta[0])}</span>`;if(meta[1]==='operator'||meta[1]==='type'){const options=meta[1]==='type'?['Número','Texto','Boolean']:(d.operatorOptions||['=', '==', '>', '<', '>=', '<=', '!=', '~=']);return`<select data-prop="${key}">${options.map(x=>`<option ${x===val?'selected':''}>${x}</option>`).join('')}</select>`}return`<input data-prop="${key}" value="${escapeHtml(val??'')}" aria-label="${meta[0]}" />`}).join('')}const code=escapeHtml(expressionCode(node));return`<div class="block-wrap ${expression?'expression-wrap':''}" data-id="${node.id}"><div class="block category-${d.type} ${d.type==='event'?'event':''} ${expression?'expression-block':''} ${state.selected===node.id?'selected':''}" style="background:${c.color}" draggable="true"><span class="block-icon">${d.icon}</span><span class="block-label">${labelFor(node.type)}</span>${inside}<button class="delete-mini" data-delete="${node.id}" title="Excluir">×</button></div>${d.children?`<div class="nested" data-parent="${node.id}">${(node.children||[]).map(child=>blockMarkup(child)).join('')}</div>`:''}${!expression&&state.inlineCode?`<code class="inline-code">${code}</code>`:''}</div>`}
function renderTree(){const root=$('treeRoot');root.innerHTML=state.tree.map(blockMarkup).join('');$('dropHint').style.display=state.tree.length?'none':'flex';$('blockCount').textContent=`${countNodes(state.tree)} bloco${countNodes(state.tree)===1?'':''}`;bindTree();updateCode()}
function countNodes(list){return list.reduce((n,x)=>n+1+(x.children?countNodes(x.children):0),0)}
function bindTree(){document.querySelectorAll('.block').forEach(el=>{el.onclick=e=>{if(e.target.matches('input,select,button,.socket'))return;state.selected=el.parentElement.dataset.id;renderTree();renderInspector()};el.ondragstart=e=>{e.stopPropagation();e.dataTransfer.setData('move-id',el.parentElement.dataset.id)};el.ondragover=e=>{e.preventDefault()};el.ondrop=e=>{e.preventDefault();e.stopPropagation();const key=e.dataTransfer.getData('block-key'),move=e.dataTransfer.getData('move-id');if(key)addNode(key,el.parentElement.dataset.id);else if(move)moveNode(move,el.parentElement.dataset.id)}});document.querySelectorAll('.nested').forEach(el=>{el.ondragover=e=>e.preventDefault();el.ondrop=e=>{e.preventDefault();const key=e.dataTransfer.getData('block-key'),move=e.dataTransfer.getData('move-id');if(key)addNode(key,el.dataset.parent);else if(move)moveNode(move,el.dataset.parent)}});document.querySelectorAll('.socket').forEach(socket=>{socket.ondragover=e=>{e.preventDefault();socket.classList.add('socket-target')};socket.ondragleave=()=>socket.classList.remove('socket-target');socket.ondrop=e=>{e.preventDefault();e.stopPropagation();socket.classList.remove('socket-target');const key=e.dataTransfer.getData('block-key');if(key)addExpression(key,socket.dataset.socket,socket.dataset.prop)}});document.querySelectorAll('[data-delete]').forEach(b=>b.onclick=e=>{e.stopPropagation();deleteNode(b.dataset.delete)});document.querySelectorAll('[data-prop]').forEach(input=>{input.onfocus=()=>snapshot();input.oninput=e=>{const found=findNode(state.tree,input.closest('[data-id]')?.dataset.id||state.selected);if(found){found.node.properties[input.dataset.prop]=input.value;updateCode()}}})}
function addExpression(key,parentId,property){const found=findNode(state.tree,parentId);if(!found)return;snapshot();const node=makeNode(key);found.node.properties[property]=node;state.selected=node.id;renderTree();renderInspector()}
function addNode(key,parentId=null){snapshot();const node=makeNode(key);if(parentId){const parent=findNode(state.tree,parentId);if(parent?.node.children)parent.node.children.push(node);else state.tree.push(node)}else state.tree.push(node);state.selected=node.id;renderTree();renderInspector()}
function deleteNode(id){snapshot();const found=findNode(state.tree,id);if(found){found.list.splice(found.list.indexOf(found.node),1);state.selected=null;renderTree();renderInspector()}}
function moveNode(id,targetId){if(id===targetId)return;snapshot();const source=findNode(state.tree,id);const target=findNode(state.tree,targetId);if(!source||!target||isDescendant(source.node,targetId))return;source.list.splice(source.list.indexOf(source.node),1);if(target.node.children)target.node.children.push(source.node);else state.tree.push(source.node);renderTree()}
function isDescendant(node,id){return(node.children||[]).some(x=>x.id===id||isDescendant(x,id))}
function renderInspector(){const found=state.selected&&findNode(state.tree,state.selected);if(!found){$('inspectorContent').innerHTML=`<div class="empty-inspector"><div>◌</div><strong>${state.language==='pt'?'Selecione um bloco':'Select a block'}</strong><span>${state.language==='pt'?'As propriedades aparecerão aqui':'Block properties appear here'}</span></div>`;return}const d=definitions[found.node.type],c=categories[d.type];const fields=Object.keys(d.propsMeta||{}).map(key=>{const meta=d.propsMeta[key];const value=found.node.properties[key]??'';if(meta[1]==='operator'||meta[1]==='type'){const options=meta[1]==='type'?['Número','Texto','Boolean']:[ '=', '==', '>', '<', '>=', '<=', '!=', '~=' ];return`<div class="property"><label>${meta[0]}</label><select data-inspect="${key}">${options.map(x=>`<option ${x===value?'selected':''}>${x}</option>`).join('')}</select></div>`}return`<div class="property"><label>${meta[0]}</label><input data-inspect="${key}" value="${escapeHtml(value)}" /></div>`}).join('');$('inspectorContent').innerHTML=`<div class="inspector-title"><div class="lib-icon" style="background:${c.color}">${d.icon}</div><strong>${labelFor(found.node.type)}</strong></div>${fields||`<div style="color:#9aa5b4;font-size:11px">${state.language==='pt'?'Este bloco não possui propriedades editáveis.':'This block has no editable properties.'}</div>`}`;document.querySelectorAll('[data-inspect]').forEach(input=>{input.onfocus=()=>snapshot();input.oninput=()=>{found.node.properties[input.dataset.inspect]=input.value;updateCode()}})}
function escapeHtml(value){return String(value).replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[x]))}
function validate(){const errors=[];const vars=new Set();function walk(list){list.forEach(n=>{const d=definitions[n.type];Object.entries(n.properties||{}).forEach(([k,v])=>{if(typeof v!=='object'&&!String(v).trim())errors.push({id:n.id,msg:`${labelFor(n.type)}: ${d.propsMeta?.[k]?.[0]||k} ${state.language==='pt'?'vazio':'is empty'}`})});if(['set_variable'].includes(n.type))vars.add(n.properties.name);walk(n.children||[])})}walk(state.tree);function second(list){list.forEach(n=>{if(['set_variable'].includes(n.type)&&!vars.has(n.properties.name))errors.push({id:n.id,msg:`${dLabel(n)}: ${state.language==='pt'?'variável':'variable'} "${n.properties.name||'?'}" ${state.language==='pt'?'não existe':'does not exist'}`});if(['if_block','while_block'].includes(n.type)){const left=String(n.properties.left ?? n.properties.condition ?? '').trim();const op=String(n.properties.operator ?? '').trim();const right=String(n.properties.right ?? '').trim();const hasStructuredCondition=(left && op && right) || (String(n.properties.condition ?? '').trim() !== '');if(!hasStructuredCondition){errors.push({id:n.id,msg:state.language==='pt'?'Condição incompleta':'Incomplete condition'})}};if(n.children&&(['if_block','while_block','player_joined'].includes(n.type))&&n.children.length===0)errors.push({id:n.id,msg:`${dLabel(n)} ${state.language==='pt'?'precisa de blocos internos':'needs inner blocks'}`});second(n.children||[])})}second(state.tree);return errors}function dLabel(n){return labelFor(n.type)}
function generate(){const errors=validate();const grouped=new Map(errors.map(e=>[e.id,e]));document.querySelectorAll('.block-wrap').forEach(e=>e.classList.toggle('has-error',grouped.has(e.dataset.id)));$('errorsPanel').innerHTML=errors.length?`<div class="error-heading" style="color:#d86666"><span style="background:#ffe3e3">!</span><strong>${errors.length} erro${errors.length>1?'s':''} encontrado${errors.length>1?'s':''}</strong></div>${errors.slice(0,3).map(e=>`<div class="error-item"><span>!</span>${e.msg}</div>`).join('')}`:'<div class="error-heading"><span>✓</span><strong>Sem erros de validação</strong></div>';$('validState').innerHTML=errors.length?'<i style="background:#e66c6c"></i> '+errors.length+' erro(s)':'<i></i> válido';const lines=[];function emitList(list,depth=0){list.forEach(node=>emitNode(node,depth))}function emitNode(node,depth=0){const d=definitions[node.type];let line=d.template;Object.entries(node.properties||{}).forEach(([k,v])=>line=line.replaceAll(`{${k}}`,formatValue(node.type,k,v)));if(node.type==='else_block'){lines.push('  '.repeat(depth)+'else');emitList(node.children||[],depth+1);return}if(node.type==='player_joined'){lines.push('  '.repeat(depth)+line);if(d.children)emitList(node.children||[],depth+1);lines.push('  '.repeat(depth)+'end)');return}lines.push('  '.repeat(depth)+line);if(d.children){emitList(node.children||[],depth+1);if(node.type==='repeat_until_block'){lines.push('  '.repeat(depth)+`until ${formatValue(node.type,'left',node.properties.left)} ${normalizeOperator(node.properties.operator)} ${formatValue(node.type,'right',node.properties.right)}`)}else if(node.type==='try_block'){lines.push('  '.repeat(depth)+'end)')}else if(node.type!=='else_block'){lines.push('  '.repeat(depth)+'end')}}}emitList(state.tree);const generated=lines.join('\n')||'-- Arraste blocos para gerar código Luau';state.generatedCode=generated;return generated}
function normalizeOperator(value){if(value===undefined||value===null) return '';const normalized=String(value).trim();if(normalized==='=') return '==';if(normalized==='==') return '==';if(normalized==='~=') return '~=';if(normalized==='≠') return '~=';return normalized}
function formatValue(type,key,value){if(key==='operator')return normalizeOperator(value);if(value&&typeof value==='object')return expressionCode(value);if(value==='any')return'nil';if(typeof value==='string'){const raw=value.trim();if(['name','variable','newName','function'].includes(key))return raw||'value';if(!raw)return '""';if((raw.startsWith('"')&&raw.endsWith('"'))||(raw.startsWith("'")&&raw.endsWith("'")))return raw;if(/^true$|^false$|^nil$/.test(raw) || /^-?\d+(?:\.\d+)?$/.test(raw) || /^[-+*/%<>=!~()\[\].]+$/.test(raw))return raw;if(/[\+\-*/%<>=!~()\[\].]/.test(raw) || raw.includes(' ') || raw.includes('\t'))return raw;return quoteLuauString(raw);}if(key==='text'||(key==='value'&&type==='print')||(key==='value'&&definitions[type].props?.valueType==='Texto'))return quoteLuauString(value);if(key==='value'&&definitions[type].props?.valueType==='Boolean')return String(value).toLowerCase()==='true'?'true':'false';return value}
function quoteLuauString(value){const raw=String(value ?? '').replace(/\\/g,'\\\\').replace(/"/g,'\\"');return `"${raw}"`;}
function expressionCode(node){const d=definitions[node.type];let line=d.template;Object.entries(node.properties||{}).forEach(([key,value])=>{line=line.replaceAll(`{${key}}`,formatValue(node.type,key,value))});return line}
function highlight(code){return escapeHtml(code).replace(/(&quot;.*?&quot;|&quot;.*)/g,'<span class="str">$1</span>').replace(/\b(local|function|then|do|end|while|for|in)\b/g,'<span class="kw">$1</span>').replace(/\b(\d+(?:\.\d+)?)\b/g,'<span class="num">$1</span>').replace(/\b(print|wait|Connect|FindFirstChildOfClass)\b/g,'<span class="fn">$1</span>')}
function updateCode(){const code=generate();state.generatedCode=code;$('codeOutput').innerHTML=highlight(code);$('lineCount').textContent=`${code.split('\n').length} linhas`;if(!typingGame.running){refreshTypingChallenge();}}
function undo(){if(!state.history.length)return;state.future.push(clone(state.tree));state.tree=state.history.pop();state.selected=null;renderTree();renderInspector()}function redo(){if(!state.future.length)return;state.history.push(clone(state.tree));state.tree=state.future.pop();renderTree();renderInspector()}
$('canvas').ondragover=e=>e.preventDefault();$('canvas').ondrop=e=>{e.preventDefault();const key=e.dataTransfer.getData('block-key');if(key)addNode(key)};$('blockSearch').oninput=renderLibrary;$('undoBtn').onclick=undo;$('redoBtn').onclick=redo;$('clearBtn').onclick=()=>{if(state.tree.length){snapshot();state.tree=[];state.selected=null;renderTree();renderInspector()}};$('copyBtn').onclick=()=>navigator.clipboard.writeText(generate()).then(()=>{showToast('Código Luau copiado');});$('runBtn').onclick=()=>{const errors=validate();showToast(errors.length?'Corrija os erros antes de testar':'Script pronto para testar no Roblox Studio')};$('renameProject').onclick=()=>{const name=prompt('Nome do script',$('projectTitle').textContent);if(name)$('projectTitle').textContent=name};$('zoomIn').onclick=()=>setZoom(state.zoom+10);$('zoomOut').onclick=()=>setZoom(state.zoom-10);$('gridToggle').onclick=()=>{state.grid=!state.grid;$('canvas').style.backgroundImage=state.grid?'radial-gradient(#d9e0e8 1px,transparent 1px)':'none'};document.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key==='z'){e.preventDefault();undo()}if((e.metaKey||e.ctrlKey)&&e.key==='y'){e.preventDefault();redo()}if(e.key==='Delete'&&state.selected)deleteNode(state.selected)});function setZoom(value){state.zoom=Math.max(70,Math.min(140,value));$('canvasInner').style.transform=`scale(${state.zoom/100})`;$('zoomValue').textContent=state.zoom+'%';$('statusZoom').textContent=state.zoom+'%'}function showToast(text){const t=$('toast');t.textContent=text;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1800)}
function duplicateNode(){if(!state.selected)return;const found=findNode(state.tree,state.selected);if(!found)return;snapshot();const copy=clone(found.node);function renew(node){node.id=crypto.randomUUID();(node.children||[]).forEach(renew)}renew(copy);found.list.splice(found.list.indexOf(found.node)+1,0,copy);state.selected=copy.id;renderTree();renderInspector();showToast('Bloco duplicado')}
$('duplicateBtn').onclick=duplicateNode;let hand=false,lastPoint=null;$('handTool').onclick=()=>{hand=!hand;$('handTool').classList.toggle('active',hand);$('selectTool').classList.toggle('active',!hand);$('canvas').style.cursor=hand?'grab':'default'};$('canvas').onpointerdown=e=>{if(!hand)return;lastPoint={x:e.clientX,y:e.clientY,scrollLeft:$('canvas').scrollLeft,scrollTop:$('canvas').scrollTop};$('canvas').setPointerCapture(e.pointerId)};$('canvas').onpointermove=e=>{if(!hand||!lastPoint)return;$('canvas').scrollLeft=lastPoint.scrollLeft-(e.clientX-lastPoint.x);$('canvas').scrollTop=lastPoint.scrollTop-(e.clientY-lastPoint.y)};$('canvas').onpointerup=()=>{lastPoint=null};document.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key==='d'){e.preventDefault();duplicateNode()}});
 $('languageBtn').onclick=()=>{state.language=state.language==='en'?'pt':'en';$('languageBtn').textContent=state.language==='en'?'PT':'EN';renderLibrary();renderTree();renderInspector()};$('inlineCodeBtn').onclick=()=>{state.inlineCode=!state.inlineCode;$('inlineCodeBtn').classList.toggle('active',state.inlineCode);renderTree()};$('themeBtn').onclick=()=>{state.theme=state.theme==='light'?'dark':'light';document.body.classList.toggle('dark-theme',state.theme==='dark');$('themeBtn').textContent=state.theme==='dark'?'☀':'☾';$('themeBtn').title=state.theme==='dark'?'Usar tema claro':'Usar tema escuro'};bindTypingHub();initializeMemeFeedback();resetTypingGame();renderLibrary();renderTree();renderInspector();
