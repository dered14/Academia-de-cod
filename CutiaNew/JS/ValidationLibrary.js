var validationWord='valid';
var errorMessage="ceva nu pare in regula";
var CssOutputWindow;

$( document ).ready(function() {

  CssOutputWindow=document.getElementById("fakeOutput").contentWindow;
});



function hasParseErrorsXML(xmlDoc){
  //var xmlText = new XMLSerializer().serializeToString(xmlDoc);
  //alert(xmlText)
  var tags = xmlDoc.getElementsByTagName('*');
  for (var i = 0; i < tags.length; i++) {
    if(tags[i].nodeName=="parsererror"){

      return true;
    }
  }
  return false;
}

function GetHTML(htmlDocData){
  parser=new DOMParser();
  var htmlDoc=parser.parseFromString(htmlDocData, "text/html");
  return htmlDoc
}

function GetXML(htmlDocData){
  //elimina spatii albe ca sa pot sa scap de doctype html
  str=htmlDocData.replace(/<!--(.*?)-->/g, "")
  str=str.replace(/(\r\n|\n|\r)/gm,"");
  str=str.replace(/<!doctype(.*?)>/,"")
  //scap de CSS
  str=str.replace(/<style>(.*?)<\/style>/, "");
  //ca sa nu dea erori in caz de string gol
  if(!str){
    str="<html></html>"
  }
  //alert(str);
  parser=new DOMParser();
  var xmlDoc=parser.parseFromString(str, "text/xml");
  return xmlDoc;
}

function CheckForDoctype(htmlDocData){
  htmlDoc=GetHTML(htmlDocData);
  if(htmlDoc.doctype===null){
    return 'sigur ai scris corect?'
  }
  else if( htmlDoc.doctype.name==='html'){
    return validationWord
  }
  else{
    return 'sigur ai scris corect?'
  }
}

function CheckForRootHtmlTag(htmlDocData){
    htmlDoc=GetHTML(htmlDocData);
    xmlDoc=GetXML(htmlDocData)
    var hasDoctype=false;
    if(CheckForDoctype(htmlDocData)==validationWord){
      hasDoctype=true;
    }
    hasHtmlRoot=false;
    if(xmlDoc.documentElement.nodeName.toLowerCase()=="html"){
      hasHtmlRoot=true;
    }


    if(hasHtmlRoot && hasDoctype){
      return validationWord
    }
    if(!hasDoctype){
      return "Sigur ai scris doctype correct?"
    }
    if(!hasHtmlRoot){
      return "Sigur ai scris tag-ul html correct?"
    }
    else {
      return  errorMessage
    }

}

function CheckForHeadAndBody(htmlDocData){
  htmlDoc=GetHTML(htmlDocData);
  xmlDoc=GetXML(htmlDocData);
  var hasDoctypeAndRoot=false;
  if(CheckForRootHtmlTag(htmlDocData)==validationWord){
    hasDoctypeAndRoot=true;
  }
  var hasHead=false;
  var hasBody=false;
  if(xmlDoc.documentElement.childNodes.length<2){
    return "Ai pus tag-urile head si body in html?"
  }

  for (i = 0; i <xmlDoc.documentElement.childNodes.length; i++) {
      if(xmlDoc.documentElement.childNodes[i].nodeName=="head"){
        hasHead=true;
      }
      else if(xmlDoc.documentElement.childNodes[i].nodeName=="body"){
        hasBody=true;
      }
  }
  if(hasHead && hasBody){
    return validationWord;
  }
  else{
    return errorMessage;
  }


}
/*  for (var i = 0; i < xmlDoc.getElementsByTagName("head")[0].length; i++) {
    alert(xmlDoc.getElementsByTagName("head")[0].childNodes[i].nodeName);
  }*/
function CheckTitle(htmlDocData){
  htmlDocData=htmlDocData.replace(/<!--(.*?)-->/, "");
  htmlDoc=GetHTML(htmlDocData);
  xmlDoc=GetXML(htmlDocData);
  var hasTitle=false
  for (var i = 0; i < xmlDoc.getElementsByTagName("head")[0].childNodes.length; i++) {
      if(xmlDoc.getElementsByTagName("head")[0].childNodes[i].nodeName=="title"){
        var title=xmlDoc.getElementsByTagName("head")[0].childNodes[i];
        if(title.childNodes[0].nodeValue){
          hasTitle=true;
        }
      }
  }
  if(hasTitle){
    return validationWord
  }
  else{
    return errorMessage
  }
}

//nu am scris inca functia asta
function CheckIndentation(htmlDocData){
  return validationWord
}

function TestForComments(htmlDocData){

  var xmlDoc=GetXML(htmlDocData);
  if(TestIfCommentExists(htmlDocData, "primul meu comentariu")){
    return validationWord;
  }
  else{
    return errorMessage;
  }

}

function TestIfCommentExists(htmlDocData, wantedComment){
  var comments=htmlDocData.match(/<!--(.*?)-->/g);
  for (var i=0; i<comments.length; i++) {
    var commentText=comments[i].replace("<!--","").replace("-->","").trim();
    //alert(commentText)
    //daca nu exista comentariu dorit atunci orice comentariu e valid
    if(!wantedComment){
      if(commentText){
        return true;
      }
    }
    else if(commentText==wantedComment){
      return true;
    }
  }
  return false;
}

function TestForParagrafsInBody(htmlDocData){
  var htmlDoc=GetHTML(htmlDocData);
  var xmlDoc=GetXML(htmlDocData);
  var counter=0;
  for (var i=0; i<htmlDoc.body.children.length; i++){
    var tag=htmlDoc.body.children[i];
    if(tag.innerHTML && tag.tagName=="P"){
      counter++;
    }
  }
  if(counter>=2 && htmlDoc.title){
    return validationWord
  }
  else {
    {
      return errorMessage
    }
  }
}

function TestLessonSubtitluri(htmlDocData){
 if(TestHeaderParagraphCombinations(htmlDocData, 2,2, "h1")){
   return validationWord
 }
 else{
   return errorMessage
 }
}

function TestLessonRecapitulare(htmlDocData){
  var htmlDoc=GetHTML(htmlDocData);
  if(TestIfCommentExists(htmlDocData) && TestHeaderParagraphCombinations(htmlDocData, 3,1,"h1") && htmlDoc.title=="lista mea de citit"){
    return validationWord
  }
  else {
    return errorMessage;
  }
}

function TestLessonLinkuri(htmlDocData){
  var htmlDoc=GetHTML(htmlDocData);
  var tags=htmlDoc.getElementsByTagName('A')
  var tagExists=false;
  if(htmlDoc.title && tags[0].innerHTML && $(tags[0]).attr('href')){
    return validationWord
  }
  else{
    return errorMessage;
  }
}

function TestLessonListe(htmlDocData){
  var htmlDoc=GetHTML(htmlDocData);
  if(  CheckListTag(htmlDoc,"ol", 3)){
    return validationWord
  }
  else{
    return errorMessage
  }

}

function TestLessonListeSiLinkuri(htmlDocData){
  var htmlDoc=GetHTML(htmlDocData);
  var tags=htmlDoc.getElementsByTagName("UL")
  var ULContainsOnlyLI=true;
  var listHasMinThreeElements=false;
  var hasAnchorsOnly=true;
  for(var i=0; i<tags.length; i++){
    var list=tags[i];
    if($(list).children().length>=3){
      listHasMinThreeElements=true;
    }
    for (var j = 0; j < $(list).children().length; j++) {
      var el=$(list).children()[j];
      if($(el).prop("tagName")!=="LI"){
        ULContainsOnlyLI=false;
      }
      if($($(el).children()[0]).prop("tagName")!=="A" || !$($(el).children()[0]).prop("href")){
        hasAnchorsOnly=false;
      }
    }
  }
  if(listHasMinThreeElements && ULContainsOnlyLI && hasAnchorsOnly){
    return validationWord
  }
  else{
    return errorMessage
  }
}

function TestLessonListeDoi(htmlDocData){
  var htmlDoc=GetHTML(htmlDocData);
  if(  CheckListTag(htmlDoc,"ul", 3)){
    return validationWord
  }
  else{
    return errorMessage
  }

}

function CheckListTag(htmlDoc, listType, numberOfElements){
  var tags=htmlDoc.getElementsByTagName(listType)
  var OLContainsOnlyLI=true;
  var listHasMinThreeElements=false;
  for(var i=0; i<tags.length; i++){
    var list=tags[i];
    if($(list).children().length>=numberOfElements){
      listHasMinThreeElements=true;
    }
    for (var j = 0; j < $(list).children().length; j++) {
      var el=$(list).children()[j];
      if($(el).prop("tagName")!=="LI"){
        OLContainsOnlyLI=false;
      }
    }
  }
  if(listHasMinThreeElements && OLContainsOnlyLI){
    return true
  }
  else{
    return false
  }
}

function TestLessonImagini(htmlDocData){
  var htmlDoc=GetHTML(htmlDocData);
  if(SearchForImageInTag(htmlDoc,"BODY")){
    return validationWord;
  }
  else{
    return errorMessage;
  }
}

function TestLessonImaginiSiLinkuri(htmlDocData){
    var htmlDoc=GetHTML(htmlDocData);
  if(SearchForImageInTag(htmlDoc,"A")){
    return validationWord;
  }
  else{
    return errorMessage;
  }
}

function CheckLessonRecapTitulPaginii(htmlDocData){
  var htmlDoc=GetHTML(htmlDocData);
  var bodyContainsH1=false;
  for (var i = 0; i < $(htmlDoc.body).children().length; i++) {
    if($($(htmlDoc.body).children()[i]).prop("tagName")=="H1"){
      bodyContainsH1=true;
    }
  }
  if(htmlDoc.title && bodyContainsH1){
    return validationWord
  }
  else {
    return errorMessage
  }
}

function CheckLessonRecapSubtitluri(htmlDocData){
  var htmlDoc=GetHTML(htmlDocData);
  var hasH3WithP=TestHeaderParagraphCombinations(htmlDocData,1,1,"h3");
  var hasH5WithP=TestHeaderParagraphCombinations(htmlDocData,1,1,"h5");
  if(hasH3WithP && hasH5WithP){
    return validationWord
  }
  else{
    return errorMessage
  }
}

function CheckLessonRecapLinkuriSiImagini(htmlDocData){
  var htmlDoc=GetHTML(htmlDocData);
  var imgs=htmlDoc.getElementsByTagName('img');
  var links= htmlDoc.getElementsByTagName('a');
  if($(imgs[0]).attr("alt") && $(links[0]).attr("target").toLowerCase()=="_blank"){
    return validationWord
  }
  else {
    return errorMessage
  }

}

function CheckLessonRecapCharSet(htmlDocData){
  var htmlDoc=GetHTML(htmlDocData);

  if($(htmlDoc.getElementsByTagName('meta')[0]).attr("charset").toLowerCase()=="utf-8"){
    return validationWord
  }
  else{
    return errorMessage
  }
}

function CheckLessonPrimulStil(htmlDocData){
  var htmlDoc=GetHTML(htmlDocData);
  var h3s=CssOutputWindow.document.getElementsByTagName('h3');
  var cssObj = CssOutputWindow.getComputedStyle(h3s[0], null)
  if(cssObj.getPropertyValue("color")!="rgb(0, 0, 0)" && cssObj.getPropertyValue("color")!="rgb(255, 165, 0)" &&  CheckForCssLink(htmlDocData)){
    return validationWord
  }
  else{
    return errorMessage
  }

}

function CheckLessonTipuriDeCulori(htmlDocData){
  var h3s=CssOutputWindow.document.getElementsByTagName('h3');
  var h3scssObj = CssOutputWindow.getComputedStyle(h3s[0], null);
  var h4s=CssOutputWindow.document.getElementsByTagName('h4');
  var h4scssObj = CssOutputWindow.getComputedStyle(h4s[0], null);

  if(h3scssObj.getPropertyValue("color")!="rgb(0, 0, 0)" && h4scssObj.getPropertyValue("color")!="rgb(0, 0, 0)" && CheckForCssLink(htmlDocData)){
    return validationWord
  }
  else{
    return errorMessage
  }
}

function CheckLessonComentariiCss(htmlDocData){
  var htmlDocDataEdited=htmlDocData.replace(/(\r\n|\n|\r)/gm,"");
  var css =htmlDocDataEdited.match(/<style>(.*?)<\/style>/)
  var comments=css[1].match(/\/\*(.*?)\*\//g);
  if(comments.length>=3){
    return validationWord
  }
  else{
    return errorMessage
  }
}

function CheckLessonPropText(htmlDocData){
  var h1s=CssOutputWindow.document.getElementsByTagName('h1');
  var h1scssObj = CssOutputWindow.getComputedStyle(h1s[0], null);
  var h2s=CssOutputWindow.document.getElementsByTagName('h2');
  var h2scssObj = CssOutputWindow.getComputedStyle(h2s[0], null);  var h3s=CssOutputWindow.document.getElementsByTagName('h3');
  var h3scssObj = CssOutputWindow.getComputedStyle(h3s[0], null);
  var h4s=CssOutputWindow.document.getElementsByTagName('h4');
  var h4scssObj = CssOutputWindow.getComputedStyle(h4s[0], null);
  var ps=CssOutputWindow.document.getElementsByTagName('p');
  var pscssObj = CssOutputWindow.getComputedStyle(ps[0], null);

  var italics=0;
  if(h1scssObj.getPropertyValue("font-style")=="italic"){
    italics++;
  }
  if(h2scssObj.getPropertyValue("font-style")=="italic"){
    italics++;
  }
  if(h3scssObj.getPropertyValue("font-style")=="italic"){
    italics++;
  }
  if(h4scssObj.getPropertyValue("font-style")=="italic"){
    italics++;
  }
  if(italics>=2 && pscssObj.getPropertyValue("color").toString()!=="rgb(0, 0, 0)" && pscssObj.getPropertyValue("font-weight").toString()==="bold"){
      return validationWord
  }
  else{
    return errorMessage
  }
}

function CheckLessonFontSize(htmlDocData){
  var h1s=CssOutputWindow.document.getElementsByTagName('h1');
  var h1scssObj = CssOutputWindow.getComputedStyle(h1s[0], null);
  if(h1scssObj.getPropertyValue("font-size").toString()=="60px"){
    return validationWord;
  }
  else{
    return errorMessage
  }
}

function CheckLessonTextAlign(htmlDocData){
  var alignLeft=false;
  var alignRight=false;
  var alignCenter=false;
  var alignJustify=false;
  var h1s=CssOutputWindow.document.getElementsByTagName('h1');
  var h1scssObj = CssOutputWindow.getComputedStyle(h1s[0], null);
  var h2s=CssOutputWindow.document.getElementsByTagName('h2');
  var h2scssObj = CssOutputWindow.getComputedStyle(h2s[0], null);
  var h3s=CssOutputWindow.document.getElementsByTagName('h3');
  var h3scssObj = CssOutputWindow.getComputedStyle(h3s[0], null);
  var h4s=CssOutputWindow.document.getElementsByTagName('h4');
  var h4scssObj = CssOutputWindow.getComputedStyle(h4s[0], null);
  var titles=[h1scssObj, h2scssObj, h3scssObj, h4scssObj];
  for (var i = 0; i < titles.length; i++) {
    var alignment= titles[i].getPropertyValue("text-align");
    switch (alignment) {
      case "left":
        alignLeft=true;
        break;
        case "right":
          alignRight=true;
          break;
          case "center":
            alignCenter=true;
            break;
      default:

    }
  }
  var ps=CssOutputWindow.document.getElementsByTagName('p');
  var pscssObj = CssOutputWindow.getComputedStyle(ps[0], null);
  if(pscssObj.getPropertyValue("text-align")=="justify"){
    alignJustify=true;
  }
  if(alignJustify && alignCenter && alignRight && alignLeft){
    return validationWord;
  }
  else{
    return errorMessage;
  }
}

function CheckLessonSpanAndDiv(htmlDocData){
  var htmlDoc=GetHTML(htmlDocData);
  var paras=htmlDoc.getElementsByTagName("p");
  var paraHasSpans=false;
  for (var i = 0; i < paras.length; i++) {
    var paraChilds=paras[i].children;
    for (var j = 0; j < paraChilds.length; j++) {
      if($(paraChilds[i]).prop("tagName")=="SPAN"){
        paraHasSpans=true;
      }
    }
  }
  var spans=CssOutputWindow.document.getElementsByTagName('span');
  var spanscssObj = CssOutputWindow.getComputedStyle(spans[0], null);
  if(spanscssObj.getPropertyValue("font-style").toString()=="italic" && paraHasSpans){
    return validationWord
  }
  else{
    return errorMessage
  }
}

function CheckLessonSpanAndDivTwo(htmlDocData){
  var htmlDoc=GetHTML(htmlDocData);
  var sectionsCount=0;
  for (var i = 0; i < htmlDoc.body.children.length; i++) {
    if($(htmlDoc.body.children[i]).prop("tagName")=="DIV"){
      var div=htmlDoc.body.children[i];
      var hasH3=false;
      var paraCount=0;
      for (var j = 0; j < div.children.length; j++) {
        if($(div.children[j]).prop("tagName")=="H3"){
          hasH3=true;
        }
        if($(div.children[j]).prop("tagName")=="P"){
          paraCount++;
        }
      }
      if(hasH3 && paraCount>=2){
        sectionsCount++;
      }
    }
  }
  if(sectionsCount>=3){
    return validationWord;
  }
  else{
    return errorMessage;
  }
}

function CheckLessonCssClass(htmlDocData){
  var htmlDoc=GetHTML(htmlDocData);
  for (var i = 0; i < CssOutputWindow.document.getElementsByTagName("p").length; i++) {
    var p = CssOutputWindow.document.getElementsByTagName("p")[i];
    for (var j = 0; j < p.children.length; j++) {
      if($(p.children[j]).prop("tagName")=="SPAN"){
        var span=p.children[j];
        if($(span).html()=="italic"){
          spancssObj = CssOutputWindow.getComputedStyle(span, null);
          if(spancssObj.getPropertyValue("font-style") !== "italic" || $(span).attr("class")!=="italic"){
            return errorMessage
          }
        }
        if($(span).html()=="îngroșat"){
          spancssObj = CssOutputWindow.getComputedStyle(span, null);
          if(spancssObj.getPropertyValue("font-weight") !== "bold" || $(span).attr("class")!=="bold"){
            return errorMessage
          }
        }
      }
    }
  }
  return validationWord;
}

function CheckLessonCssID(htmlDocData){
  var paras= CssOutputWindow.document.getElementsByTagName("p");
  for (var i = 1; i < paras.length; i++) {
    if(paras[i].id==="primul_paragraf_al_paginii"){
      return errorMessage
    }
  }
  firstParaCss=CssOutputWindow.getComputedStyle(paras[0], null)
  if(paras[0].id!=="primul_paragraf_al_paginii" || firstParaCss.getPropertyValue("color")!=="rgb(255, 0, 0)" || firstParaCss.getPropertyValue("font-weight")!=="bold"){
    return errorMessage
  }
  else{
    return validationWord;
  }
}

function CheckLessonCssRecapOne(htmlDocData){
  var htmlDoc=GetHTML(htmlDocData);
  var divs=htmlDoc.getElementsByTagName("div");
  var sectionCount=0;
  var idExists=false;
  for (var i = 0; i < divs.length; i++) {

    //verifica daca exista si e unic id
    if(divs[i].id=="secțiunea_principală"){
      if(idExists){
        return errorMessage
      }
      if(!idExists){
        idExists=true;
      }
    }
    //verifica daca sectiuniile au structura corecta
    var hasH3=false;
    var hasP=false;
    for (var j = 0; j < divs[i].children.length; j++) {
      if($(divs[i].children[j]).prop("tagName")=="H3"){
        hasH3=true;
      }
      if($(divs[i].children[j]).prop("tagName")=="P"){
        hasP=true;
      }
    }
    if(hasH3 && hasP && $(divs[i]).prop("class")=="secțiune_de_pagină"){
      sectionCount++;
    }
  }
  var spans=htmlDoc.getElementsByTagName("span");
  if(idExists && sectionCount>=3 && spans.length>=3){
    return validationWord
  }
  else{
    return errorMessage
  }
}

function CheckLessonStilizareDivOne(htmlDocData){
  var divs=CssOutputWindow.document.getElementsByTagName("div");
  if(divs.length==0){
    return errorMessage;
  }
  for (var i = 0; i < divs.length; i++) {
    var cssObj=CssOutputWindow.getComputedStyle(divs[i], null)
    if(divs[i].id=="test"){
      if(cssObj.getPropertyValue("background-color").toString()=="rgba(0, 0, 0, 0)"){
        return errorMessage
      }
    }
    else{
      if(cssObj.getPropertyValue("background-color").toString()!=="rgba(0, 0, 0, 0)"){
        return errorMessage
      }
    }
  }
  return validationWord;
}

function CheckLessonStilizareDivTwo(htmlDocData){
  var divs=CssOutputWindow.document.getElementsByTagName("div");
  if(divs.length==0){
    return errorMessage;
  }
  $("#fakeOutput").css("display", "block");
  //for inutil, putem folosi getElementById()
  for (var i = 0; i < divs.length; i++) {
    var cssObj=CssOutputWindow.getComputedStyle(divs[i], null)
    if(divs[i].id=="test"){
      if(cssObj.getPropertyValue("background-color").toString()=="rgba(0, 0, 0, 0)" || parseInt(cssObj.getPropertyValue("height"))<=100 || parseInt(cssObj.getPropertyValue("width"))>=200){
        return errorMessage
      }
    }
  }
  $("#fakeOutput").css("display", "none");
  return validationWord;
}

function CheckLessonUnitatiDeMasura(htmlDocData){
  var htmlDocDataEdited=htmlDocData.replace(/(\r\n|\n|\r)/gm,"");
  var style=htmlDocDataEdited.match(/<style>(.*?)<\/style/)
  var div=style[1].match(/#test{(.*?)}/);
  var properties=div[1].split(";")
  var hasPercent=false;
  var hasVh=false;
  for (var i = 0; i < properties.length; i++) {
    var pair=properties[i].split(":");
    if(pair[0].toLowerCase().trim()=="height"){
      var value=pair[1];
      if(value[value.length-2].toLowerCase()=="v" && value[value.length-1].toLowerCase()=="h"){
        hasVh=true;
      }
    }
    if(pair[0].toLowerCase().trim()=="width"){
      var value=pair[1];
      if(value[value.length-1]=="%"){
        hasPercent=true;
      }
    }
  }
  if(hasVh && hasPercent){
    return validationWord
  }
  else{
    return errorMessage;
  }
}

function CheckLessonBorder(htmlDocData){
  var divs=CssOutputWindow.document.getElementsByTagName("div");
  if(divs.length==0){
    return errorMessage;
  }
  for (var i = 0; i < divs.length; i++) {
    var cssObj=CssOutputWindow.getComputedStyle(divs[i], null)
    if(divs[i].id=="test"){
      if(cssObj.getPropertyValue("border-style").toString()=="none" || cssObj.getPropertyValue("border-width").toString()=="0px"  || cssObj.getPropertyValue("border-color").toString()==="rgb(0, 0, 0)"){
        return errorMessage
      }
    }
    else{
      if(cssObj.getPropertyValue("border-style").toString()!=="none" || cssObj.getPropertyValue("border-width").toString()!=="0px"  || cssObj.getPropertyValue("border-color").toString()!=="rgb(0, 0, 0)"){
        return errorMessage
      }
    }
  }
  return validationWord;
}

function CheckLessonMarginsAndPadding(htmlDocData){
  var divs=CssOutputWindow.document.getElementsByTagName("div");
  if(divs.length==0){
    return errorMessage;
  }
  for (var i = 0; i < divs.length; i++) {
    var divCssObj=CssOutputWindow.getComputedStyle(divs[i], null)
    if($(divs[i]).attr("id")=="padding-test"){
      if(divCssObj.getPropertyValue("padding").toString()!=="50px"){
        return errorMessage;
      }
    }
    else if($(divs[i]).attr("id")=="margin-test"){
      if(divCssObj.getPropertyValue("margin").toString()!=="50px"){
        return errorMessage;
      }
    }
    else{
      if(divCssObj.getPropertyValue("margin").toString()==="50px" || divCssObj.getPropertyValue("padding").toString()==="50px"){
        return errorMessage;
      }
    }
  }
  return validationWord;
}

function CheckLessonMarginsAndPaddingTwo(htmlDocData){
  var divs = CssOutputWindow.document.getElementsByTagName("div");
  if(divs.length<3){
    return errorMessage;
  }
  for (var i = 0; i < divs.length; i++) {
    var divCssObj=CssOutputWindow.getComputedStyle(divs[i], null);
    $("#fakeOutput").css("display", "inline-block");

    var width=parseInt(($(divs[i]).width()));

    var paddingLeft=parseInt(($(divs[i]).css("padding-left")));
    var paddingLeftPercent=paddingLeft*100/width;

    var marginBottom=parseInt($(divs[i]).css("margin-bottom"));
    if(Math.abs(paddingLeftPercent-2.5)>0.2 || marginBottom!==60 || $(divs[i]).css("background-color").toString()!=="rgb(255, 165, 0)"){
      return errorMessage
    }
    var hasPChild=false;
    $("#fakeOutput").css("display", "none");
    for (var j = 0; j < divs[i].children.length; j++) {
      if($(divs[i].children[j]).prop("tagName")=="P"){
        hasPChild=true;
      }
    }
    if(!hasPChild && i<=3){
      return errorMessage;
    }
  }
  return validationWord;
}

function CheckLessonDisplayTypes(htmlDocData){
    var divs = CssOutputWindow.document.getElementsByTagName("div");
    var blockDisplay=false;
    var hiddenVisibility=false;
    var inlineBlockDisplay=false;
    var inlineDisplay=false;
    var noneDisplay=false;
    for (var i = 0; i < divs.length; i++) {
      var divClass=$(divs[i]).attr("class");
      var elCssObj=CssOutputWindow.getComputedStyle(divs[i], null);
      //alert($(divs[i]).attr("class")+"\n"+elCssObj.getPropertyValue("display")+"\n"+elCssObj.getPropertyValue("visibility"))
      switch (divClass) {
        case "block":
            if(elCssObj.getPropertyValue("display")==="block"){
              blockDisplay=true;
            }
          break;
          case "hidden":
              if(elCssObj.getPropertyValue("visibility")==="hidden"){
                hiddenVisibility=true;
              }
            break;
            case "inline-block":
                if(elCssObj.getPropertyValue("display")==="inline-block"){
                  inlineBlockDisplay=true;
                }
              break;
              case "inline":
                  if(elCssObj.getPropertyValue("display")==="inline"){
                    inlineDisplay=true;
                  }
                break;
                case "none":
                    if(elCssObj.getPropertyValue("display")==="none"){
                      noneDisplay=true;
                    }
                  break;
        default:

      }
    }
    if(blockDisplay && hiddenVisibility && noneDisplay && inlineDisplay && inlineBlockDisplay ){
      return validationWord
    }
    else{
      return errorMessage;
    }
}


function CheckLessonCssSelectorsOne(htmlDocData){
  var divs = CssOutputWindow.document.getElementsByTagName("div");
  for (var i = 0; i < divs.length; i++) {
    var divCssObj=CssOutputWindow.getComputedStyle(divs[i], null)
    if($(divs[i]).attr("class")=="rosu"){
      if(divCssObj.getPropertyValue("background-color")!=="rgb(255, 0, 0)"){
        return errorMessage;
      }
    }
    else{
      if(divCssObj.getPropertyValue("background-color")==="rgb(255, 0, 0)"){
        return errorMessage;
      }
    }
  }
  var spans = CssOutputWindow.document.getElementsByTagName("span");
  for (var i = 0; i < spans.length; i++) {
    var spanCssObj=CssOutputWindow.getComputedStyle(spans[i], null)
    if($(spans[i]).attr("class")=="rosu"){
      if(spanCssObj.getPropertyValue("color")!=="rgb(255, 0, 0)"){
        return errorMessage;
      }
    }
    else{
      if(spanCssObj.getPropertyValue("color")==="rgb(255, 0, 0)"){
        return errorMessage;
      }
    }
  }

  return validationWord;

}

function CheckLessonCssSelectorsTwo(htmlDocData){

  var divs = CssOutputWindow.document.getElementsByTagName("div");
  for (var i = 0; i < divs.length; i++) {
    if($(divs[i]).attr("class")=="elemente_importante"){
      for (var j = 0; j < divs[i].children.length; j++) {
        var elCssObj=CssOutputWindow.getComputedStyle(divs[i].children[j], null);
        if($(divs[i].children[j]).prop("tagName")=="P"){
          if(elCssObj.getPropertyValue("color").toString()==="rgb(0, 0, 0)"){
            return errorMessage
          }
          if(elCssObj.getPropertyValue("font-style").toString()!=="normal"){
            return errorMessage
          }
        }
        if($(divs[i].children[j]).prop("tagName")=="H3"){
          if(elCssObj.getPropertyValue("font-style").toString()!=="italic"){
            return errorMessage
          }
          if(elCssObj.getPropertyValue("color").toString()!=="rgb(0, 0, 0)"){
            return errorMessage
          }
        }
      }
    }
    else{
      for (var j = 0; j < divs[i].children.length; j++) {
        var elCssObj=CssOutputWindow.getComputedStyle(divs[i].children[j], null);
        if($(divs[i].children[j]).prop("tagName")=="P"){
          if(elCssObj.getPropertyValue("color").toString()!=="rgb(0, 0, 0)"){
            return errorMessage
          }
        }
        if($(divs[i].children[j]).prop("tagName")=="H3"){
          if(elCssObj.getPropertyValue("font-style").toString()!=="normal"){
            return errorMessage
          }
        }
      }
    }
  }
  return validationWord;
}

function CheckLessonCssSelectorsThree(htmlDocData){
  var links=CssOutputWindow.document.getElementsByTagName("a");
  var ytLinkCorrect=false;
  var atLinkCorrect=false;
  var meLinkCorrect=false;
  for (var i = 0; i < links.length; i++) {
    var elCssObj=CssOutputWindow.getComputedStyle(links[i], null);
    var linkColor=elCssObj.getPropertyValue("color");
    var linkAdress=($(links[i]).attr("href"));
    if(linkAdress.includes("youtube")){
      if(linkColor.toString()==="rgb(255, 0, 0)"){
        ytLinkCorrect=true;
      }
    }
    else if(linkAdress.includes("arstechnica")){
      if(linkColor.toString()==="rgb(0, 128, 0)"){
        atLinkCorrect=true;
      }
    }
    else{
      if(linkColor.toString()==="rgb(0, 0, 238)"){
        meLinkCorrect=true;
      }
    }
  }
  if(meLinkCorrect && ytLinkCorrect && atLinkCorrect){
    return validationWord;
  }
  else{
    return errorMessage;
  }
}

function CheckLessonDivExercisesOne(htmlDocData){
  var cssLinkExists=false;
  var hasTitle=false;
  var hasHeader=false;
  if(CheckForCssLink(htmlDocData)===validationWord){
    cssLinkExists=true;
  }
  if(CheckTitle(htmlDocData)===validationWord){
    hasTitle=true;
  }
  var h1s=CssOutputWindow.document.getElementsByTagName("h1");
  var h1CssObj=CssOutputWindow.getComputedStyle(h1s[0], null);
  if(h1CssObj.getPropertyValue("text-align")==="center"){
    hasHeader=true;
  }
  if(hasHeader && hasTitle && cssLinkExists){
    return validationWord;
  }
  else{
    return errorMessage;
  }
}

function CheckLessonDivExercisesTwo(htmlDocData){
  var hasLeftCol=false;
  var hasCenterCol=false;
  var hasRightCol=false;
  var body=CssOutputWindow.document.getElementsByTagName("body")[0];
  var divs=[];
  var divIndex=-1;//un index separat deoarece e posibil ca in body sa nu fie doar div-uri.el imi da ordinea div-urilor. Incepe la -1 deoarece il incrementez la inceput nu la sfarsit
  for (var i = 0; i < body.children.length; i++) {
    if($(body.children[i]).prop("tagName")=="DIV"){
      divIndex++;
      var className=$(body.children[i]).attr("class");
      var divCssObj=CssOutputWindow.getComputedStyle(body.children[i], null);
      var display=divCssObj.getPropertyValue("display");
      if(display!="inline-block"){
        return errorMessage
      }
      switch (className) {
        case "coloana-stanga":
        if(divIndex==0){
          hasLeftCol=true;
        }
        break;
        case "coloana-centru":
          if(divIndex==1){
          hasCenterCol=true;
        }
        break;
        case "coloana-dreapta":
          if(divIndex==2){
          hasRightCol=true;
        }
        break;

        default:

      }
    }
  }

  if(hasLeftCol && hasRightCol && hasCenterCol){
    return validationWord
  }
  else{
    return errorMessage
  }
}

//Fuck me amadeus functia asta e un monstru
function CheckLessonDivExercisesThree(htmlDocData){
  var sideColColor;
  var centerColColor;
  var body=CssOutputWindow.document.getElementsByTagName("body")[0];
  $("#fakeOutput").css("display", "block");
  var bodyWidth=parseInt($(body).width());
  $("#fakeOutput").css("display", "none");
  for (var i = 0; i < body.children.length; i++) {
    $("#fakeOutput").css("display", "block");
    var cssObj=CssOutputWindow.getComputedStyle(body.children[i], null)

    if($(body.children[i]).attr("class")=="coloana-dreapta" || $(body.children[i]).attr("class")=="coloana-stanga"){
      var backgroundColor=cssObj.getPropertyValue("background-color");
      var percentWidth=(parseInt($(body.children[i]).width())*100)/bodyWidth
      if(Math.abs(percentWidth-15)>0.5){
        $("#fakeOutput").css("display", "none");
        return errorMessage;
      }
      if (backgroundColor.toString()=="rgba(0, 0, 0, 0)" ){
        $("#fakeOutput").css("display", "none");
        return errorMessage;
      }
      else{
        sideColColor=backgroundColor.toString();
      }
    }

    if($(body.children[i]).attr("class")=="coloana-centru"){
      var percentWidth=(parseInt($(body.children[i]).width())*100)/bodyWidth
      if(Math.abs(percentWidth-68)>0.5){
        $("#fakeOutput").css("display", "none");
        return errorMessage;
      }

      var backgroundColor=cssObj.getPropertyValue("background-color");
      if (backgroundColor.toString()=="rgba(0, 0, 0, 0)" ){
        $("#fakeOutput").css("display", "none");
        return errorMessage;
      }
      else{
        centerColColor=backgroundColor.toString();
      }
    }
  $("#fakeOutput").css("display", "none");
  }
  if(centerColColor !== sideColColor){
    return validationWord
  }
  else{
    return errorMessage
  }
}

function CheckLessonDivExercisesFour(htmlDocData){
  var sections=GetSectionsDivExercises(htmlDocData);
  var sectionCount=0;
  for (var i = 0; i < sections.length; i++) {
    if($(sections[i]).attr("class")=="sectiune"){
      var section=sections[i];
      var hasH2=false;
      var hasP=false;
      for (var j = 0; j < section.children.length; j++) {
        if($(section.children[j]).prop("tagName")=="P"){
          hasP=true;
        }
        else if($(section.children[j]).prop("tagName")=="H2"){
          hasH2=true;
        }
      }
      if(hasH2 && hasP){
        sectionCount++;
      }
    }
  }
  if(sectionCount>=3){
    return validationWord;
  }
  else{
    return errorMessage;
  }
}

function CheckLessonDivExercisesFive(htmlDocData){
  var sections=GetSectionsDivExercises(htmlDocData);
  var columns=[];
  var body=CssOutputWindow.document.body;
  for (var i = 0; i < body.children.length; i++) {
    if($(body.children[i]).attr("class")){
      if($(body.children[i]).attr("class").includes("coloana")){
        columns.push(body.children[i])
      }
    }
  }
  for (var i = 0; i < sections.length; i++) {
    var sectionCssObj=CssOutputWindow.getComputedStyle(sections[i], null)
    if(sectionCssObj.getPropertyValue("padding-left")!=="20px"){
      return errorMessage
    }
  }
  for (var i = 0; i < columns.length; i++) {
    var cssObj=CssOutputWindow.getComputedStyle(columns[i], null);
    if(cssObj.getPropertyValue("vertical-align")!=="top"){
      return errorMessage;
    }
  }
  if(columns.length!=3 || sections.length<3){
    return errorMessage;
  }
  else{
    return validationWord;
  }
}

function CheckLessonDivExercisesSix(htmlDocData){
  var sections = GetSectionsDivExercises(htmlDocData);
  for (var i = 0; i < sections.length; i++) {
    var cssObj=CssOutputWindow.getComputedStyle(sections[i], null)
    if(cssObj.getPropertyValue("border-radius")!=="10px" || cssObj.getPropertyValue("margin")!=="10px"){
      return errorMessage;
    }
  }
  var cssObj=CssOutputWindow.getComputedStyle(sections[0], null);
  var sectionBackground=cssObj.getPropertyValue("background-color");
  var center=CssOutputWindow.document.getElementsByClassName("coloana-centru")[0];
  cssObj=CssOutputWindow.getComputedStyle(center, null);
  var centerBackground=cssObj.getPropertyValue("background-color");
  if(centerBackground!==sectionBackground && sectionBackground!=="rgba(0, 0, 0, 0)" && centerBackground!=="rgba(0, 0, 0, 0)"){
    return validationWord
  }
  else{
    return errorMessage;
  }

}

function CheckLessonDivExercisesSeven(htmlDocData){
  var sections = GetSectionsDivExercises(htmlDocData);
  var unHoverColor;
  var hoverColor;
  var cssObj=CssOutputWindow.getComputedStyle(sections[0], null);
  unHoverColor=cssObj.getPropertyValue("background-color");
  var htmlDocDataEdited=htmlDocData.replace(/(\r\n|\n|\r)/gm,"");
  htmlDocDataEdited=htmlDocDataEdited.replace(/ /g,'')
  var style=htmlDocDataEdited.match(/<style>(.*?)<\/style>/)[1];
  var hover=style.match(/sectiune:hover{(.*?)}/)[1];
  var propVals=hover.split(";");
  var propValPairs=[];
  for (var i = 0; i < propVals.length; i++) {
    propValPairs.push(propVals[i].split(":"));
  }
  for (var i = 0; i < propValPairs.length; i++) {
    if(propValPairs[i][0]=="background-color"){
      hoverColor=propValPairs[i][1]
    }
  }
  var hoverColorEdited=hoverColor.replace(/,/g, ", ");
  if(hoverColorEdited!=unHoverColor){
    return validationWord
  }
  else{
    return errorMessage
  }
}

function CheckLessonDivExercisesEight(htmlDocData){
    var leftCol=CssOutputWindow.document.getElementsByClassName("coloana-stanga")[0];
    var rightCol=CssOutputWindow.document.getElementsByClassName("coloana-dreapta")[0];
    var leftColOk=false;
    var rightColOk=false;
    if($(leftCol.children[0]).prop("tagName")=="H3" && $(leftCol.children[1]).prop("tagName")=="OL"){
      var oList=leftCol.children[1];
      for (var i = 0; i < oList.children.length; i++) {
        if($(oList.children[i]).prop("tagName")!=="LI"){
          return errorMessage;
        }
      }
      if(oList.children.length>=2){
        leftColOk=true;
      }
    }
    if($(rightCol.children[0]).prop("tagName")=="H3" && $(rightCol.children[1]).prop("tagName")=="UL"){
      var uList=rightCol.children[1];
      for (var i = 0; i < uList.children.length; i++) {
        if($(uList.children[i]).prop("tagName")!=="LI" || $(uList.children[i].children[0]).prop("tagName")!=="A"){
          return errorMessage;
        }
      }
      if(uList.children.length>=2){
        rightColOk=true;
      }
    }
    if(rightColOk && leftColOk){
      return validationWord
    }
    else{
      return errorMessage;
    }
}

function CheckLessonDivExercisesNine(htmlDocData){
  var rightCol=CssOutputWindow.document.getElementsByClassName("coloana-dreapta")[0];
  var rightColOk=false;
  if($(rightCol.children[0]).prop("tagName")=="H3" && $(rightCol.children[1]).prop("tagName")=="UL"){
    var uList=rightCol.children[1];
    for (var i = 0; i < uList.children.length; i++) {
      if($(uList.children[i]).prop("tagName")!=="LI" || $(uList.children[i].children[0]).prop("tagName")!=="A"){
        return errorMessage;
      }
      else{
        var link =  uList.children[i].children[0];
        var href=$(link).attr("href");
        if(href.split(":")[0]!=="mailto"){
          return errorMessage;
        }
      }
    }
    if(uList.children.length>=2){
      rightColOk=true;
    }
  }
  if(rightColOk){
    return validationWord
  }
  else{
    return errorMessage
  }
}

function CheckLessonDivExercisesTen(htmlDocData){
  var rightCol=CssOutputWindow.document.getElementsByClassName("coloana-dreapta")[0];
  var rightColOk=false;
  if($(rightCol.children[0]).prop("tagName")=="H3" && $(rightCol.children[1]).prop("tagName")=="UL"){
    var uList=rightCol.children[1];
    for (var i = 0; i < uList.children.length; i++) {
      if($(uList.children[i]).prop("tagName")!=="LI" || $(uList.children[i].children[0]).prop("tagName")!=="A"){
        return errorMessage;
      }
      else{
        var link =  uList.children[i].children[0];
        if(!$(link).attr("title")){
          return errorMessage;
        }
      }
    }
    if(uList.children.length>=2){
      rightColOk=true;
    }
  }
  if(rightColOk){
    return validationWord
  }
  else{
    return errorMessage
  }
}

//functia asta returneaza sectiunile pt primul proiect de css

function GetSectionsDivExercises(htmlDocData){
  var body=CssOutputWindow.document.body;
  var colCentral;
  var sections=[];
  for (var i = 0; i < body.children.length; i++) {
    if($(body.children[i]).attr("class")=="coloana-centru"){
      var colCentral=body.children[i];
    }
  }
  for (var i = 0; i < colCentral.children.length; i++) {
    if($(colCentral.children[i]).attr("class")=="sectiune"){
      sections.push(colCentral.children[i])
    }
  }
  return sections;
}

//Vede daca un anumit tag contine sau nu o imagine
function SearchForImageInTag(htmlDoc, tag){
  var tags=htmlDoc.getElementsByTagName(tag);
  for (var i = 0; i < tags.length; i++) {
    var el=tags[i];
    for (var j = 0; j < $(el).children().length; j++) {
      if($($(el).children()[j]).prop("tagName")=="IMG"){
        return true
      }
    }
  }
  return false;
}

//functia verifica daca exista headersNumber headere si sub fiecare ParagraphNumber paragrafe
 function TestHeaderParagraphCombinations(htmlDocData, headersNumber, ParagraphNumber, headingType){
  var htmlDoc=GetHTML(htmlDocData);
   var headings= htmlDoc.getElementsByTagName(headingType);
   if(headings.length<headersNumber){
     return false;
   }
    for (var i = 0; i < headings.length; i++) {
      for (var j = 0; j < ParagraphNumber; j++) {
        //chestia asta jquery e un monstru si va trebui schimbata
        if($($(headings[i]).nextAll()[j]).prop("tagName")!=="P"){
          return false;
        }
      }
    }
    return true;
  }

  function CheckForCssLink(htmlDocData){
    var hasHref=false;
    var hasRel=false;
    var hasType=false;
    htmlDocData = htmlDocData.replace(/(\r\n|\n|\r)/gm,"");
    var head = htmlDocData.match(/<head>(.*?)<\/head>/g);
    var link=head[0].match(/<link(.*?)\/>/g);
    var attributes=[];
    var aux=link[0].split(" ");
    for (var i = 0; i < aux.length; i++) {
      if(aux[i].indexOf('=')>-1){
        var attribute=aux[i].replace("/>","").replace(/"/g,"").split('=')
        attributes.push(attribute);
      }
    }
    for (var i = 0; i < attributes.length; i++) {
      if(attributes[i][0]=="rel"){
        if(attributes[i][1]==="stylesheet"){
          hasRel=true;
        }
      }
      if(attributes[i][0]=="href"){
        if(attributes[i][1]==="index.css"){
          hasHref=true;
        }
      }
      if(attributes[i][0]=="type"){
        if(attributes[i][1]==="text/css"){
          hasType=true;
        }
      }
    }
    if(hasType && hasRel && hasHref){
      return validationWord
    }
    else return errorMessage
  }
//Javascript incepe aici
var output=[]; // outputul functiilor JS

function scrie(text){
  output.push(text)
}

function getScript(htmlDocData){
  var script=htmlDocData.match(/<script id='userJsLesson'>[\s\S]*?<\/script>/gm)[0];
  script=script.replace("<script id='userJsLesson'>", "");
  script=script.replace("</script>", "");
  return script;
}

function setOutput(htmlDocData){
  output=[];
  script=getScript(htmlDocData);
  var Test = new Function("", script);
  Test();
  return(output)
}

function getVariables(script, variablesArray){
  var editedScript=script+"; var variables="+variablesArray+"; return variables";
  editedScript=editedScript.replace(/scrie\((.*?)\)/g, "")
  var Test = new Function("", editedScript);
  var variables=Test();
  return variables;
}

//ii dat peste cap daca exist nesting
function getIfs(script){
  var ifs=[];
  /*if(script.match(/if\((.*?)else\{(.*?)\}/gm)){
    ifs.push(script.match(/if\((.*?)else{(.*?)}/gm))
    script=script.replace(/if\((.*?)else{(.*?)}/gm, "")
  }*/
  ifs=script.match(/if\(([\s\S]*?)}(?!(\s*else))/gm)
  return ifs

}

function decomposeIf(ifStatement){
  var conditions=[];
  var instructions=[]
  var condsRaw=ifStatement.match(/if\(([\s\S]*?)\)/g)
  for (var i = 0; i < condsRaw.length; i++) {
    var condEdited=condsRaw[i].replace("if(", "").replace(")", "")
    conditions.push(condEdited);
  }
  var instructionsRaw=ifStatement.match(/\{([\s\S]*?)}/g)
  for (var i = 0; i < instructionsRaw.length; i++) {
    var instructionEddited=instructionsRaw[i].substring(1, instructionsRaw[i].length-1)
    instructions.push(instructionEddited);
  }
  return [conditions, instructions]
}

function CheckLessonConsoleLog(htmlDocData){
    setOutput(htmlDocData)
    if(output.length>=2){
      return validationWord
    }
    else{
      return errorMessage
    }

}

function CheckLessonDataTypesOne(htmlDocData){
  setOutput(htmlDocData);
  for (var i = 0; i < output.length; i++) {
    if(typeof output[i] ==="string"){
      return validationWord
    }
  }
  return errorMessage
}

function CheckLessonComads(htmlDocData){
  setOutput(htmlDocData)
  if(output.length>=3){
    return validationWord
  }
  else{
    return errorMessage
  }
}

function CheckLessonDataTypesTwo(htmlDocData){
  setOutput(htmlDocData);
  var hasNum=false;
  var hasString=false;
  for (var i = 0; i < output.length; i++) {
    if(typeof output[i] ==="string"){
      hasString=true;
    }
    else if(typeof output[i] ==="number"){
      hasNum=true;
    }
  }
  if(hasString && hasNum){
    return validationWord
  }
  else{
    return errorMessage
  }
}

function CheckLessonOperationsWithNumbers(htmlDocData){
  setOutput(htmlDocData);
  var numberCount=0;
  for (var i = 0; i < output.length; i++) {
    if(typeof output[i] ==="number"){
      numberCount++;
    }
  }
  if(numberCount>=3){
    return validationWord
  }
  else{
    return errorMessage
  }
}

function CheckLessonDataTypesThree(htmlDocData){
  setOutput(htmlDocData);
  var boolCount=0;
  for (var i = 0; i < output.length; i++) {
    if(typeof output[i] ==="boolean"){
      boolCount++;
    }
  }
  if(boolCount>=3){
    return validationWord
  }
  else{
    return errorMessage
  }
}

function CheckLessonStringMerging(htmlDocData){
  setOutput(htmlDocData);
  if(output[0]==="Academia de cod"&&
     output[1]==="Bine ai venit pe pagina Academia de cod"&&
     output[2]==="test@gmail.com"&&
     output[3]==="Astaseintampladacauitidespatii"
  ){
    return validationWord
  }
  else{
    return errorMessage;
  }
}

function CheckLessonVariabelsOne(htmlDocData){
  setOutput(htmlDocData);
  var script=getScript(htmlDocData);
  var editedScript=script+"; return numeleMeu";
  editedScript=editedScript.replace(/scrie\((.*?)\)/g, "")
  var Test = new Function("", editedScript);
  var numeleMeu=Test();
  if(output[0]==numeleMeu && output[1]=="Ma cheama "+numeleMeu){
    return validationWord
  }
  else{
    return errorMessage
  }

}

function CheckLessonVariabelsTwo(htmlDocData){
  setOutput(htmlDocData);
  var script=getScript(htmlDocData);
  var variables=getVariables(script, "[cont_mail, serviciu_mail, mail_complet]");
  if(variables[2]==variables[0]+"@"+variables[1] && output.includes(variables[2])){
    return validationWord
  }
  else{
    return errorMessage
  }
}

function CheckLessonVariabelsThree(htmlDocData){
  setOutput(htmlDocData);
  var script=getScript(htmlDocData);
  var variables=getVariables(script, "[nume_de_familie, prenume, varsta, resedinta, nume_complet, propoziția_dorita]");
  if(variables[4]==variables[1]+" "+variables[0] && variables[5]=="Bună, mă numesc " +variables[4]+ " am " +variables[2]+ " ani și locuiesc în "+variables[3] && output.includes(variables[5])){
    return validationWord
  }
  else{
    return errorMessage
  }
}

function CheckLessonConstants(htmlDocData){
  setOutput(htmlDocData);
  var script=getScript(htmlDocData);
  var variables=getVariables(script, "[PI, raza_cercului, aria_cercului]");
  if(variables[2]==variables[1]*variables[0]*variables[1] && output.includes(variables[2])){
    return validationWord
  }
  else{
    return errorMessage
  }
}

function CheckLessonArraysOne(htmlDocData){
  setOutput(htmlDocData);
  var script=getScript(htmlDocData);
  var variables=getVariables(script, "[pasiuniile_mele]");
  var array=variables[0];
  if(array.length>=5 && output.includes(array[0]) && output.includes(array[1]) && output.includes(array[array.length-1])){
    return validationWord
  }
  else{
    return errorMessage
  }
}

function CheckLessonArraysTwo(htmlDocData){
  //trebuie refacut
  Pass(htmlDocData)
}

function CheckLessonArraysThree(htmlDocData){
  setOutput(htmlDocData);
  var script=getScript(htmlDocData);
  var variables=getVariables(script, "[melodiile_mele_preferate]");
  var array=variables[0];
  if(array.length>=5 &&array[0][0] && output.includes(array[2][0])){
    return validationWord
  }
  else{
    return errorMessage
  }
}

function CheckLessonIf(htmlDocData){
  //nu va functiona daca sunt declarate variabile
  setOutput(htmlDocData);
  var script=getScript(htmlDocData);
  var ifs=getIfs(script)
  var ifsData=[];
  var hasTrueIf=false;
  var hasFalseIf=false;
  for (var i = 0; i < ifs.length; i++) {
    ifsData.push(decomposeIf(ifs[i]))
  }
  for (var i = 0; i < ifsData[0].length; i++) {
    if(eval(ifsData[i][0].toString())==true){
      hasTrueIf=true;
    }
    if(eval(ifsData[i][0].toString())==false){
      hasFalseIf=true
    }
  }
  if(hasTrueIf && hasFalseIf &&( output.includes("Am reușit!") || output.includes("Am reusit!") || output.includes("am reușit!") || output.includes("am reusit!"))){
    return validationWord;
  }
  else{
    return errorMessage;
  }
}

function CheckLessonNot(htmlDocData){
  var script=getScript(htmlDocData);
  var ifs=getIfs(script);
  var ifsData=[];
  for (var i = 0; i < ifs.length; i++) {
    ifsData.push(decomposeIf(ifs[i]))
  }
  for (var i = 0; i < ifsData[0].length; i++) {
    if(ifsData[i][0].toString().includes("!")){
      return validationWord;
    }
    else{
      return errorMessage
    }
  }
}

function CheckLessonAndOr(htmlDocData){
  var answersOne=["Ai voie să conduci", "ai voie să conduci"];
  var answersTwo=["Îmi place mașina asta", "Imi place masina asta", "îmi place mașina asta", "imi place masina asta"]
  var script=getScript(htmlDocData);
  var ifs=getIfs(script);
  var aiPermis=true;
  var aiBaut=false;
  if(!answersOne.includes(eval(ifs[0].toString().replace(/scrie/g, "")))){
    return errorMessage
  }
  var aiPermis=false;
  var aiBaut=false;
  if(answersOne.includes(eval(ifs[0].toString().replace(/scrie/g, "")))){
    return errorMessage
  }
  var aiPermis=true;
  var aiBaut=true;
  if(answersOne.includes(eval(ifs[0].toString().replace(/scrie/g, "")))){
    return errorMessage
  }
  var aiPermis=false;
  var aiBaut=true;
  if(answersOne.includes(eval(ifs[0].toString().replace(/scrie/g, "")))){
    return errorMessage
  }

  var culoareaMasinii="galben"
  if(!answersTwo.includes(eval(ifs[1].toString().replace(/scrie/g, "")))){
    return errorMessage
  }
  var culoareaMasinii="albastru"
  if(!answersTwo.includes(eval(ifs[1].toString().replace(/scrie/g, "")))){
    return errorMessage
  }
  var culoareaMasinii="rosu"
  if(answersTwo.includes(eval(ifs[1].toString().replace(/scrie/g, "")))){
    return errorMessage
  }
  return validationWord;
}

function CheckLessonIfElse(htmlDocData){
  var trueAnswers=["Numărul e par", "numărul e par", "Numarul e par", "numarul e par"];
  var falseAnswers=["Numărul nu e par", "numărul nu e par", "Numarul nu e par", "numarul nu e par"];
  setOutput(htmlDocData);
  var script=getScript(htmlDocData);
  var ifs=getIfs(script)
  var x=2;
  if(!trueAnswers.includes(eval(ifs[0].toString().replace(/scrie/g, "")))){
    return errorMessage
  }
  var x=-3
  if(!falseAnswers.includes(eval(ifs[0].toString().replace(/scrie/g, "")))){
    return errorMessage
  }
  var x=7
  if(!falseAnswers.includes(eval(ifs[0].toString().replace(/scrie/g, "")))){
    return errorMessage
  }
  if(!script.toLowerCase().includes("else")){
    return errorMessage
  }
  return validationWord;
}

function CheckLessonElseIf(htmlDocData){
  var fourTen=["Bună dimineața", "Buna dimineata", "bună dimineața", "buna dimineata"];
  var elevenEighteen=["Bună ziua", "Buna ziua", "bună ziua", "buna ziua"];
  var nineTeenTwentytwo=["Bună seara", "Buna seara", "bună seara", "buna seara"];
  var otherHours=["Noapte bună", "Noapte buna", "noapte bună", "noapte buna"];
  setOutput(htmlDocData);
  var script=getScript(htmlDocData);
  var ifs=getIfs(script)
  var ora=12
  if(!elevenEighteen.includes(eval(ifs[0].toString().replace(/scrie/g, "")))){
    return errorMessage
  }
  var ora=23
  if(!otherHours.includes(eval(ifs[0].toString().replace(/scrie/g, "")))){
    return errorMessage
  }
  var ora=7
  if(!fourTen.includes(eval(ifs[0].toString().replace(/scrie/g, "")))){
    return errorMessage
  }
  var ora=20
  if(!nineTeenTwentytwo.includes(eval(ifs[0].toString().replace(/scrie/g, "")))){
    return errorMessage
  }
  if(!script.toLowerCase().includes("else if")){
    return errorMessage
  }
  return validationWord;
}

function CheckLessonForOne(htmlDocData){
    setOutput(htmlDocData);
    var rightAnswers=["Voi indenta corect codul", "voi indenta corect codul"];
    var counter=0;
    for (var i = 0; i < output.length; i++) {
      if(rightAnswers.includes(output[i])){
        counter++;
      }
    }
    if(counter==200){
      return validationWord;
    }
    else{
        return "Se pare de ai printat mesajul de "+counter+"(de) ori"
    }
}

function CheckLessonForTwo(htmlDocData){
  setOutput(htmlDocData);
  var words=["Învăț", "învăț", "Invat", "invat"];
  var counter=0;
  for (var i = 0; i < output.length; i++) {
    if(words.includes(output[i])){
      counter++;
    }
  }
  for(var i=0; i<3; i++){
    if(output[i]!=(i+2)*2){
      return errorMessage;
    }
  }
  for (var i = 3; i < 27; i++) {
    if(output[i]!=(28-i)*5){
      return errorMessage
    }
  }
  if(counter==100){
    return validationWord
  }
  else{
    return "Se pare de ai printat mesajul de "+counter+"(de) ori"
  }
}

function CheckLessonForThree(htmlDocData){
    setOutput(htmlDocData);
    var script=getScript(htmlDocData);
    var variables=getVariables(script, "[numere]");
    if(variables[0].length<10){
      return errorMessage;
    }
    var index=0;//index-ul elementelor din output
    for (var i = 0; i < variables[0].length; i++) {
      if(variables[0][i]>12){
        if(variables[0][i]!=output[index]){
          return errorMessage
        }
        index++;
      }
    }
    for (var i = 0; i < output.length; i++) {
      if(output[i]<=12){
        return errorMessage;
      }
    }
    return validationWord;
}

function CheckLessonFunctionOne(htmlDocData){
  setOutput(htmlDocData);
  if(output.length<3){
    return errorMessage
  }
  //bloc de test
  var script=getScript(htmlDocData).replace("scrie", "return");
  var scriptEdited=script+";return medieAritmetica(4,8)";
  var test= new Function("", scriptEdited);
  if(test()!==6){
    return errorMessage
  }
  //bloc de test
  var scriptEdited=script+";return medieAritmetica(9,-3)";
  var test= new Function("", scriptEdited);
  if(test()!==3){
    return errorMessage
  }
  //bloc de test
  var scriptEdited=script+";return medieAritmetica(2,7)";
  var test= new Function("", scriptEdited);
  if(test()!==4.5){
    return errorMessage
  }
  return validationWord
}

function CheckLessonWhile(htmlDocData){
  setOutput(htmlDocData);
  for (var i = 0; i < output.length; i++) {
    if(output[i]>0.75 && i!=output.length-1){
      return errorMessage
    }
  }
  return validationWord;
}

function CheckLessonFunctionTwo(htmlDocData){
  setOutput(htmlDocData);
  var script=getScript(htmlDocData);
  if(output.length<4){
    return errorMessage
  }
  //bloc de test
  var scriptEdited=script+";return maxim(9,-3)";
  var test= new Function("", scriptEdited);
  if(test()!==9){
    return errorMessage
  }
  //bloc de test
  var scriptEdited=script+";return maxim(19,43)";
  var test= new Function("", scriptEdited);
  if(test()!==43){
    return errorMessage
  }
  //bloc de test
  var scriptEdited=script+";return maxim(12,12)";
  var test= new Function("", scriptEdited);
  if(test()!==12){
    return errorMessage
  }
  return validationWord
}

function CheckLessonFunctionThree(htmlDocData){
  setOutput(htmlDocData);
  //mesajele posibile de eroare (crise de utilizator, nu se refera la cele folosite de validator )
  var erMes=["Atenție, array-ul pe care l-ai introdus e gol", "Atentie, array-ul pe care l-ai introdus e gol", "atenție, array-ul pe care l-ai introdus e gol", "atentie, array-ul pe care l-ai introdus e gol"]
  if(output.length<3){
    return errorMessage
  }
  var script=getScript(htmlDocData);
  //bloc de test
  var scriptEdited=script+";return medieAritmetica([4,8])";
  var test= new Function("", scriptEdited);
  if(test()!==6){
    return errorMessage
  }
  //bloc de test
  var scriptEdited=script+";return medieAritmetica([9,-3, 12, 45])";
  var test= new Function("", scriptEdited);
  if(test()!==15.75){
    return errorMessage
  }
  var scriptEdited=script+";return medieAritmetica([])";
  var test= new Function("", scriptEdited);
  if(!erMes.includes(test())){
    return errorMessage
  }
  return validationWord
}

function CheckLessonWhile(htmlDocData){
  setOutput(htmlDocData);
  for (var i = 0; i < output.length; i++) {
    if(output[i]>0.75 && i!=output.length-1){
      return errorMessage
    }
  }
  return validationWord;
}

function CheckLessonObject(htmlDocData){
  setOutput(htmlDocData);
  var script=getScript(htmlDocData);
  var variables=getVariables(script, "[masina_mea]");
  if(variables[0].marca && variables[0].pret && variables[0].model && output.includes(variables[0].anulFabricarii)){
    return validationWord
  }
  else{
    return errorMessage
  }
}

function CheckLessonMethod(htmlDocData){
  setOutput(htmlDocData);
  var script=getScript(htmlDocData);
  var variables=getVariables(script, "[om]");
  var om= variables[0];
  var properties=[];
  if(!variables[0].inaltime || !variables[0].pret || variables[0].varsta || !variables[0].prenume || !variables[0].masa){
    return validationWord
  }
  if(om.saluta()!="salut" && om.saluta()!="Salut" && om.saluta()!="Salut!" && om.saluta()!="salut!"){
    alert("sal")
    return errorMessage
  }
  if(om.descriere()!= "Mă cheamă" +om.prenume+" "+ om.nume + " "+ "și am "+ om.varsta+ "ani!" && om.descriere()!= "Ma cheama" +om.prenume+" "+ om.nume + " "+ "si am "+ om.varsta+ "ani!"){
    alert("name")
    return errorMessage
  }
  if(output.includes(om.saluta()) && output.includes(om.descriere())){
    alert("func")
    return validationWord;
  }

}

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

//o functie care te lasa sa treci pur si simplu
function Pass(htmlDocData){
   return validationWord;
}
