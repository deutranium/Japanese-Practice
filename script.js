// A self note - Make this WITHOUT jQuery!

//Variables
let data;								// To store alphabets.json
let hiragana;							// The hiragana alphabet
let romaji;								// The correct Romaji translation
let indexArr;							// To store the shuffled array of indices for alphabets.json
let curIndex = 0; 						// Index in indexArr whose alphabet is currently displayed
let elemWrong = document.querySelectorAll(".wrong");
let elemError = document.querySelectorAll(".error");
let elemDibba = document.querySelectorAll(".response-display, .response-text");
let bigDibba = document.getElementById("box-big");
let isExerciseComplete = false;
let positiveScore = 0;
let negativeScore = 0;
let result;								// To store the results


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
		indexArr = randomize(newArr(data.data.length));
		update();
	}
});

getJSON("result.json", function(e, response){
	if(e != null) console.log(e);
	else result = response;
})


/*------------------------------------------------*/


// To generate an array of numbers
function newArr(lgt){
	indexArr = [];
	for(let i = 0; i < lgt; i++){
		indexArr.push(i);
	}

	return indexArr;
}


// To randomise the alphabets
function randomize(arr){
	for(let i = arr.length - 1; i > 0; i --){
		let j = Math.floor(Math.random() * (i + 1));

		let a = arr[j];
		arr[j] = arr[i];
		arr[i] = a;
	}

	return arr;
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* ===== DOM Specific functions sart here ===== */

//////////////////////////////////////////////////////////////////////////////////////////////////////////////


function update(){
	if(curIndex == data.data.length) exerciseCompleted();
	else{
		hiragana = data.data[indexArr[curIndex]]["HG"];
		romaji = data.data[indexArr[curIndex]]["RJ"];
		curIndex++;

		bigDibba.innerHTML = hiragana;
	}
}


/*------------------------------------------------*/


function checkAnswer(inputVal){
	if(inputVal.toLowerCase() == romaji){
		input.value = "";
		positiveScore += 1;
		document.getElementById("box-side").children[0].innerHTML = "+ " + positiveScore;
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

//On submit
function atbs(){
	let i = elemDibba.length;
	while(i--){
		elemDibba[i].setAttribute("style", "display : none");
	}

	let inputValue = input.value;
	checkAnswer(inputValue);
	
}

// Redo
function redo(){
	negativeScore = 0;
	positiveScore = 0;
	document.getElementById("exercise-done").removeAttribute("style");
	document.getElementById("box-side").removeAttribute("style");
	document.getElementById("box-side").children[0].innerHTML = "+ 0";
	document.getElementById("box-side").children[1].innerHTML = "- 0";
	indexArr = randomize(newArr(data.data.length));
	curIndex = 0;
	update();

}

/*------------------------------------------------*/
