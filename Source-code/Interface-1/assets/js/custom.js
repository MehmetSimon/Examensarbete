// Default onload mode is simple
var currentMode = "advanced";
var activeRule = 0;
var ruleCopy = "";

var newConfig = {
  "id":'new',
  "next-unique-id": 1,
  "name": "New Config",
  "devicesOnMap": [],
  "rules": [
  ]
};
goToNewConfig();
simpleMode();
viewTemplateManager(false);
getPresets();
getConfigs(function(data){
  var response = data;
  updateConfigsMenu(response);
});

// Some temporary hidden stuff
// TODO
$('#simple-main-view .device-box').css('pointer-events','none');
$('#simple-main-view .device-box').parent().hide();
//$('#advanced-main-view .img-responsive').hide();

//
// var config = {
//   "id": "1",
//   "next-unique-id": 9,
//   "name": "Break-in Protection",
//   "devicesOnMap": [
//       {
//           "id": "cam1",
//           "posX": "423",
//           "posY": "412"
//       },
//       {
//           "id": "cam2",
//           "posX": "253",
//           "posY": "111"
//       },
//       {
//           "id": "cam3",
//           "posX": "242",
//           "posY": "128"
//       }
//   ],
//   "rules": [
//       {
//           "preset-name": "Custom",
//           "rule-name": "Test",
//           "active-triggers": "true",
//           "active-actions": "true",
//           "triggers": [
//               {
//                   "trigger-id": 1,
//                   "device-id": "cam1",
//                   "trigger": "PIR",
//                   "data": "",
//                   "parent":0
//               },
//               {
//                   "trigger-id": 2,
//                   "device-id": "cam2",
//                   "trigger": "PIR",
//                   "data": "",
//                   "parent":0
//               },
//               {
//                   "trigger-id": 3,
//                   "device-id": "cam3",
//                   "trigger": "PIR",
//                   "data": "",
//                   "parent":0
//               },
//               {
//                   "trigger-id": 4,
//                   "device-id": "AND",
//                   "data": "",
//                   "parent":0
//               },
//               {
//                   "trigger-id": 5,
//                   "device-id": "OR",
//                   "data": "",
//                   "parent":0
//               }
//             ],
//           "actions": [
//               {
//                   "action-id": 6,
//                   "device-id": "cam1",
//                   "action": "Record",
//                   "data": ""
//               },
//               {
//                   "action-id": 7,
//                   "device-id": "cam2",
//                   "action": "Record",
//                   "data": ""
//               },
//               {
//                   "action-id": 8,
//                   "device-id": "cam3",
//                   "action": "Record",
//                   "data": ""
//               }
//           ],
//           "scedule": "always"
//       },
//       {
//         "preset-name": "custom",
//         "rule-name": "Test2",
//         "active-triggers": "true",
//         "active-actions": "true",
//         "triggers": [],
//         "actions": [],
//         "scedule": "always"
//       }
//   ]
// };

// renderConfig();

// Copy text (text)
function copyText(text){
  function selectElementText(element) {
    if (document.selection) {
      var range = document.body.createTextRange();
      range.moveToElementText(element);
      range.select();
    } else if (window.getSelection) {
      var range = document.createRange();
      range.selectNode(element);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
    }
  }
  var element = document.createElement('DIV');
  element.textContent = text;
  document.body.appendChild(element);
  selectElementText(element);
  document.execCommand('copy');
  element.remove();
}

// Copies the rule object with index rule_index to clipboard. Also creates a copy to the global variable ruleCopy
function copyRule(rule_index){
  ruleCopy = JSON.parse(JSON.stringify(config.rules[rule_index]));  // Copies the rule object, and not using reference
  copyText(JSON.stringify(ruleCopy,null,2));
  console.log("Rule #"+(rule_index+1)+" is now copied to clipboard.");
}

// Switch to the simple mode
function simpleMode(){
  $(".advanced-mode").hide();
  $(".simple-mode").show();
  currentMode = "simple";
  markCurrentConfigActiveInMenu();
}

// Switch to the advanced mode
function advancedMode(){
  $(".advanced-mode").show();
  $(".simple-mode").hide();
  currentMode = "advanced";
  markCurrentConfigActiveInMenu();
}

function viewTemplateManager(view = true){
  // Hide Tempate Manager and go back to the previous location
  if(view === false){
    // Show the following:
    // Config name title, config save/delete buttons, Show Simple/Advanced modes in menu and go back to the last mode.
    // Hide the following:
    // The template manager title, the template manager content
    useCurrentMode();
    $(".template-manager").hide();
    $("#save-config").show();
    $("#delete-config").show();
    $("#config-name").show();
    $("#template-manager-name").hide();
  }else{
    // Hide the following:
    // Config name title, config save/delete buttons, Show Simple/Advanced modes in menu
    // Show the following:
    // The template manager title, the template manager content
    $("#config-name").hide();
    $("#save-config").hide();
    $("#delete-config").hide();
    $(".advanced-mode").hide();
    $(".simple-mode").hide();
    $("#template-manager-name").show();
    $(".template-manager").show();
  }
}

function goToNewConfig(){
  var id = 'new';
  config = JSON.parse(JSON.stringify(newConfig));
  $('#config-name').text("New Config");
  markCurrentConfigActiveInMenu('new');
  activeRule = 0;
  renderConfig();
}

// Switch to current mode (Force a switch for objects that hasn't switched before)
function useCurrentMode(){
  if(currentMode === "simple"){
    simpleMode();
  }else if(currentMode === "advanced"){
    advancedMode();
  }
}

function getActiveRuleIndex(){
  return activeRule;
}

function getActiveRuleId(){
  return "#ta-rule-"+getActiveRuleIndex();
}

// Get the index in fromArray where a json-objects key is key and its values value
function getIndexFromArray(fromArray, key, value){
  var trigger_index = fromArray.map(function(d) { return d[key]; }).indexOf(value);
  if(trigger_index === undefined){
    return -1;
  }
  return trigger_index;
}

function getRuleIndexFromTriggerId(trigger_id){
  return getTriggerIndex(trigger_id, false, true);
}

function getRuleIndexFromActionId(trigger_id){
  return getActionIndex(trigger_id, false, true);
}

// Get the index of a specific trigger id, if rule_id = false, all rules
function getTriggerIndex(trigger_id, rule_id = false, return_rule_index = false){
  var array = [];
  var index = -1;
  var valid_rule_length = config.rules.length > rule_id;

  if(rule_id !== false && valid_rule_length){
    array = config.rules[rule_id].triggers;
    return getIndexFromArray(array, 'trigger-id', trigger_id);
  }else if(!valid_rule_length){
    return index;
  }else{
    $.each(config.rules, function(i){
      if(this.triggers !== undefined){
        var indexSearch = getIndexFromArray(this.triggers, 'trigger-id', trigger_id);
        if(indexSearch > -1){
          index = indexSearch;
          if(return_rule_index !== false){
            index = i;
          }
        }
      }
    });
    return index;
  }
}

// Get the index of a specific action id, if rule_id = false, all rules
function getActionIndex(action_id, rule_id = false, return_rule_index = false){
  var array = [];
  var index = -1;
  var valid_rule_length = config.rules.length > rule_id;

  if(rule_id !== false && valid_rule_length){
    array = config.rules[rule_id].actions;
    return getIndexFromArray(array, 'action-id', action_id);
  }else if(!valid_rule_length){
    return index;
  }else{
    $.each(config.rules, function(i){
      if(this.actions !== undefined){
        var indexSearch = getIndexFromArray(this.actions, 'action-id', action_id);
        if(indexSearch > -1){
          index = indexSearch;
          if(return_rule_index !== false){
            index = i;
          }
        }
      }
    });
    return index;
  }
}

// Get the index of a specific action id
// function getActionIndex(rule_id, action_id){
//   var array = config.rules[rule_id].actions;
//   return getIndexFromArray(array, 'action-id', action_id);
// }

// Get and update the next-unique-id property of the config json object.
function getUniqueId(){
  return config['next-unique-id']++;
}

// Help-function to add trigger
function addTrigger(rule_index, device_id, device_property, trigger, data, parent = 0){
  return addTA(rule_index, device_id, device_property, trigger, data, parent);
}

// Help-function to add action
function addAction(rule_index, device_id, device_property, action, data){
  return addTA(rule_index, device_id, device_property, action, data, 0, false);
}

// Help-function to remove a trigger
function removeTrigger(trigger_id, rule_index = false){
  if(rule_index === false){
    rule_index = getRuleIndexFromTriggerId(trigger_id);
  }
  removeTA(trigger_id, rule_index);
  updateHeight();
}

// Help-function to remove a action
function removeAction(action_id, rule_index = false){
  if(rule_index === false){
    rule_index = getRuleIndexFromActionId(action_id);
  }
  removeTA(action_id, rule_index, false);
  updateHeight();
}

function updateTrigger(trigger_id, key, val, rule_index = false){
  var trigger_index = getTriggerIndex(trigger_id);
  if(rule_index === false){
    rule_index = getRuleIndexFromTriggerId(trigger_id);
  }
  if(config.rules[rule_index].triggers[trigger_index][key] === undefined){
    return false;
  }
  config.rules[rule_index].triggers[trigger_index][key] = val;
  return config.rules[rule_index].triggers[trigger_index][key];
}

function updateParent(trigger_id, newParent){
  return updateTrigger(trigger_id, "parent", newParent)
}

function findFirstChild(rule_index, parent_id){
  return getIndexFromArray(config.rules[rule_index].triggers, "parent", parent_id);
}

// Moves the trigger to another rule, if andAllChildren is true all its children will be moved too.
// 1. Some getters
// 2. Copy the trigger
// 3. Remove the trigger from the rule
// 4. Push the trigger to the new rule array
// 5. Check if there is any triggers from the old rule who has this trigger as parent,
//    if so: call this function again recursively  (while-loop)
//    else: nothing happens
function moveTrigger(trigger_id, new_rule_index, andAllChildren = false){
  var old_rule_index = getTriggerIndex(trigger_id, false, true);
  var trigger_index = getTriggerIndex(trigger_id, false, false);
  var trigger = config.rules[old_rule_index].triggers[trigger_index];
  removeTrigger(trigger_id);
  config.rules[new_rule_index].triggers.push(trigger);
  var child_index = findFirstChild(old_rule_index, trigger_id);
  while(child_index !== -1 && andAllChildren === true){
    moveTrigger(config.rules[old_rule_index].triggers[child_index]['trigger-id'], new_rule_index, true);
    child_index = findFirstChild(old_rule_index, trigger_id);
  }
}

function createTriggerObject(trigger_id, device_id, device_property, trigger_name, data, parent = 0){
  if(parent === undefined){
    parent = 0;
  }
  return {
    "trigger-id": trigger_id,
    "device-id" : device_id,
    "device-property" : device_property,
    "trigger" : trigger_name,
    "data" : data,
    "parent" : Number(parent)
  }
}

// Add trigger or action
function addTA(rule_index, device_id, device_property, t_a, data, parent = 0, trigger = true){
  var unique_id = getUniqueId();
  if(trigger === true){
    config.rules[rule_index].triggers.push({
      "trigger-id": unique_id,
      "device-id" : device_id,
      "device-property" : device_property,
      "trigger" : t_a,
      "data" : data,
      "parent" : Number(parent)
    });
  }else{
    config.rules[rule_index].actions.push({
      "action-id" : unique_id,
      "device-id" : device_id,
      "device-property" : device_property,
      "action" : t_a,
      "data" : data
    });
  }
  return unique_id;
}

// Remove trigger or action
function removeTA(t_a_id, rule_index, trigger = true){
  var index = -1;
  if(trigger === true){
    index = getTriggerIndex(t_a_id, rule_index);
    if(index != -1){
      config.rules[rule_index].triggers.splice(index, 1);
    }else{
      alert("Failed to remove trigger");
    }
  }else{
    index = getActionIndex(t_a_id, rule_index);
    if(index != -1){
      config.rules[rule_index].actions.splice(index, 1);
    }else{
      alert("Failed to remove action with id "+t_a_id+", rule: "+rule_index);
    }
  }
}

function saveConfig(callback){
  var config_id = config['id'];
  return $.ajax({
    method: "POST",
    url: "backend.php",
    data: { function:"saveconfig", id:config_id, config:JSON.stringify(config) },
    success: callback
  });
}

function deleteConfig(callback){
  var config_id = config['id'];
  if(config_id === "new"){
    return false;
  }
  return $.ajax({
    method: "POST",
    url: "backend.php",
    data: { function:"deleteconfig", id:config_id },
    success: callback
  });
}

function removeFromMenu(id){
  $('#'+id).closest("li").remove();
}

function addToMenu(id, name){
  $('<li><a href="#" id="config-'+id+'" data-id="'+id+'" data-toggle="tab">'+name+'</a></li>').insertBefore("#main_menu hr:last");
}

function toggleSubmenu(property){
  $(".device-property-menu").toggle();
  $(".device-property-submenu:has([data-device-property="+property+"])").toggle();
}

function addTABox(ta, html, rule_id = false){
  if(rule_id === false){
	  rule_id = "#ta-rule-"+getActiveRuleIndex();
  }
  if(ta === 'trigger'){
    $(rule_id+' .ta-trigger .second-row .ta-placeholder-triggers').html($(rule_id+' .ta-trigger .second-row .ta-placeholder-triggers').html() + html);
  }else if(ta === 'action'){
    $(rule_id+' .ta-action .second-row .ta-placeholder-actions').html($(rule_id+' .ta-action .second-row .ta-placeholder-actions').html() + html);
  }
}

function getIcon(name){
  return $('#device-icon-list .'+name).html();
}

function printIcon(iconObject){
  return iconObject.wrap('<div class="dummyWrap"></div>').parent().html();
}

function getIconHTMLFromDeviceId(id){
  return $('.device-id-'+id).parent().find('div > .device-icon')[0];
}

function createAOBox(device_id, id){
  var device_name = getNameFromDeviceId(device_id);
  var trash_icon = $(getIcon('trash')).addClass('mini-icon').addClass('trash').css('color','red').css('padding','2px');
  var html = ''
  + '<div class="and-or-group-trigger ta-box" data-ta-id="'+id+'"><span class="headline">'+device_name+'</span>' +printIcon(trash_icon)
  + '<ul class="innerDiv ui-widget-header" data-ta-id="'+id+'"></ul>'
  + '</div>';
  return html;
}

function createTABox(device_id, device_property, trigger_name, attributes, id, action = false){
  var border_bottom = 'border-bottom:1px solid black;';
  var font_size = 'font-size:8pt;'
  var font_size2 = 'font-size:12pt;'
  var border_wrapper = '';
  var border_trigger = '';
  var device_name = getNameFromDeviceId(device_id);
  var device_icon = $(getIconHTMLFromDeviceId(device_id)).clone().addClass('ta-icon');
  var trigger_icon = $(getIcon(device_property)).addClass('mini-icon');
  var trash_icon = $(getIcon('trash')).addClass('mini-icon').addClass('trash').css('color','red').css('padding','2px');

  if(trigger_name !== false){
    border_wrapper = border_bottom;
  }
  if(attributes !== false){
    border_trigger = border_bottom;
  }else{
    attributes = "";
  }

  var temp = 'trigger';
  if(action === true){
    temp = 'action';
  }

  var timerException = "";
  if(device_id === 'timer'){
    timerException = "display:none";
    trigger_icon.removeClass('mini-icon').addClass('ta-icon');
  }

  var html = ''
  + '<li class="ta-box ui-state-default ui-widget-content" data-ta-id="'+id+'" style="border:1px solid black;display:inline-block;margin:5px;">'
  + '<div class="ta-box-wrapper" style="'+border_wrapper+'">'
  + printIcon(device_icon)
  + ' <p class="ta-box-device" style="float:left;'+font_size2+'margin:0;padding:1px;"> '+device_name+' '+ printIcon(trash_icon) + '</p>'
  + ' <div style="float:none; clear:both;"></div>'
  + '</div>'
  + '<p class="ta-box-'+temp+'" style="'+border_trigger+''+font_size+'margin:0;padding:1px;'+timerException+'">'+printIcon(trigger_icon)+' '+trigger_name+'</p>'
  + '<p class="ta-box-'+temp+'-attributes" style="'+font_size+'margin:0;padding:1px;">'+attributes+'</p>'
  /*
  + '<!-- ------------------------------------------------ -->'
  + '<!-- Image float left 25x25px? | Device name          -->'
  + '<!-- ------------------------------------------------ -->'
  + '<!-- Trigger type                                     -->'
  + '<!-- ------------------------------------------------ -->'
  + '<!-- Attributes such as the time, email address etc.. -->'
  + '<!-- ------------------------------------------------ -->'
  */
  + '</li>'
  + '';

  return html;
}

function renderTAFromConfigRule(rule_index){
	var rule_id = "#ta-rule-"+rule_index;
	// TODO???
}


// Copying the graphical rule template, adds a emptyRule object in the config array with some default values.
function addNewRule(index = -1, push = true){
  var rule_name = "New rule";
	if(index === -1){
		index = config.rules.length;
	}

	var id = "ta-rule-"+index;
  var rule_id = "#"+id;
  $('#ta-template').clone().attr("id", id).attr('data-rule-id', index).show()
    .prependTo('section').addClass('ta-rule').addClass('rendered-config');

	var emptyRule = {
		"actions":[],
		"active-actions":"true",
		"active-triggers":"true",
		"preset-name":"",
		"rule-name":"New rule",
		"schedule":"Always on",
		"triggers":[]
	}
  if(push === true){
  	// Push empty rule object to config array
  	config.rules.push(emptyRule);
  }

  rule_name = config.rules[index]['rule-name'];

  // The ID to display (one more than index/rule-id)
  $(rule_id + " .rule-id-name .rule-id").text("#"+(index+1));
  $(rule_id + " .rule-id-name .separator").text(" - ");
  $(rule_id + " .rule-id-name .rule-name").text(rule_name);


	// Marks the rule active
	activeRule = index;
  updateRulesCheckBoxes();
  addIncludeTriggerRule(index, rule_name);
  updateSortableFunction();

  return index;
}

function deleteRule(rule_index){
  config.rules.splice(rule_index,1);
  renderConfig();
}

function addIncludeTriggerRule(index, name = "New rule"){
  var html = ''
  + '<a href="#" class="list-group-item add-as-trigger rendered-config" data-device="include_trigger" data-device-property="include_trigger" data-device-property-submenu="false" data-trigger-name="'+name+'" data-trigger-name-rule-id="'+index+'" data-type="trigger">'
  +   '<span class="mini-icon">'
  +     '<span class="material-icons device-icon">attach_file</span>'
  +   '</span><span class="name">#'+(index+1)+' - '+name+"</span>"
  + '</a>'
  +'';
  $('.device-id-include_trigger .advanced-mode .device-property-menu').html($('.device-id-include_trigger .advanced-mode .device-property-menu').html() + html);
}

function markActiveRule(rule_index){
  activeRule = rule_index;
  updateRulesCheckBoxes('#ta-rule-'+rule_index);
}

// Updates the checked/unchecked checkboxes for which rule that's active. Only possible to have one active.
function updateRulesCheckBoxes(rule_id = false){
  if(rule_id === false){
    rule_id = getActiveRuleId();
  }

  var btn_on = "btn-success";
  var btn_off = "btn-warning";  // "btn-default"; // ????

	$('.current_rule').prop('checked',false);
	$(rule_id+' .current_rule').prop('checked',true);
  $('.current_rule span.glyphicon-ok').removeClass('glyphicon-ok').addClass('glyphicon-unchecked').parent().removeClass(btn_on).addClass(btn_off);
  $(rule_id+' .current_rule span.glyphicon-unchecked').removeClass('glyphicon-unchecked').addClass('glyphicon-ok').parent().removeClass(btn_off).addClass(btn_on);
}

// Load the graphics for the config object and remove the old graphics.
function renderConfig(){
  removeRenderedConfig();
  // Set the config name, if there isn't any -> use default (New Config)
  if(config.name !== undefined){
    $('#config-name h1').text(config.name).addClass('rendered-config');
  }else{
    $('#config-name').html('<h1 class="text-center">New Config</h1>');
  }

  var nbrOfRules = config.rules.length;
  // Hide template div if there are rules.
  if(nbrOfRules > 0){
    // $('#ta-template').removeClass('ta-rule').hide();
    $.each(config.rules, function(i){
      addNewRule(i, false);
      renderRule(i);
      //$(rule_id + " .label-preset").text(this['preset-name']);
    });
  }else{
    // $('#ta-template').addClass('ta-rule').show();
    addNewRule(0);  // The very first rule.
  }
  $('#ta-template').removeClass('ta-rule').hide();
  updateSimpleRules();
}

// Reset to empty view (The default start html code)
function removeRenderedConfig(){
  // Remove all elements that has the class rendered-config
  $('*').remove('.rendered-config');
  // Reset default name on the config
  $('#config-name').html('<h1 class="text-center">New Config</h1>');
}

function renderRule(rule_index){
  var rule = config.rules[rule_index];
  var triggers = buildHierarchy(rule.triggers);
  var actions = rule.actions;
  var schedule = rule.schedule;
  var name = rule['rule-name'];
  var rule_id = '#ta-rule-'+rule_index;

  // Mark as active
  markActiveRule(rule_index);
  // Render rule #id+1 - name
  $(rule_id + " span.rule-id").text("#"+(rule_index+1));
  $(rule_id + " span.rule-name").text(name);

  // Render the triggers
  var unique_temp_id = 0;
  function getTriggersHtml(triggers_array){
    var div = "";
    triggers_array.forEach(function(element, index){
      var andOr = element.value['device-id'] === "AND" || element.value['device-id'] === "OR";
      var device_id = element.value['device-id'];
      var trigger_id = element.value['trigger-id'];
      var device_property = element.value['device-property'];
      var trigger_name = element.value['trigger'];
      var data = element.value['data'];
      if(data === ""){
        data = false;
      }
      if("children" in element && (andOr)){
        var parentHtml = createAOBox(device_id, trigger_id);
        var temp_id = unique_temp_id++;
        var test = $(parentHtml)
        .addClass('temp-'+temp_id)
        .find('ul.innerDiv')
        .append(getTriggersHtml(element.children))
        .closest('.temp-'+temp_id)
        .removeClass('temp'+temp_id)
        .get(0);
        div += test.outerHTML;
      }else{
        if(andOr){
          div += createAOBox(device_id, trigger_id);
        }else{
          if(device_property === 'include_trigger'){
            device_property = "none";
          }
          div += createTABox(device_id, device_property, trigger_name, data, trigger_id);
        }
      }
    });
    return div;
  }
  addTABox("trigger", getTriggersHtml(triggers));

  // Render the schedule
  $(rule_id + ' .ta-placeholder-schedule p.text-center').text(schedule);

  // Render the actions:
  actions.forEach(function(element, index){
    var device_id = element['device-id'];
    var action_id = element['action-id'];
    var device_property = element['device-property'];
    var action_name = element['action'];
    var data = element['data'];
    if(data === "" || data === undefined){
      data = false;
    }
    var aBox = createTABox(device_id, device_property, action_name, data, action_id, true);
    addTABox("action", aBox);
  });

  // Update height (will also activate sortable)
  updateHeight();

  // Uppdate all icons
  updateRuleIcons();

}


function buildHierarchy(arry) {

    var roots = [], children = {};

    // find the top level nodes and hash the children based on parent
    for (var i = 0, len = arry.length; i < len; ++i) {
        var item = arry[i],
            p = item.parent,
            target = !p ? roots : (children[p] || (children[p] = []));

        target.push({ value: item });
    }

    // function to recursively build the tree
    var findChildren = function(parent) {
        if (children[parent.value['trigger-id']]) {
            parent.children = children[parent.value['trigger-id']];
            for (var i = 0, len = parent.children.length; i < len; ++i) {
                findChildren(parent.children[i]);
            }
        }
    };

    // enumerate through to handle the case where there are multiple roots
    for (var i = 0, len = roots.length; i < len; ++i) {
        findChildren(roots[i]);
    }

    return roots;
}





// Get the name from the device with id (id)
function getNameFromDeviceId(id){
  return $('.device-id-' + id).data('device-name');
}

// Update config rule height to fit the triggers/actions inside.
// This function should be called every time something graphical is changed inside the rule.
function updateHeight(rule_id = false){
  updateAllRuleIcons();
  if(rule_id === false){
    rule_id = "#ta-rule-"+getActiveRuleIndex();
  }

  var actionsHeight = $(rule_id + ' .ta-placeholder-actions').outerHeight();
  var triggersHeight = $(rule_id + ' .ta-placeholder-triggers').outerHeight();
  var newHeight = Math.max.apply(Math,[actionsHeight,triggersHeight]) + $(rule_id + ' .ta-head').outerHeight();;
  $(rule_id + ' .ta-content').height(newHeight);
  $(rule_id + ' .ta-content .ta-schedule').height(newHeight);

  updateSortableFunction();

}

function updateAllRuleIcons(){
  config.rules.forEach(function(element, index){
    updateRuleIcons(index);
  });
}

function updateRuleIcons(rule_index = false){
  var rule_id = getActiveRuleId();
  if(rule_index !== false){
    rule_id = "#ta-rule-"+rule_index;

  }
  // Trigger icons
  var html = "";
  $(rule_id+' .ta-placeholder-triggers .ta-box-trigger .device-icon').each(function(i){
    var newIconHtml = $(rule_id+' .ta-placeholder-triggers .ta-box-trigger .device-icon').get(i).outerHTML;
    if(html.indexOf(newIconHtml) == -1){
      html += newIconHtml;
    }
  });
  $(rule_id+" .trigger-icons").html(html);

  // Action icons
  html = "";
  $(rule_id+' .ta-placeholder-actions .ta-box-action .device-icon').each(function(i){
    var newIconHtml = $(rule_id+' .ta-placeholder-actions .ta-box-action .device-icon').get(i).outerHTML;
    if(html.indexOf(newIconHtml) == -1){
      html += newIconHtml;
    }
  });
  $(rule_id+" .action-icons").html(html);
}

function updateSortableFunction(){
  $( function() {
    $( ".second-row ul" ).sortable({
        stop:function(event, ui){
          updateHeight();
          var parentId = $(ui.item[0]).parent().data('ta-id');
          var itemId = $(ui.item[0]).data('ta-id');
          var oldParentId = $(event.target).data('ta-id');
          var rule_index = $(ui.item[0]).parent().closest('.ta-rule').data('rule-id');
          var old_rule_index = getRuleIndexFromTriggerId(itemId);
          if(rule_index !== old_rule_index){
            moveTrigger(itemId, rule_index, true);
            updateHeight("#ta-rule-"+old_rule_index);
          }
          updateHeight("#ta-rule-"+rule_index);
          updateParent(itemId, parentId);
        },
        scroll: true,
        scrollSpeed: 10 ,
        scrollSensitivity: 10,
        connectWith: '.innerDiv, .ta-placeholder-triggers',
        placeholder: 'ui-state-highlight',
        revert: false,
        snap:true
      }
    );
  $( ".second-row ul" ).disableSelection();
  });
}


function showYesNoPrompt(title, msg){
  var confirm_element = ''
  + '<div id="dialog-confirm" title="'+title+'">'
  + '  <p><span class="ui-icon ui-icon-alert" style="float:left; margin:12px 12px 20px 0;"></span>'+msg+'</p>'
  + '</div>';

  $( confirm_element ).dialog({
    resizable: false,
    height: "auto",
    width: 400,
    modal: true,
    buttons: {
      "Yes": function() {
        $( this ).dialog( "close" );
        return true;
      },
      "No": function() {
        $( this ).dialog( "close" );
        return false;
      }
    }
  });
}

function savePreset(rule_index, preset_index, callback){
  var preset = JSON.stringify(config.rules[rule_index]);
  $.ajax({
    method: "POST",
    url: "backend.php",
    data: { function:"savepreset", index:preset_index, preset:preset },
    success: callback
  });
  // new presets has id: new
  // TODO
  //Gör en ajax-request mot servern för att spara preset. Skicka sedan notify nedan när den är sparad.

}

function loadPreset(rule_index, preset_index, callback = false){
  getPreset(preset_index, function(data){
    var response = data;
    addTriggersToRule(response['triggers'],rule_index);
    addActionsToRule(response['actions'],rule_index);
    config.rules[rule_index].schedule = response['schedule'];
    config.rules[rule_index]['rule-name'] = response['rule-name'];
    if(callback !== false){
      callback();
    }
  });
  // 1. Hämta presets
  // 2. Ladda preset m.h.a. funktionerna addTriggersToRule och addActionsToRule,
  //    glöm inte bort schemat och namnet
}

function updateConfigsMenu(items = false){
  if(items === false){
    items = configs;
  }
  $('.configMenuItem').remove();
  items.forEach(function(element,index){
    var listItem = '<li data-id="'+element['id']+'"><a href="#" data-toggle="tab">'+element['name']+'</a></li>';
    $(listItem).addClass('configMenuItem').insertBefore('.insertBeforeMe')
  });
}

function updateSimpleRules(){
  $('#simple_current_rules').empty();
  config.rules.forEach(function(element, index){
    var add = true;
    if(config.rules[index].triggers.length === 0 && config.rules[index].actions.length === 0){
      if(config.rules[0]['rule-name'] === "New rule"){
        add = false;
      }
    }
    if(add === true){
      var t_icons = $('#ta-rule-'+index+' .trigger-icons').get(0).innerHTML;
      var a_icons = $('#ta-rule-'+index+' .action-icons').get(0).innerHTML;
      var trash = getIcon('trash');
      $('#simple_current_rules').prepend('<li class="list-group-item rendered-config" data-rule-id="'+index+'"><span class="simple_rule_name">'+element['rule-name']+'</span><span class="remove-rule">'+trash+'</span><span class="ta_summary"><strong>T</strong>: '+t_icons+' <strong>A</strong>: '+a_icons+'</span></li>');
    }
  });

}

function getConfig(id, callback){
  return $.ajax({
    method: "POST",
    url: "backend.php",
    data: { function:"getconfig", id:id },
    success: callback
  });
}

function getConfigs(callback){
  return $.ajax({
    method: "POST",
    url: "backend.php",
    data: { function:"getconfiglist" },
    success: callback
  });
}

function getPreset(preset_index, callback){
  return $.ajax({
    method: "POST",
    url: "backend.php",
    data: { function:"getpreset", index:preset_index },
    success: callback
  })
}

function getPresets(callback){
  return $.ajax({
    method: "POST",
    url: "backend.php",
    data: { function:"getpresetlist" },
    success: callback
  // })
  //   .done(function( response ) {
  //   	presets = response;
    });
  // TODO
  // Gör en ajax-request mot servern för att hämta presets.
  //return [{"rule-name":"BANANAS"},{"rule-name":"En cool regel"},{"rule-name":"En annan cool regel"},{"rule-name":"Jag har ingen fantasi..."},{"rule-name":"Test 2"}];
}

function getAllPresetLoadButtonsHtml(rule_index, presets, save = false){
  var saveClass = "";
  if(save === true){
    saveClass = "savePresetRule";
  }else if(save === -1){
    saveClass = "loadAndAddPresetRule";
  }
  var html = '<div class="btn-group" role="group">';

  presets.forEach(function(element, index){
    var name = element['rule-name'];
    html += '<button class="btn btn-default loadPresetRule '+saveClass+'" tabindex="-1" data-rule-index="'+rule_index+'" data-preset-id="'+index+'" type="button">'+name+'</button><br/><br/>'
  });
  if(presets.length <= 0){
    html += '<p>No presets found.</p>';
  }

  if(save === true){
    html += '<button class="btn btn-default loadPresetRule '+saveClass+'" tabindex="-1" data-rule-index="'+rule_index+'" data-preset-id="new" type="button"># New preset #</button><br/><br/>';
  }
  html += '</div>';
  return html;
}

// Copies an array of triggers to a specific rule (with new IDs)
function addTriggersToRule(triggersArray, rule_index){
  // Add new triggers with new Ids and new parent connections.
  var newIds = {};
  var newTriggers = [];
  triggersArray.forEach(function(element, index){
    var device_id = element['device-id'];
    var trigger_id = element['trigger-id'];
    var device_property = element['device-property'];
    var trigger_name = element['trigger'];
    var data = element['data'];
    var parent = element['parent'];
    var new_id = getUniqueId();
    var newTrigger = createTriggerObject(new_id, device_id, device_property, trigger_name, data, parent);
    newTriggers.push(newTrigger);
    newIds[trigger_id] = new_id;
  });
  // Update the parents to the new ids
  newTriggers.forEach(function(element, index){
    if(element['parent'] !== 0 && element['parent'] !== undefined){
      element['parent'] = newIds[element['parent']];
    }
  });
  newTriggers.forEach(function(element, index){
    config.rules[rule_index].triggers.push(element);
  });
}

// Copies an array of actions to a specific rule (with new IDs)
function addActionsToRule(actionsArray, rule_index){
  actionsArray.forEach(function(element, index){
    var device_id = element['device-id'];
    var device_property = element['device-property'];
    var action_name = element['action'];
    var data = element['data'];
    addAction(rule_index, device_id, device_property, action_name, data);
  });
}


function markCurrentConfigActiveInMenu(id = false){
  var config_id = config.id;
  if(id !== false){
    config_id = id;
  }
  $('#main_menu li').removeClass('active');
  $('#main_menu li[data-id="'+config_id+'"]').addClass('active');
}

function replaceDeviceId(rule_index, currentDeviceId, newDeviceId){
  config.rules[rule_index].triggers.forEach(function(element, index){
    if(element['device-id'] === currentDeviceId){
      element['device-id'] = newDeviceId;
    }
  });
  config.rules[rule_index].actions.forEach(function(element, index){
    if(element['device-id'] === currentDeviceId){
      element['device-id'] = newDeviceId;
    }
  });
  renderConfig();
}

function getDeviceIdFromTrigger(trigger_id){
  var rule_index = getRuleIndexFromTriggerId(trigger_id);
  var trigger_index = getTriggerIndex(trigger_id);
  return config.rules[rule_index][trigger_index]['device-id'];
}

function renderTemplateManager(){
  // TODO
}

function addTemplate(){
  // TODO
}

function removeTemplate(){
    // TODO
}

function constructArray(){
  // TODO
}

//
// function showTrashDiv(element){
//   toggleTrashDiv(element);
// }
//
// function hideTrashDiv(element){
//   toggleTrashDiv(element, false);
// }
//
// function toggleTrashDiv(element, show = true){
//   if(show === true){
//     $(element).closest('.second-row').parent().find('.droppableTrash').parent().show();
//   }else{
//     $(element).closest('.second-row').parent().find('.droppableTrash').parent().hide();
//   }
// }


/*
function calculateTriggerRelationArray(placeholder_triggers_object, array = []){
  placeholder_triggers_object.children().each(function(){
    var ta_id = $(this).data('ta-id');
    if($(this).get(0).nodeName === 'LI'){
      array.push(ta_id);
    }else if($(this).get(0).nodeName === 'DIV'){
      array.push(calculateTriggerRelationArray($($(this)).find('ul'),[ta_id]));
    }
  });
  return array;
}*/

// function calculateTriggerRelationArray(trigger_list){
//   var array = [];
//     trigger_list.each(function(){
//       console.log($(this).data('ta-id'))
//       if($(this).get(0).nodeName === 'UL'){
//
//       }
//     });
// }

// function updateTriggerRelation(old_parent, new_parent, child, rule_index){
  // $('.ta-rule').each(function(){
  //   var rule_id = $(this).data('rule-id');
  //   var allTriggers = $(this).find('.ta-placeholder-triggers li, .ta-placeholder-triggers ul');
  //   var trigger_relation = calculateTriggerRelationArray(placeholder_triggers);
  //   console.log(trigger_relation);
  //   config.rules[rule_id]['trigger-relation'] = trigger_relation;
  // });

  // Hämta alla föräldrar
  // Spara i en array
  // Kolla för alla föräldrar om deras barn är förälder

//   var triggers = config.rules[rule_index].triggers;
//   var htmlObjects = [];
//   var temp_parents = [];
//
//   // Add children and parents to each array.
//   $.each(triggers, function(){
//     if(this['device-id'] === "AND" || this['device-id'] === "OR"){
//       temp_parents.push(this);
//     }
//   });
//
//   var maxIterations = 2000;
//   while(temp_parents.length != 0 || maxIterations < 0){
//     $.each(temp_parents, function(i){
//       var this_children = this.data;
//       if(Array.isArray(this_children)){
//         if(this_children.length <= 0){
//           temp_parents.pop(i);
//         }
//         var hasNoChildParents = false;
//         $.each(this_children, function(){
//           for(i2 = 0; i2 < temp_parents.length;i2++){
//             if (temp_parents[i2] === this){
//               hasNoChildParents = true; // This is a parent
//             }
//           }
//         });
//       }else{
//         temp_parents.pop(i);
//       }
//     });
//     if(!hasNoChildParents){
//       // Skapa grafiskt objekt i minnet, ta bort från temp_parents.
//       var myChildren = this.data;
//       var myselfHtml = createAOBox(this['device-id'], this['trigger-id']);
//       $.each(myChildren, function(){
//         var device_property = 'input';    // CHANGE THIS!!!!
//         var myChildHtml = createTABox(this['device-id'], device_property, "" , this['data'], this['trigger-id']);
//         $(myselfHtml).find('ul').append(myChildHtml);
//       });
//       // BLAÖÄBMAKÖSDJHNÖALKJDÖKLASJDKÖLSAJDKÖSAJDKÖLAS BANANAS!-
//
//
//       temp_parents.pop(i);
//     }
//     maxIterations--;
//   }
//
//
// }


/* ------------------------------------------------------------------ */
/* ---------------------- Clicker functionality --------------------- */
/* ------------------------------------------------------------------ */

  // Switch to simple mode
  $(document).on('click', '#goSimple', function(){
    simpleMode();
  });

  // Switch to advanced mode
  $(document).on('click', '#goAdvanced', function(){
    advancedMode();
  });

  // Switch to advanced mode
  $(document).on('click', '#template-manager-view .go-back', function(){
    viewTemplateManager(false);
    renderConfig();
  });

  // Switch to Template Manager
  // $(document).on('click', '#goTemplateManager', function(){
  //   viewTemplateManager();
  // });

  // Main menu item clicked
  $(document).on('click', '#main_menu', function(){
    var id = $(event.target).closest('li').data("id");
    if(Number.isInteger(id)){
      getConfig(id, function(data){
        var response = data;
        config = response;
        renderConfig();
        getConfigs(function(data){
          var response = data;
          updateConfigsMenu(response);
          markCurrentConfigActiveInMenu();
        });
      });
    }else if(id === 'new'){
      goToNewConfig();
    }
    // Switch to template manager if pressed, otherwise -> switch back
    if(id === 'template-manager'){
      viewTemplateManager();
    }else{
      viewTemplateManager(false);
      renderConfig();
    }
  });

  // Save a config
  $(document).on('click', '#save-config', function(){
    var thisConfigId = config['id'];
    saveConfig(function(data){
      if(data.status === true){
        config = data.savedConfig;
        if(data.id === thisConfigId){
          // This is an existing id
          $.notify("Config update was saved successfully",{position:"top center", className:"success"});
        }else{
          // This id is new. Update the menu and mark active.
          getConfigs(function(data){
            var response = data;
            updateConfigsMenu(response);
            renderConfig();
            markCurrentConfigActiveInMenu();
          });
          $.notify("New config was successfully saved",{position:"top center", className:"success"});
        }
      }else{
        alert("Failed to save your config, reason unknown.");
      }
    });
  });

  // Delete a config
  $(document).on('click', '#delete-config', function(){

    // Confirmation popup
    var title = "Delete rule confirmation";
    var msg = "Are you sure you want to delete this config?";
    var confirm_element = ''
    + '<div id="dialog-confirm" title="'+title+'">'
    + '  <p><span class="ui-icon ui-icon-alert" style="float:left; margin:12px 12px 20px 0;"></span>'+msg+'</p>'
    + '</div>';

    $( confirm_element ).dialog({
      resizable: false,
      height: "auto",
      width: 400,
      modal: true,
      buttons: {
        "Yes": function() {
          $( this ).dialog( "close" );
          deleteConfig(function(data){
            if(data.status === true){
              $.notify("Config successfully deleted.",{position:"top center", className:"success"});
              getConfigs(function(data){
                var response = data;
                updateConfigsMenu(response);
                goToNewConfig();
              });
            }else{
              $.notify("Failed to delete config. Unknown error.",{position:"top center", className:"fail"});
            }
          });
        },
        "No": function() {
          $( this ).dialog( "close" );
        }
      }
    });


  });

  // Rename the config
  $(document).on('click', '#config-name h1', function(){
    //var currentName = $("#config-name h1").text();
    var currentName = config.name;
    var name = prompt("Please enter a name", currentName);
    if(name != null){
      $(this).text(name);
      config.name = name;
      var id = $('.configMenuItem.active').data("id");
      $('#config-'+id).text(name);
      $('li.configMenuItem[data-id="'+id+'"] a').text(name);
      // $('li.configMenuItem[data-id="2"] a').text("test");
    }
  });

  // Set rule name
  $('body').on('click','.rule-id-name',function(){
    var rule_name = $(this).find('span.rule-name');
    var currentName = rule_name.text();
    var name = prompt("Please enter a name", currentName);
    if(name == null){
      name = currentName;
    }
    var id = $(this).closest('.ta-rule').data('rule-id');
    config.rules[id]['rule-name'] = name;
    rule_name.text(name);
    $('.device-id-include_trigger a[data-trigger-name-rule-id="'+(id)+'"] span.name').text("#"+(id+1)+" - "+name);
    console.log('.device-id-include_trigger a[data-trigger-name-rule-id="'+(id)+'"] span.name');
    var changedInConfig = false;
    config.rules[id].triggers.forEach(function(element, index){
      if(element.trigger === "#"+(id+1)+" - "+currentName){
        element.trigger = "#"+(id+1)+" - "+name;
        changedInConfig = true;
      }
    });
    if(changedInConfig === true){
      renderConfig();
    }

  });

  $(document).on('click','.minimize', function(){
    $(this).closest('.ta-control').find('.ta-content').slideToggle('slow');
    $(this).closest('.ta-rule').find('.ta-preset-control').slideToggle('slow');
  });

  $(document).on('click','.current_rule', function(){
	  activeRule = $(this).closest('.ta-rule').data('rule-id');
    updateRulesCheckBoxes();
  });

  $(document).on('click','.add-preset-btn', function(){
    alert("Show a list of presets to choose from.");

  });

  $(document).on('click','button.add-rule:not(.hidden)', function(){
    addNewRule(config.rules.length);
  });

  $(document).on('click','button.remove-rule:not(.hidden), #simple_current_rules .remove-rule', function(){
    var rule_index = $(this).closest('.ta-rule').data('rule-id');
    if(rule_index === undefined){
      rule_index = $(this).closest('li.list-group-item.rendered-config').data('rule-id');
    }
    console.log(rule_index);
    // Confirmation popup
    var title = "Delete rule confirmation";
    var msg = "Are you sure you want to delete this rule?";
    var confirm_element = ''
    + '<div id="dialog-confirm" title="'+title+'">'
    + '  <p><span class="ui-icon ui-icon-alert" style="float:left; margin:12px 12px 20px 0;"></span>'+msg+'</p>'
    + '</div>';

    $( confirm_element ).dialog({
      resizable: false,
      height: "auto",
      width: 400,
      modal: true,
      buttons: {
        "Yes": function() {
          $( this ).dialog( "close" );
          deleteRule(rule_index);
        },
        "No": function() {
          $( this ).dialog( "close" );
        }
      }
    });
  });

  $( function() {
    $( "#selectable" ).selectable();
  } );


  $(document).on('click','.loadPresetRule:not(.savePresetRule, .loadAndAddPresetRule)', function(){
    console.log("Log");
    var id = ($(this).data('preset-id'))
    var rule_index = $(this).data('rule-index');
    loadPreset(rule_index, id, function(){renderConfig();});
    $.notify("Preset loaded",{position:"top center", className:"info"});
  });

  $(document).on('click','button.load-preset-btn', function(){
    var rule_index = $(this).closest('.ta-rule').data('rule-id');
    var simple_view = $(this).closest('#simple-main-view');
    var this_is_simple_view = false;
    if(simple_view.length > 0){
      this_is_simple_view = -1;
    }
    getPresets(function(data){
        var response = data;
        var presetHtml = getAllPresetLoadButtonsHtml(rule_index, response, this_is_simple_view);
        var title = "Load preset rule";
        var msg = "Click on a preset from the list below to load it.";
        var dialog_element = ''
        + '<div id="dialog-confirm" title="'+title+'">'
        + '  <p><span class="ui-icon ui-icon-folder-open" style="float:left; margin:12px 12px 20px 0;"></span>'+msg+'</p><hr>'
        +    presetHtml
        + '</div>';

        $( dialog_element ).dialog({
          resizable: false,
          height: "auto",
          width: 400,
          modal: true,
          buttons: [
            {
              text:"Okey",
              click: function(){
                $(this).dialog("close");
              },
              tabindex: 0
            }
          ]
        });
      });
  });

  // The preset saver, this eventListener listens for when the savePresetRule button is pressed.
  $(document).on('click','.savePresetRule', function(){
    var id = $(this).data('preset-id');
    var rule_index = $(this).data('rule-index');
    savePreset(rule_index, id, function(data){
      $.notify("Preset saved",{position:"top center", className:"success"});
    });
  });

  // The preset saver and rule adder, this eventListener listens for when the savePresetRule button is pressed in simple view.
  $(document).on('click','.loadAndAddPresetRule', function(){
    var id = $(this).data('preset-id');
    loadPreset(addNewRule(), id, function(){
      renderConfig();
    });
    $.notify("Preset loaded",{position:"top center", className:"info"});
  });

  // When the preset save button is pressed
  $(document).on('click','button.save-preset-btn', function(){
    var rule_index = $(this).closest('.ta-rule').data('rule-id');
    getPresets(function(data){
      var title = "Save preset rule";
      var msg = "Click on a preset to overwrite it, click new preset to create a new preset.";
      var dialog_element = ''
      + '<div id="dialog-confirm" title="'+title+'">'
      + '  <p><span class="ui-icon ui-icon-folder-open" style="float:left; margin:12px 12px 20px 0;"></span>'+msg+'</p><hr>'
      + getAllPresetLoadButtonsHtml(rule_index, data, true)
      + '</div>';
      $( dialog_element ).dialog({
        resizable: false,
        height: "auto",
        width: 400,
        modal: true,
        buttons: {
          "Okey" : function(){
            $(this).dialog("close");
          }
        }
      });
    });
  });

  $(document).on('click','button.copy-preset-btn', function(){
    var rule_index = $(this).closest('.ta-rule').data('rule-id');
    $.notify("Preset copied",{position:"top center", className:"info"});
    copyRule(rule_index);
  });

  $(document).on('click','button.paste-preset-btn', function(){
    var rule_index = $(this).closest('.ta-rule').data('rule-id');

    // Confirmation popup
    var title = "Paste-append rule confirmation";
    var msg = "Are you sure you want to paste to this rule? It will append the copy to the current rule?<br/><br/><br/>(It's only the triggers and the actions that will be pasted)";
    var confirm_element = ''
    + '<div id="dialog-confirm" title="'+title+'">'
    + '  <p><span class="ui-icon ui-icon-alert" style="float:left; margin:12px 12px 20px 0;"></span>'+msg+'</p>'
    + '</div>';

    $( confirm_element ).dialog({
      resizable: false,
      height: "auto",
      width: 400,
      modal: true,
      buttons: {
        "Yes": function() {
          $( this ).dialog( "close" );
          if(ruleCopy !== ""){

            addTriggersToRule(ruleCopy.triggers, rule_index);
            addActionsToRule(ruleCopy.actions, rule_index);

            $.notify("Preset pasted",{position:"top center", className:"info"});

          }else{
            // If nothing was copied, show dialog
            var dialog_element = ''
            + '<div id="dialog" title="Rule copy missing">'
            +   '<p>Nothing was copied, please try to copy a rule before trying to paste it.</p>'
            +  '</div>';

            $( dialog_element ).dialog({
              resizable: false,
              height: "auto",
              width: 400,
              modal: true,
              buttons: {
                "Okey": function(){
                  $(this).dialog("close");
                }
              }
            });
          }
          // addTrigger(rule_index, device_id, device_property, trigger_name, attributes);
          // config.rules[rule_index] = ruleCopy;
          renderConfig();
          // DETTA MÅSTE ÄNDRAS! BARA TILLFÄLLIGT TEST!
          // Ingen bra idé att kopiera alla id:n för triggers och actions.
          // Dessa borde gnerereras om!
          // TODO!
        },
        "No": function() {
          $( this ).dialog( "close" );
        }
      }
    });
  });

  $(document).on('click','.not_implemented', function(){
    var dialog_element = ''
    + '<div id="dialog" title="Basic dialog">'
    +   '<p>This function isn\'t implemented in this prototype.</p>'
    +  '</div>';

    $( dialog_element ).dialog({
      resizable: false,
      height: "auto",
      width: 400,
      modal: true,
      buttons: {
        "Okey": function(){
          $(this).dialog("close");
        }
      }
    });
  });



  // Schedule button click and its actions.
  $(document).on('click','.ta-placeholder-schedule button', function(){
    var this_element = this;
    var dialog_element = ''
    +'<div id="dialog-confirm" title="Create Schedule">'
    + '<p><span style="float:left; margin:12px 12px 20px 0;">'+getIcon('calendar')+'</span>This schedule function isn\'t implemented in this prototype. Please choose the schedule type instead on the buttons below.</p>'
    +'</div>';
    var rule_id = $( this ).closest('[data-rule-id]').data('rule-id');

    $( dialog_element ).dialog({
      resizable: false,
      height: "auto",
      width: 400,
      modal: true,
      buttons: {
        "Always on": function() {
          $( this ).dialog( "close" );
          config.rules[rule_id].schedule = "Always on"; // save to config
          $( this_element ).closest('.ta-placeholder-schedule').find('p.text-center').text("Always on");  // Change the graphical element
        },
        "Specific": function() {
          $( this ).dialog( "close" );
          config.rules[rule_id].schedule = "Specific"; // save to config
          $( this_element ).closest('.ta-placeholder-schedule').find('p.text-center').text("Specific");  // Change the graphical element
        },
        Cancel: function() {
          $( this ).dialog( "close" );
        }
      }
    });
  });


  /* Device menu stuff */

    // Show device properties when device icon is clicked
    $(document).on('click','.device-icon',function(){
      $(this).parent().find('.device-menu').toggle();
    });

    // Display submenu from device list properties
    $(document).on('click','.device-menu .list-group-item',function(){
      var hasSubmenu = $(this).data('device-property-submenu');
      if(hasSubmenu === true){
        var property = $(this).data('device-property');
        toggleSubmenu(property)
      }
    });

    // Go back button for the submenu in device list
    $(document).on('click','.device-menu .go-back',function(){
      toggleSubmenu($(this).data('device-property'));
    });

    // If the device menu is opened and a click is registered outside the menu:
    // The menu will close and if a submenu is displayed, the main menu will be restored.
    $(document).on('mouseup',document,function(e){
        var container = $(".device-menu");

        // if the target of the click isn't the container nor a descendant of the container
        if (!container.is(e.target) && container.has(e.target).length === 0)
        {
            // Hide submenu -> show main menu -> hide menu box (container)
            $('.device-property-submenu').hide();
            $('.device-property-menu').show();
            container.hide();
        }
    });

// data-trigger -> Namnet på trigger_name   (same stuff for data-action)
// data-device-property -> Trigger typen  (microphone, timer, include_trigger, and, or etc..)
// data-device -> device_id

    // Add as trigger
    $(document).on('click','.device-menu .add-as-trigger',function(){
      var rule_index = getActiveRuleIndex();
      var device_id = $(this).data('device');
      var device_name = getNameFromDeviceId(device_id);
      var device_property = $(this).data('device-property');
      var trigger_name = $(this).data('trigger-name');

      if(device_property === 'timer'){
        var radio = $(this).parent().find('input[type="radio"]:checked');
        var number = $(this).parent().find('input[type="number"]');
        if(radio.length > 0){
          var attributes = number.val() + ' ' + radio.data('short');
          var id = addTrigger(rule_index, device_id, device_property, trigger_name, attributes);
          var triggerDiv = createTABox(device_id, device_property, trigger_name, attributes, id);
          addTABox("trigger", triggerDiv);
          toggleSubmenu(device_property);
        }
      }else if(device_property === 'microphone'){
        var radio = $(this).parent().find('input[type="radio"]:checked');
        if(radio.length > 0){
          var attributes = radio.val();
          var id = addTrigger(rule_index, device_id, device_property, trigger_name, attributes);
          var triggerDiv = createTABox(device_id, device_property, trigger_name, attributes, id);
          addTABox("trigger", triggerDiv);
          toggleSubmenu(device_property);
        }else{
          alert("You need to check one of the radio buttons.");
        }
      }else if(device_property === "and" || device_property === "or"){
        var id = addTrigger(rule_index, device_id, device_property, trigger_name, "");
        var triggerDiv = createAOBox(device_id, id);
        addTABox("trigger", triggerDiv);
      }else if(device_property == 'include_trigger'){
        var attributes = $(this).data('trigger-name-rule-id');
        trigger_name = $(this).find('span.name').text();
        var id = addTrigger(rule_index, device_id, device_property, trigger_name, "");
        var triggerDiv = createTABox(device_id, "none", trigger_name, false, id);
        addTABox("trigger", triggerDiv);

      }else{
        var id = addTrigger(rule_index, device_id, device_property, trigger_name, "");
        var triggerDiv = createTABox(device_id, device_property, trigger_name, false, id);
        addTABox("trigger", triggerDiv);
      }
      updateHeight();
    });


    // Add as action
    $(document).on('click','.device-menu .add-as-action',function(){
      var rule_index = getActiveRuleIndex();
      var device_id = $(this).data('device');
      var device_name = getNameFromDeviceId(device_id);
      var device_property = $(this).data('device-property');
      var action_name = $(this).data('action-name');

      if(device_property === 'light'){
        var radio = $(this).parent().find('input[type="radio"]:checked');
        if(radio.length > 0){
          var attributes = radio.val();
          var id = addAction(rule_index, device_id, device_property, action_name, attributes);
          var actionDiv = createTABox(device_id, device_property, action_name, attributes, id, true);
          addTABox("action", actionDiv);
          toggleSubmenu(device_property);
        }else{
          alert("You need to check one of the radio buttons.");
        }
      }else if(device_property === 'email' || device_property === 'http'){
        var textarea = $(this).parent().find('textarea').val();
        if(textarea !== undefined && textarea !== ''){
          var attributes = textarea.split("\n").join("<br/>");
          var id = addAction(rule_index, device_id, device_property, action_name, attributes);
          var actionDiv = createTABox(device_id, device_property, action_name, attributes, id, true);
          addTABox("action", actionDiv);
          toggleSubmenu(device_property);
        }else{
          var temp = "email address";
          if(device_property === 'http'){
            temp = 'http url';
          }
          alert("Please type at least one "+temp+" in the textbox.");
        }
      }else if(device_property === 'timer_reset'){
        var attributes = $(this).html();
        var id = addAction(rule_index, device_id, device_property, action_name, attributes);
        var actionDiv = createTABox(device_id, device_property, action_name, attributes, id, true);
        addTABox("action", actionDiv);
        console.log(attributes);

      }else{
        var id = addAction(rule_index, device_id, device_property, action_name, attributes);
        var actionDiv = createTABox(device_id, device_property, action_name, false, id, true);
        addTABox("action", actionDiv);
      }
      updateHeight();
    });

    $(document).on('dblclick','li.ta-box',function(){

      if($(this).find('.glyphicon-facetime-video')[0] !== undefined){
        var name = $(this).find('.ta-box-device').text();
        var rule_index = getRuleIndexFromTriggerId($(this).data('ta-id'));
        var old_device_id = config.rules[rule_index].triggers[getTriggerIndex($(this).data('ta-id'))]['device-id'];
        if(rule_index === -1){
          rule_index = getRuleIndexFromActionId($(this).data('ta-id'));
          old_device_id = config.rules[rule_index].triggers[getActionIndex($(this).data('ta-id'))]['device-id'];
        }
        // Confirmation popup
        var title = "Replace device";
        var msg = "Pick a device to replace "+name+" with. This is applied to the entire rule (both actions and triggers)";
        var confirm_element = ''
        + '<div id="dialog-confirm" title="'+title+'">'
        + '  <p><span class="ui-icon ui-icon-alert" style="float:left; margin:12px 12px 20px 0;"></span>'+msg+'</p>'
        + '</div>';

        $( confirm_element ).dialog({
          resizable: false,
          height: "auto",
          width: 400,
          modal: true,
          buttons: {
            "Cam 1": function() {
              $( this ).dialog( "close" );
              replaceDeviceId(rule_index, old_device_id, "cam1");
            },
            "Cam 2": function() {
              $( this ).dialog( "close" );
              replaceDeviceId(rule_index, old_device_id, "cam2");
            },
            "Cam 3": function() {
              $( this ).dialog( "close" );
              replaceDeviceId(rule_index, old_device_id, "cam3");
            },
            "Cam 4": function() {
              $( this ).dialog( "close" );
              replaceDeviceId(rule_index, old_device_id, "cam4");
            },
            "Cancel": function() {
              $( this ).dialog( "close" );
            }
          }
        });
      }
    })

    // Go delete button for the Action/Trigger
    $(document).on('click','.ta-box .trash',function(){
      var this_element = this;
      var this_ta_box = $( this_element ).closest(".ta-box[data-ta-id]");
      var id = $(this_ta_box).data('ta-id');
      var this_children = this_ta_box.find('.ta-box[data-ta-id]');
      var extra = "";
      var ta = "trigger";

      if($(this_element).closest('.second-row').parent().hasClass('ta-action') === true){
        ta = "action";
      }

      if(this_children.length > 0){
        extra = " and all containing "+ta+"s";
      }


      var confirm_element = ''
      + '<div id="dialog-confirm" title="Delete '+ta+' confirmation">'
      + '  <p><span class="ui-icon ui-icon-alert" style="float:left; margin:12px 12px 20px 0;"></span>Are you sure you want to delete this '+ta+extra+'?</p>'
      + '</div>';

      $( confirm_element ).dialog({
        resizable: false,
        height: "auto",
        width: 400,
        modal: true,
        buttons: {
          "Yes": function() {
            $( this ).dialog( "close" );
            $.each(this_children, function(){
              if(ta === "trigger"){
                removeTrigger($(this).data('ta-id'));
              }else{
                removeAction($(this).data('ta-id'));
              }
            });
            $(this_ta_box).remove();
            if(ta === "trigger"){
              removeTrigger(id);
              $.notify("Trigger removed",{position:"top center", className:"warn"});
            }else{
              removeAction(id);
              $.notify("Action removed",{position:"top center", className:"warn"});
            }
          },
          "No": function() {
            $( this ).dialog( "close" );
          }
        }
      });
    });
