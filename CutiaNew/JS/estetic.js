
function changeButton(button){
  var buttons=document.getElementsByClassName("btn-outline");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].className=buttons[i].className.replace("active", "");
      if(buttons[i].id==button){
        buttons[i].className+=" active";
      }
    }
  }              /*asta e functia invocata dupa ChangeBox care schimba si mentine culoarea butoanelor active*/




$(document).ready(function() {

  var h1 =  $( "h1" );

  h1.click(function() {

    h1.fadeOut(2000).text("Daca esti curios cum s-a intamplat asta ramai pe academie si invata Jquerry!");

    h1.fadeIn(function(){
      swal("Apasa ok si pune mouse-ul pe text!");
    });

});
h1.mouseenter(function(){

  h1.text(lessonAngularObject.Title);

});





                                                        /*aici inchid animatia h1   */

var trigger = $('.hamburger'),
       overlay = $('.overlay'),
       isClosed = false;

    trigger.click(function () {
      hamburger_cross();
    });

function hamburger_cross() {

      if (isClosed == true) {
        overlay.hide();
        trigger.removeClass('is-open');
        trigger.addClass('is-closed');
        isClosed = false;
      }
      else {
        overlay.show();
        trigger.removeClass('is-closed');
        trigger.addClass('is-open');
        isClosed = true;
      }
  }

  $('[data-toggle="offcanvas"]').click(function () {
        $('#wrapper').toggleClass('toggled');
       });                                                    /*aici inchid functiile pentru meniu*/


  $('[data-toggle="tooltip"]').tooltip();

 /*aici inchid functiile pentru hint uri*/


});/*aici inchid s(document).ready*/
