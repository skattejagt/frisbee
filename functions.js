function getPlatformType() {
	if(navigator.userAgent.match(/mobile/i)) {
		return 2;
	} else if (navigator.userAgent.match(/iPad|Android|Touch/i)) {
		return 1;
	} else {
		return 0;
	}
}
function tallyScore(){
	document.getElementById("countdown").innerHTML = "du nåede det på: " + timetaken + " sekunder";
}
function enCountDown(){
  var timeleft = 5;
  var timer = setInterval(function(){
    document.getElementById("countdown").innerHTML = "Starter om: " + timeleft ;
    timeleft -= 1;
    if(timeleft <= 0){
      clearInterval(timer);
      document.getElementById("countdown").innerHTML = "START";
      timerUsed();
    }
  }, 1000);
}

function timerUsed(){
  var timer = setInterval(function(){
    document.getElementById("countdown").innerHTML = " ( "+ timetaken + " )";
    timetaken += 1;
    if(timetaken > 1500 || won == true){
      clearInterval(timer);
      tallyScore();
    }
  }, 1000);
}