<?php
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}
header('Content-Type: application/json');

function save($array, $filename = "globaldb.json"){
  if(isset($_SESSION['filename'])){
    if($_SESSION['activeTest'] === false){
        die();
    }
    $filename = '../Testing/databases/'.$_SESSION['filename'].'.json';
  }
  saveContent($filename, htmlspecialchars(json_encode($array, JSON_PRETTY_PRINT),ENT_HTML5,"UTF-8"));
}

function saveContent($filename, $content){
  try {
    file_put_contents($filename, $content);
  }
  catch (Exception $e) {
      echo $e->getMessage();
  }
}

function load($filename = "globaldb.json"){
  if(isset($_SESSION['filename'])){
    $filename = '../Testing/databases/'.$_SESSION['filename'].'.json';
  }
  try {
    $json = file_get_contents($filename);
    return (json_decode(htmlspecialchars_decode($json),true));
  }
  catch (Exception $e) {
      return array("error" => $e->getMessage());
  }
  return array("error" => "Something went wrong when loading the database file.");
}

function getConfigById($id, $returnIndex = false){
  $configs = load()['configs'];
  foreach($configs as $index => $config){
    if($config['id'] == $id){
      if($returnIndex === true){
        return $index;
      }
      return $config;
    }
  }
  return false;
}

function getTemplateById($id, $returnIndex = false){
  $templates = load()['templates'];
  foreach($templates as $index => $template){
    if($template['id'] == $id){
      if($returnIndex === true){
        return $index;
      }
      return $template;
    }
  }
  return false;
}

function findConfigIndexById($id){
  return getConfigById($id, true);
}

function getPresetByIndex($index){
  return load()['presets'][$index];
}

function getTemplateByIndex($index){
  return load()['templates'][$index];
}

function getConfigs(){
  $summary = array();
  $configs = load()['configs'];
  foreach($configs as $config){
    array_push($summary, array(
      "id"=>$config['id'],
      "name"=>$config['name']
    ));
  }
  return $summary;
}

function getTemplates(){
  // $summary = array();
  $templates = load()['templates'];
  return $templates;
}

function getNextConfigId(){
  $max_val = 1;
  $configs = getConfigs();
  foreach($configs as $config){
    if($config['id']>=$max_val){
      $max_val = $config['id'] +1;
    }
  }
  $templates = getTemplates();
  foreach($templates as $template){
    if($template['id']>=$max_val){
      $max_val = $template['id'] +1;
    }
  }
  return $max_val;
}

function getPresets(){
  // $summary = array();
  $presets = load()['presets'];
  return $presets;
  //
  // foreach($presets as $index => $preset){
  //   array_push($summary, array(
  //     "index"=>$index,
  //     "rule-name"=>$preset['rule-name']
  //   ));
  // }
  // return $summary;
}


if(isset($_REQUEST['function'])){

  switch(strtolower ($_REQUEST['function'])){
    // Save the config
    case "saveconfig":
      $db = load();
      $config = json_decode($_REQUEST['config'], true);
      $id = $config['id'];
      if($_REQUEST['id'] == 'new'){
        $id = getNextConfigId();
         $config['id'] = $id;
        array_push($db["configs"], $config);
      }else{
        $db["configs"][findConfigIndexById($_REQUEST['id'])] = $config;
      }
      save($db);
      if($config === getConfigById($id)){
        echo json_encode(array("status"=>true,"id"=>$id,"savedConfig"=>$config));
      }else{
        echo json_encode(array("status"=>false));
      }
    break;

    // Save the config as a template
    case "savetemplate":
      $db = load();
      $template = json_decode($_REQUEST['template'], true);
      $id = $template['id'];
      if($_REQUEST['id'] == 'new'){
        $id = getNextConfigId();
         $template['id'] = $id;
        array_push($db["templates"], $template);
      }else{
        $temp_index = getTemplateById($_REQUEST['id'], true);
        if($temp_index >= 0){
          $db["templates"][$temp_index] = $template;
        }
      }
      save($db);
      if($template === getTemplateById($id)){
        echo json_encode(array("status"=>true,"id"=>$id,"savedTemplate"=>$template));
      }else{
        echo json_encode(array("status"=>false));
      }
    break;

    // Delete the config
    case "deleteconfig":
      $db = load();
      $id = $_REQUEST['id'];
      $index = findConfigIndexById($id);
      unset($db['configs'][$index]);
      save($db);
      if(findConfigIndexById($id) === false){
        echo json_encode(array("status"=>true));
      }else{
        echo json_encode(array("status"=>false));
      }
    break;

    // Delete the config
    case "deletetemplate":
      $db = load();
      $id = $_REQUEST['id'];
      $index = getTemplateById($id, true);
      unset($db['templates'][$index]);
      save($db);
      if(getTemplateById($id, true) === false){
        echo json_encode(array("status"=>true));
      }else{
        echo json_encode(array("status"=>false));
      }
    break;

    // Return the config
    case "getconfig":
      // echo json_encode(getConfigById($id));
      echo json_encode(getConfigById($_REQUEST['id']));
    break;

    // Save the preset
    case "savepreset":
      $db = load();
      $preset = json_decode($_REQUEST['preset']);
      if($_REQUEST['index'] == 'new'){
        array_push($db["presets"], $preset);
      }else{
        $db["presets"][$_REQUEST['index']] = $preset;
      }
      save($db);
      echo json_encode(null);
    break;

    // Return the preset
    case "getpreset":
    echo json_encode(getPresetByIndex($_REQUEST['index']));
    break;

    // Return the template
    case "gettemplate":
    echo json_encode(getTemplateByIndex($_REQUEST['index']));
    break;

    // Return a list of presets
    case "getpresetlist":
      echo json_encode(getPresets());
    break;

    // Return a list of configs
    case "getconfiglist":
    echo json_encode(getConfigs());
    break;

    // Return a list of templates
    case "gettemplatelist":
    echo json_encode(getTemplates());
    break;
  }
}
?>
