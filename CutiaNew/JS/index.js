var htmlEditor;
var cssEditor;
var jsEditor;


$( document ).ready(function() {
  //dau un refresh periodic iframe-ului, just in case
  setInterval(function(){RefreshIframe()}, 500);

  //ace stuff
  htmlEditor = ace.edit("user-input-text-html")
  htmlEditor.setTheme("ace/theme/twilight")
  htmlEditor.session.setMode("ace/mode/html")
  htmlEditor.getSession().setUseWorker(false);
  htmlEditor.getSession().setUseWrapMode(true);
  htmlEditor.$blockScrolling = Infinity;

  cssEditor = ace.edit("user-input-text-css")
  cssEditor.setTheme("ace/theme/twilight")
  cssEditor.session.setMode("ace/mode/css")
  cssEditor.getSession().setUseWorker(false);
  cssEditor.getSession().setUseWrapMode(true);
  cssEditor.$blockScrolling = Infinity;

  jsEditor = ace.edit("user-input-text-js")
  jsEditor.setTheme("ace/theme/twilight")
  jsEditor.session.setMode("ace/mode/javascript")
  jsEditor.getSession().setUseWorker(false);
  jsEditor.getSession().setUseWrapMode(true);
  jsEditor.$blockScrolling = Infinity;

  //$('#user-input-text-html').colorfy("HTMLText");
  //$('#user-input-text-css').colorfy("CSSText");
  //$('#user-input-text-js').colorfy("JSText");
    ChangeBox("HTML");
});


function RefreshIframe(){

//  document.getElementById('output').src =   document.getElementById('output').src;
}


function SetAllBoxes(state){
    var boxes = document.getElementsByClassName("user-input-box");
    for (var i=0; i<boxes.length; i++) {
      var box=boxes[i];
      box.style.display=state;
    }

}


function ChangeBox(activeBox) {
  SetAllBoxes("none");
  var HTML_Box=document.getElementById("user-input-box-html");
  var CSS_Box=document.getElementById("user-input-box-css");
  var JS_Box=document.getElementById("user-input-box-js");

  switch (activeBox) {
    case "HTML":
      HTML_Box.style.display="inline-block";
    break;
    case "CSS":
      CSS_Box.style.display="inline-block";
    break;
    case "JS":
      JS_Box.style.display="inline-block";
    break;
    default:
  }
}

//Functia asta se executa cand verifici codul. Parametrul va fi 'valid' daca e ok codul, altfel va fi un mesaj de eroare
function DisplayHTMLCheckResult(result){
    if(result==validationWord){
      $('#nextButton').css("display", "inline-block")
    }
    else{
      swal("Oops",result, "error");
    }
  }
  //
  function formatCode(editor, mode) {
    var val = editor.session.getValue()
    var o = JSON.parse(val) // may throw if json is malformed
    val = JSON.stringify(o, null, 4) // 4 is the indent size
    editor.session.setValue(val)
}


/*Colorfy -defineste in regex ce caractere vrei sa colrezi
$.fn.colorfy.HTMLText = {
  "tag": /<(.*?)>/,
  "comment": //,
  "string": /"(.*?)"|'(.*?)'/,
};

$.fn.colorfy.CSSText = {
  "string": /"(.*?)"|'(.*?)'/,
  "tag": /.+?(?={)/,
  "class": /\.(.*)|[\.]/,
  "id": /\#(.*)|[\#]/,
  "property": /(.*)\:/,
  "number": /[0-9]/,
  "unit": /px|em|vh|vw/,
  "specialWords":/none|bold|italic|normal|block|inline|inline\-block|hidden|red|blue|green|white|purple|underline|overline/,
  "normalChars": /[\{,\}, \[,\],\(,\),\,,\;,\,\:]/
};

$.fn.colorfy.JSText = {
  "string": /"(.*?)"|'(.*?)'/,
  "keyword": /var|const|for|while|try|this|if|else|yield|return|switch|break/,
  "function": /function/,
  "functionName": /(.*)\(/,
  "normalChars": /[\{,\}, \[,\],\(,\),\,,\;,\,\:]/
};*/
