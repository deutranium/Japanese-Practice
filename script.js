// A self note - Make this WITHOUT jQuery!

//Variables
let data;		// To store alphabets.json
let hiragana;	// The hiragana alphabet
let romaji;		// The correct Romaji translation
let indexArr;	// To store the shuffled array of indices for alphabets.json
let curIndex = 0; //Index in indexArr whose alphabet is currently displayed
let nextQuestion = false;	// To display the next question or not
let elemCorrect = document.querySelectorAll(".correct");
let elemWrong = document.querySelectorAll(".wrong");
let elemDibba = document.querySelectorAll(".response-display, .response-text");
let bigDibba = document.getElementById("box-big");


//////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* Basic functions */

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Event listener for enter key press
let input = document.getElementById("input-box");
input.addEventListener("keyup", function(e){
	if(e.keyCode == 13){
		e.preventDefault();
		atbs();
	}
});


/*------------------------------------------------*/


//get the JSON file
let getJSON = function(url, callback){
	let xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	xhr.responseType = 'json';
	xhr.onload = function(){
		return (xhr.status === 200) ? callback(null, xhr.response) : callback(xhr.status, xhr.response);
	}
	xhr.send();
}


getJSON("alphabets.json", function(e, response){
	if(e != null) console.log(e);
	else{
		data = response;
		indexArr = randomize(newArr(data.data.length));
		update();
	}
});


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

/* DOM Specific functions sart here */

//////////////////////////////////////////////////////////////////////////////////////////////////////////////


function update(){
	hiragana = data.data[indexArr[curIndex]]["HG"];
	romaji = data.data[indexArr[curIndex]]["RJ"];
	curIndex++;

	bigDibba.innerHTML = hiragana;

	console.log(romaji);
}


/*------------------------------------------------*/


function checkAnswer(inputVal){
	if(inputVal == romaji){
		let i = elemCorrect.length;
		while(i--){
			elemCorrect[i].setAttribute("style", "display : block");
		}

		nextQuestion = true;
	}

	else{
		let i = elemWrong.length;
		while(i--){
			elemWrong[i].setAttribute("style", "display : block");
		}

		nextQuestion = false;
	}
}


/*------------------------------------------------*/


//On submit
function atbs(){
	let i = elemDibba.length;
	while(i--){
		elemDibba[i].setAttribute("style", "display : none");
	}

	let inputValue = input.value;
	checkAnswer(inputValue);

	if(nextQuestion){}
	
}




/*------------------------------------------------*/
