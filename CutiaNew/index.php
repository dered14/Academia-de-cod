<!DOCTYPE html>
<html>
  <head>
    <title>Cutiuta</title>
        <link rel="stylesheet" type="text/css" href="Plugins/sweetalert-master/dist/sweetalert.css">
        <link rel="stylesheet" href="CSS/main.css">
        <link rel="stylesheet" href="CSS/colorText.css">
        <link rel="stylesheet" href="Plugins/bootstrap/css/bootstrap.min.css">
        <script src="https://code.jquery.com/jquery-2.2.4.min.js"></script>
        <script src="Plugins/bootstrap/js/bootstrap.min.js"></script>
        <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.7/angular.js"></script>
        <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.7/angular-route.js"></script>
        <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.7/angular-resource.js"></script>
        <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/angularjs/1.2.7/angular-sanitize.js"></script>
        <script type="text/javascript" src="Plugins/js-expression-eval-master/parser.js"></script>

        <!-- load ace -->
        <script src="Plugins/ace-builds-master/src/ace.js"></script>
        <script src="JS/index.js"></script>
        <script src="Plugins/bootbox.min.js"></script>
        <script src="Plugins/sweetalert-master/dist/sweetalert.min.js"></script>
        <script type="text/javascript" src="JS/indexController.js"></script>
        <script src="JS/estetic.js"></script>
        <script src="JS/ValidationLibrary.js"></script>
  </head>

  <body ng-app="Lesson" ng-controller="LessonController">


    <div class="page-header">
           <h1>{{lesson.Title}}</h1>
        <div class="row" ng-model="lesson" id="header">

          <div id="wrapper">

            <div class="overlay"><h1>{{lesson.Title}}</h1></div>

        <!-- Sidebar -->
         <nav class="navbar navbar-inverse navbar-fixed-top" id="sidebar-wrapper" role="navigation">
            <ul class="nav sidebar-nav">
                <li class="sidebar-brand">

                    <a href="#">Lectii</a>

                </li>

                <li class="dropdown">   <!-- deschide tot meniul-->
                  <a href="#" class="dropdown-toggle" data-toggle="dropdown">HTML<span class="caret"></span></a>


                    <ul class="dropdown-menu" role="menu">
                       <li class="dropdown-header">Lectii html</li><!--deschide submeniul care functioneaza pe acelasi principiu ca si meniul principal.in felul acest se pot adauga sau scoate-->

                         <li><a href="#"> Html-start</a></li>

                         <li><a href="#">Html-primul tag</a></li>

                         <li><a href="#">Scheletul unei pagini html</a></li>

                         <li><a href="#">Titlul paginii</a></li>

                         <li><a href="#">Structurarea unui document html<br>Partea a doua</a></li>

                         <li><a href="#">Comentarii</a></li>

                         <li><a href="#">Paragrafe</a></li>

                         <li><a href="#">Titlu de paragraf</a></li>

                        <li><a href="#">Recapitulare</a></li>
                    </ul>
                </li>
                <li>
                    <a href="#">Home</a>
                </li>

                <li>
                    <a href="#">About</a>
                </li>

                <li>
                    <a href="#">Events</a>
                </li>

                <li>
                    <a href="#">Team</a>
                </li>

                <li>
                    <a href="#">Services</a>
                </li>

                <li>
                    <a href="#">Contact</a>
                </li>

                <li>
                    <a href="#">Follow me</a>
                </li>
            </ul>
        </nav><!-- /#sidebar-wrapper -->

        <!-- Page Content -->
         <div id="page-content-wrapper"><!--butonul x-->
              <button type="button" class="hamburger is-closed" data-toggle="offcanvas">
                  <span class="hamb-top"></span>
                  <span class="hamb-middle"></span>
                  <span class="hamb-bottom"></span>
              </button>
        </div> <!-- /#page-content-wrapper -->
       </div> <!-- /#wrapper -->
      </div><!--inchide header-->
     </div>

    <div class="container-fluid">

      <div class="row" id="toprow">
        <div class="col-xs-5" id="TextLectie">

          <div ng-model="lesson">
               <h3>{{lesson.Title}} </h3>

              <div ng-repeat="p in Text">
                   <p ng-bind-html="p">{{p}}</p>
              </div>
            <h4>Instrucțiuni</h4>
            <ol >
                 <li ng-repeat="inst in lesson.Instructions">{{inst}}</li>
            </ol>

          </div>
        </div>

      <div class="col-xs-7" id="user-input">

             <button onclick="ChangeBox('HTML'); changeButton('Html')"  class="btn btn-md btn-info btn-outline boxButton active" id="HTML">Html</button>
             <button onclick="ChangeBox('CSS'); changeButton('Css')"  class="btn btn-md btn-info btn-outline boxButton" id="CSS">Css</button>
             <button onclick="ChangeBox('JS'); changeButton('Js')"  class="btn btn-md btn-info btn-outline boxButton" id="JS">Js</button>

        <form method="post"  id="submitForm">

             <div ng-value="lesson" class="user-input-box" id="user-input-box-html">
                  <textarea class="user-input-text" id="user-input-text-html" name="user-input-text-html">{{lesson.userHTML}}</textarea>
             </div>

             <div class="user-input-box" id="user-input-box-css" >
                  <textarea  class="user-input-text" id="user-input-text-css" name="user-input-text-css"  >{{lesson.userCSS}}</textarea>
             </div>

             <div class="user-input-box" id="user-input-box-js" >
                  <textarea  class="user-input-text" id="user-input-text-js" name="user-input-text-js" >{{lesson.userJS}}</textarea>
             </div>
        </form>
      </div>
     </div>
             <button type="input" ng-click="CheckHTML();" type="submit" name="submit" value="Executa" id="submit" class="btn btn-md btn-warning">Executa</button>
             <button type="input" ng-click="LoadNextLesson();" type='button' value="Next" id="nextButton" class="btn btn-md btn-success">Urmatoarea lectie</button>
             <button class="btn btn-md pull-right" clickable="false"  data-toggle="tooltip" data-placement="bottom" title="Citeste atent!">Indicii</button>

    </div>
<div class="container-fluid">
      <div class="row" id="bottomRow">
             <iframe src="numeExercitiu/index.html" id="output">
                     <p>A aparut o eroare. Pentru a vedea posibile cauze va rugam faceti click <a href="#">aici</a></p>
             </iframe>
             <!--Fake output e un iframe invizibil. Deoarece dureaza pana iframe-ul vizibil se updateaza de la server il updatez pe asta local (e mai rapid)-->
             <!--Am nevoie de un iframe fiindca fara nu pot sa testez css. Pot testa css doar cu ajutorul felului in care e randat un element-->
             <iframe style="display:none" src="#" id="fakeOutput">
               <p>A aparut o eroare. Pentru a vedea posibile cauze va rugam faceti click <a href="#">aici</a></p>
             </iframe>
      </div>


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
      if($_POST['save']=="true"){
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

    </div><!--container fluid-->

  </body>



</html>
