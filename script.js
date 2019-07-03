// A self note - Make this WITHOUT jQuery
// Self Note #2 - This code looks like a mess

// Credits where due
console.log("Sounds from http://www.guidetojapanese.org");
console.log("Images from https://www.flaticon.com , check result.json for full link to the image");


// Global Variables
let data;								// To store alphabets.json
let hiragana;							// The hiragana alphabet
let roumaji;							// The correct roumaji equivalent
let indexArr;							// To store the shuffled array of indices for alphabets.json
let curIndex = 0; 						// Index in indexArr whose alphabet is currently displayed
let elemWrong = document.querySelectorAll(".wrong");	// To be shown for wrong answer
let elemError = document.querySelectorAll(".error");	// To be shown if no text is entered
let elemDibba = document.querySelectorAll(".response-display, .response-text");	// The (hidden by default) elements responding to the input (wrong, error etc.)
let bigDibba = document.getElementById("box-big");		// To be shown on completion of exercise
let positiveScore = 0;
let negativeScore = 0;
let result;								// To store the results
let soundUrl;
let audio;


//////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* ===== Basic functions ===== */

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Event listener for enter key press
let input = document.getElementById("input-box");
input.innerHTML = "";
input.addEventListener("keyup", function(e){
	if(e.keyCode == 13){
		e.preventDefault();
		atbs();
	}
});


/*------------------------------------------------*/


//get the JSON files
let getJSON = function(url, callback){
	let xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	xhr.responseType = 'json';
	xhr.onload = function(){
		return (xhr.status === 200) ? callback(null, xhr.response) : callback(xhr.status, xhr.response);
	}
	xhr.send();
}


getJSON("kana.json", function(e, response){
	if(e != null) console.log(e);
	else{
		data = response;
		indexArr = randomizeArr(data.data.length);
		update();
	}
});

getJSON("result.json", function(e, response){
	if(e != null) console.log(e);
	else result = response;
})


/*------------------------------------------------*/

// To create and randomise the array kana
function randomizeArr(lgt){

	let arr = [];
	for(let i = 0; i < lgt; i++){
		arr.push(i);
	}


	for(let i = arr.length - 1; i > 0; i --){
		let j = Math.floor(Math.random() * (i + 1));

		let a = arr[j];
		arr[j] = arr[i];
		arr[i] = a;
	}

	return arr;
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* ===== DOM Specific functions start here ===== */

//////////////////////////////////////////////////////////////////////////////////////////////////////////////


function checkAnswer(inputVal){
	if(inputVal.toLowerCase() == roumaji){
		input.value = "";
		positiveScore += 1;
		document.getElementById("box-side").children[0].innerHTML = "+" + positiveScore;
		update();
	}

	else if(inputVal == ""){
		let i = elemError.length;
		while(i--){
			elemError[i].setAttribute("style", "display : block");
		}

	}

	else{
		negativeScore--;
		let i = elemWrong.length;
		while(i--){
			elemWrong[i].setAttribute("style", "display : block");
		}
		input.value = "";
		document.getElementById("box-side").children[1].innerHTML = negativeScore;
	}
}


/*------------------------------------------------*/


function update(){
	if(curIndex == data.data.length) exerciseCompleted();
	else{
		hiragana = data.data[indexArr[curIndex]]["HG"];
		roumaji = data.data[indexArr[curIndex]]["RJ"];
		curIndex++;
		soundUrl = "sounds/" + roumaji + ".mp3";
		audio = new Audio(soundUrl);

		bigDibba.innerHTML = hiragana;
	}
}

/*------------------------------------------------*/


function exerciseCompleted(){
	console.log("tada!");
	document.getElementById("correct-score").innerHTML = "Corrrect attempts : +" + positiveScore;
	document.getElementById("wrong-score").innerHTML = "Incorrrect attempts : " + negativeScore;
	let resultImg = "";
	let resultText = "";
	if(positiveScore + negativeScore == data.data.length){
		resultImg = result.data[3].image;
		resultText = result.data[3].text;
	}

	else if(positiveScore + negativeScore >= (data.data.length * 0.90)){
		resultImg = result.data[2].image;
		resultText = result.data[2].text;
	}
	else if(positiveScore + negativeScore >= (data.data.length * 0.80)){
		resultImg = result.data[1].image;
		resultText = result.data[1].text;
	}
	else{
		resultImg = result.data[0].image;
		resultText = result.data[0].text;
	}

	document.getElementById("result-img").setAttribute("src", resultImg);
	document.getElementById("result-text").innerHTML = resultText;

	document.getElementById("exercise-done").setAttribute("style", "display: block");
	document.getElementById("box-side").setAttribute("style", "visibility: hidden");
}

// Redo
function redo(){
	negativeScore = 0;
	positiveScore = 0;
	document.getElementById("exercise-done").removeAttribute("style");
	document.getElementById("box-side").removeAttribute("style");
	document.getElementById("box-side").children[0].innerHTML = "+0";
	document.getElementById("box-side").children[1].innerHTML = "-0";
	indexArr = randomizeArr(data.data.length);
	curIndex = 0;
	update();

}

//On submit
function atbs(){
	let i = elemDibba.length;
	while(i--){
		elemDibba[i].setAttribute("style", "display : none");
	}

	let inputValue = input.value;
	checkAnswer(inputValue);
	
}

/*------------------------------------------------

Summary of all the functions:

- getJSON(url, function(error, response){}) : to get the JSON at the location specified by URL
- randomizeArr(length) : Create an array of length as `length` with numbers from 0 through `length - 1`
- checkAnswer(response) : Checks if thd answer is correct from the specified JSON
- update() : Updates the UI after every correct answer
- exerciseCompleted() : Displays the final results, and asks if the user wants to redo
- redo() : Resets everything, and starts the exercise from the beginning
- atbs() : Calls the rest of the function on enter key press, and submit button click

------------------------------------------------*/
