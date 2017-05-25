<?php

if($_SERVER['REQUEST_METHOD']=="POST") {
  $function = $_POST['call'];
  if(function_exists($function)) {
      call_user_func($function);
  }
  else {
      echo 'Function Not Exists!!';
  }
}

function SaveFiles(){
    if (!file_exists('numeExercitiu')) {
      mkdir('numeExercitiu', 0777, true);
    }
    $myfile = fopen("numeExercitiu/index.html", "w") or die("Unable to open file!");
    $txt = $_POST['html'];
    $html=$txt;

    fwrite($myfile, $txt);
    fclose($myfile);

    $myfile = fopen("numeExercitiu/index.css", "w") or die("Unable to open file!");
    $txt = $_POST['css'];
    fwrite($myfile, $txt);
    fclose($myfile);


    $myfile = fopen("numeExercitiu/index.js", "w") or die("Unable to open file!");
    $txt = $_POST['js'];
    fwrite($myfile, $txt);
    fclose($myfile);
}


 ?>
