var app=angular.module('Lesson', ['ngRoute', 'ngResource', , 'ngSanitize'])
var lessonName;
var lessonAngularObject;
var jsAux="<!DOCTYPE html>\n\t<html>\n\t\t<head>\n\t\t\t<meta charset=\"utf-8\"/>\n\t\t\t<title>JS-Aux</title>\n\t\t</head>\n\t\t<body>\n\t\t\t<div id=\"console\"></div>\n\t\t</body>\n\t\t<script>var output=[];function scrie(text){console.log(text); var cons=document.getElementById('console');cons.innerHTML+=text+\"<br/>\"; output.push(text)}\n\t\t</script>\n\t\t<script src=\"index.js\"></script>\n\t</html>"
//DE ADAUGAT STERGERE DE CONSOLA SI SELECTARE DE BUTOANE NECESARE

app.controller( 'LessonController', function($scope,$sce, $http){
	if(lessonName==null){
		lessonName="ce_este_html:html-start"
	}



	$http.get('Lessons/lessons.json')
	.success(function(response){
    	$scope.lessons= response.Lessons;
			$scope.LoadLessonToPage(lessonName);
    })


		$scope.LoadNextLesson=function(){
			lessonName=$scope.lesson["Next Lesson"];
			$scope.LoadLessonToPage($scope.lesson["Next Lesson"])
		}

  	$scope.LoadLessonToPage =function (lessonName){
			  $('#nextButton').css("display", "none")
				SetAllBoxes("inline-block")
				for (var i = 0; i < document.getElementsByClassName("boxButton").length; i++) {
					$(document.getElementsByClassName("boxButton")[i]).css("display", "none")
				}
			for (var lesson in angular.fromJson($scope.lessons)) {
				if (lesson.toString()==lessonName) {

					$scope.lesson=$scope.lessons[lesson.toString()];
					lessonAngularObject=$scope.lesson;
					if($scope.lesson["HTML"]!==undefined && $scope.lesson["HTML"]!="JsAux"){
							$(document.getElementById("HTML")).css("display", "inline-block")
					}
					if($scope.lesson["HTML"]!=="previos" && $scope.lesson["HTML"]!="JsAux"){
						//alert($scope.lesson["HTML"])
						htmlEditor.setValue($scope.lesson["HTML"], -1)
					}
					if($scope.lesson["CSS"]!==undefined){
						$(document.getElementById("CSS")).css("display", "inline-block")
					}
					if($scope.lesson["CSS"]!==undefined && $scope.lesson["CSS"]!=="previos"){
						cssEditor.setValue($scope.lesson["CSS"], -1)
					}
					if($scope.lesson["JS"]!==undefined){
						$(document.getElementById("JS")).css("display", "inline-block")
					}
					if($scope.lesson["JS"]!==undefined && $scope.lesson["JS"]!=="previos"){
						jsEditor.setValue($scope.lesson["JS"], -1)
					}
					$("h1").text(lessonAngularObject.Title)
					SaveUserData();

					//monstrul asta curata textul de string escaping
					$scope.Text=[];
					var i=0;
					for (var para in $scope.lesson["Text"]) {
						$scope.Text[i]=$sce.trustAsHtml($scope.lesson["Text"][para]);
						i++;
					}

				}
			}
				//	checkHTMLDisplay();
				//trebuie ca in primul moment in care se incarca pagina sa fie toate cututee vizibile altfel face urat
				var loadBox="HTML";
				if($scope.lesson["HTML"]==="JsAux"){
					loadBox="JS"
					htmlEditor.setValue(jsAux, -1)
				}
				setTimeout(function(){ChangeBox(loadBox)}, 1);
				setTimeout(function(){changeButton(loadBox)}, 1);
		}

		//verifica daca sa incarce sau nu HTML-ul in pagina.
		function checkHTMLDisplay(){

		}


	/*	function GetLessonName () {
			var url=window.location.href;
			var params=url.split('?')[1].split('&');
			return params[0].split('=')[1];
		};*/

    //corecteaza html-ul
    $scope.CheckHTML= function() {
			SaveUserData();


			var htmlDocData = $scope.lesson.userHTML.toLowerCase();

			if($scope.lesson.userCSS){
				htmlDocData+="\n<style>\n"+$scope.lesson.userCSS+"\</style>";
			}
			if($scope.lesson.userJS){
				htmlDocData+=jsAux+"\n<script id='userJsLesson'>\n"+$scope.lesson.userJS+"\</script>";

			}
			var iframe=document.getElementById("fakeOutput");
			var doc = iframe.document;
			if(iframe.contentDocument)
				doc = iframe.contentDocument; // For NS6
			else if(iframe.contentWindow)
				doc = iframe.contentWindow.document; // For IE5.5 and IE6
			// Put the content in the iframe
			doc.open();
			//trebuie sa sterg linkul deoarece altfel imi da eroare ca nu gaseste fisierul css
			var editedHtmlDocData=htmlDocData.replace(/<link(.*?)\/>/, "")
			editedHtmlDocData = editedHtmlDocData.replace("<script src=\"index.js\"></script>", "");//elimina erori ca nu gaseste fisiere
			doc.writeln(editedHtmlDocData);
			doc.close();
			var Test = new Function("htmlDocData", "return "+$scope.lesson["Validator"]);
			//aici e try catch deoarece nu se poate prevedea ce erori vor face elevii
			try{
				if(!hasParseErrorsXML(GetXML(htmlDocData)) || lessonName==="ce_este_html:html-start" || $scope.lesson["HTML"]==="JsAux"){
					DisplayHTMLCheckResult(Test(htmlDocData));
				}
				else{
					alert("ceva nu pare in regula XML")
				}
			}
			catch(err){
				alert(err)
			}

    }

		function SaveUserData(){
			$scope.lesson.userHTML=htmlEditor.getValue();
			$scope.lesson.userCSS=cssEditor.getValue();
			$scope.lesson.userJS=jsEditor.getValue();


			$.ajax({
			 url: 'index.php',
			 type:'POST',
			 data:
			 {
					 save:"true",
					 html: $scope.lesson.userHTML,
					 css: $scope.lesson.userCSS,
					 js:$scope.lesson.userJS
			 },
			 success: function(msg){
					document.getElementById('output').src = 	document.getElementById('output').src;
				}
	 		});
		}

    //NU STERGE ASTA-o pastram in caz ca avem vreodata nevoe
		//inserez in fiecare loop cte un counter ca sa pot preveni loop-urile infinite
		/*function EditLoopsToCatchInfinites(string){
		  var functionText="var counterForInfLoopsPlsDontUseThisNameInConsole=0;"+string;
		  var fors = string.match(/for[\s\S]*?{([\s\S]*?)}/g);

		  if(fors){
		    for (var i = 0; i < fors.length; i++) {
		      var forContent =fors[i].match(/\{([\s\S]*)}/);
		      forContent="counterForInfLoopsPlsDontUseThisNameInConsole++; if(counterForInfLoopsPlsDontUseThisNameInConsole>10000){break;}"+forContent[1]
		      var newFor=fors[i].replace(fors[i].match(/\{([\s\S]*)}/)[1], forContent)
		      functionText=functionText.replace(fors[i], newFor)
		    }

		    return functionText
		  }
		  else{
		    return string;
		  }
		}*/

		//trimite input-ul pt validare ca string, document html sau obiect jQuery in functie de ce e necesar
		/*function GetDocumentForm(htmlDocData){
			switch ($scope.lesson["Validator"]["Document"]) {

				case "htmlDoc":
					parser=new DOMParser();
					var htmlDoc=parser.parseFromString(htmlDocData, "text/html");
					return htmlDoc
				break;
				case "XmlDoc":
					parser=new DOMParser();
					var htmlDoc=parser.parseFromString(htmlDocData, "text/xml");
					x = htmlDoc.documentElement.childNodes;
					alert(htmlDoc.documentElement.nodeName)
					for (i = 0; i <x.length; i++) {
	  				alert(x[i].nodeName) ;
					}
					return htmlDoc
				break;
				default:
				return  htmlDocData

			}
		}*/

})
