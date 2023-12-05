let change = 0;											// place to note if changes occured since launch

window.onbeforeunload = function(e) {					// confirm before closing
	if (change > 0)	return 'Are you sure you want to leave?';
};


function sortByMatches()	{	charArray = charArray.sort( function(a,b) { return a[2] - b[2] } );				}

function sortByScore()		{	charArray = charArray.sort( function(a,b) { return  b[3]/b[2] - a[3]/a[2] } );	}

function calcScore(i)		{	return (100* charArray[i][3] / charArray[i][2]).toFixed(precision);				}

function nuke() {
	let buttons = '<button onclick="showResult(0);" style="text-align: center;"> <b>Show Scores</b> </button> <button onclick="showResult(1);" style="text-align: center;"> <b>Force Match</b> </button> <button onclick="exportData(0);" style="text-align: center;"> <b>Save Data</b> </button>';
	document.getElementById("bottomField").innerHTML = buttons;
	document.getElementById("resultField").innerHTML = "<br>";
}


function choose(n, k) {									// calculate max possible different matchups 
    if (k === 0) return 1;								// (n over k) = n!/ ( k! (n-k)! )
    return (n * choose(n-1, k-1)) / k;
}


function toImg(ID, width) {		// convert index to picture

let pic = "";
for (n = 0; n < charArray.length; n++) {
	if (charArray[n][4] == ID) {		
		pic = '<img width="'+width+'px" src="'+charArray[n][1]+'">';
		break;
	}
}
return pic;
}



function clean(state) {									// remove chars from predefined list

if (state == 0) {										// intitialize remove function
	let clean = '<center><br>';

	if ( typeof remove == 'undefined')					// check if there are chars defined to remove
		clean += 'Found no characters to remove!<br> <p style="font-size: 16px">Please define the following code in your data.txt file:</p> <p style="font-family:Consolas; font-size: 16px">var remove = [ ... ];</p> <p style="font-size: 16px">Where for the dots, fill in the character IDs (the last number in each line of the charArray definition) of the characters to be removed, separated by commas.</p><br>';
		
	else {												// list chars to remove
		clean += 'Following character(s) will be removed:<br><br> <table class="resultTable"><tr> <td>Image</td> <td>Name</td> <td style ="text-align: center">ID</td> </tr>';
		
		for ( let r = 0; r < charArray.length; r++ ) {

			if ( remove.includes(charArray[r][4]) )
				clean += '<tr style= "padding-bottom: 1px"> <td>'+toImg(charArray[r][4], 35)+'</td> <td>'+charArray[r][0]+'</td> <td>'+charArray[r][4]+'</td> </tr>';
		}
	
	clean += '</table> <br> <button onclick="clean(1);" class="block"> <b>Confirm</b> </button><br>';
	}
	
	clean += '<button onclick="clean(-1);" class="block"> <b>Back</b></button><br></center>';
	document.getElementById("mainTable").innerHTML = clean;
}

if (state < 0) {										// abort character removal
	let clean = '<center><br><button onclick="launch();" class="block"> <b>Start!</b> </button><br> <button onclick="clean(0);" class="block"> <b>Clean...</b> </button></center>';
	document.getElementById("mainTable").innerHTML = clean;
}

if (state > 0) {										// confirm removal

	for ( let j = 0; j < remove.length; j++) {

		for ( let i = 0; i < matches.length; i++) { 
	
			if ( ( matches[i][0] == remove[j] ) || ( matches[i][1] == remove[j] ) ) {
				matches.splice(i, 1);					// remove match if removed char was involved
				i--;
			}
		}
	}

	for ( let c = 0; c < charArray.length; c++ ) {		// remove charsacters themselves

		if ( remove.includes(charArray[c][4]) ) {
			charArray.splice(c, 1);
			c--;
		}
	}
	
	let clean = '<center><br>Indicated characters were removed.<br><br> <button onclick="launch();" class="block"> <b>Start!</b> </button></center>';
	document.getElementById("mainTable").innerHTML = clean;
	document.getElementById("resultField").innerHTML = "<br>";
}
}



function validate() {

let val = 1;
if ( (typeof charArray === "undefined") || (charArray.length < 4) )	val = 0;
	
else {

	for ( let i = 0; i < charArray.length; i++ ) {
		if ( !(charArray[i].length == 2) && !(charArray[i].length == 5) )	val = 0;
	}
}

if ( val == 0 ) {													// display error message
	let	check = 'No valid data found! <p style="font-size: 16px">Please make sure the following code is defined in your data.txt file:</p> <p style="font-family:Consolas; font-size: 16px">var charArray = [<br> [ "character name", "image link" ],<br>...<br>[ "character name", "image link" ]<br>];</p> <p style="font-size: 16px">You need at least 4 lines of character definitions for the sorter to work. If you are using presorted data, you may have 3 numbers in any line after the character definition, separated by commas.</p><br>';

	document.getElementById("topField").innerHTML = "<br>";
	document.getElementById("mainTable").innerHTML = check;
	document.getElementById("bottomField").innerHTML = "<br>";
}

return val;
}



if (typeof numQuestion === 'undefined') { var numQuestion = 1; }	// generate match number
if (typeof matches === 'undefined') { var matches = []; }			// place to store match keys if not defined by data
var left, right;													// initialize places to store char IDs
var phase = 0;														// phase indicator
var threshold, range, maxMatch, precision, scramble;				// initialize global variables

function launch() {													// launch script

let n = 3;															// number to check if prime
let d = 0;															// divisor index
let primes  = [ 2 ]; 												// array of primes
let p = 0;															// index of prime to be added

while (primes.length < charArray.length) {							// generate primes to be used as character ID

	while ( d < primes.length ) {
	
		if (n % primes[d] == 0) {
			n++;
			d = 0;
		
		} else	d++;
	}

	primes.push(n);
}

for (let i = 0; i < charArray.length; i++ ) {						// remove primes that are taken

	if ( (charArray[i].length > 3) || ( primes.includes(charArray[i][4]) ) ) {
		
		var index = primes.indexOf(charArray[i][4]);
		primes.splice(index, 1);
	}
}

for (let i = 0; i < charArray.length; i++) {						// add data to array, blind method
	
	if (charArray[i].length < 3) {									// check if character already has data
		charArray[i].push(0, 0, primes[p]);
		p++;
	}
}

// now that array won't change anymore, update character dependant variables
threshold = 1 + Math.floor(0.3*(Math.log(charArray.length))**2);
range = Math.max( Math.ceil(0.1*charArray.length) , threshold );
maxMatch = choose(charArray.length , 2);
precision = Math.floor(Math.log10(0.3*charArray.length));
scramble = threshold;
if (phase < 3)	phase++;											// update phase indicator
genTable();
getElement();
}



function getElement() {												// pick 2 different random elements

if (repeats > 0) {													// force multiple matches for a character of interest
	forceMatch(repeatID, repeats);
	repeats--;

} else {
	
	sortByMatches();
	if (charArray[0][2] < threshold)	randomizer(threshold, range);

	else if ( (phase < 4) && (matches.length < maxMatch) ) {		// phase 2: find a character with score violation

		if (scramble > 0) {											// scramble randomizer every so often
			scramble--;
			sortByScore();
			if ( phase < 2)	phase = 2;								// update phase indicator

			for (m = 1; m < charArray.length; m++ ) {

				if (calcScore(m) == calcScore(m-1) ) {				// search for score violation
					left = charArray[m][4];
					break;
																	// random character if no score violation was found
				} else	left = charArray[Math.floor(Math.random()*charArray.length)][4];
			}
			forceMatch(left, 0);									// generate match with character of interest
			
		} else {
			randomizer(0, range);									// use the char with fewest matches yet
			scramble = threshold;									// set scramble back up
		}

	} else if ( matches.length == maxMatch ) {						// fail-save: check if a valid match is left
		matches = [];												// nuke match IDs
		phase = 4;													// update phase counter
		randomizer(charArray.length, charArray.length);

	} else	randomizer(0, charArray.length);						// phase 4: any random match
}

showImage();														// after a match was found, update table
}



function randomizer(span1, span2) {

sortByMatches();													// guarantees left char will have a valid match
left = charArray[Math.floor(Math.random()*span1)][4];				// store char IDs
right = charArray[Math.floor(Math.random()*span2)][4];
let tempKey = left*right;											// store matchID for now

while ( left == right || checkKey(tempKey) ) {						// check if chars are different and match is new
	right = charArray[Math.floor(Math.random()*charArray.length)][4];
	tempKey = left*right;
}
}


function checkKey(key) {		// if key is already recorded, return 1 (true)

let check = 0;
for ( i = 0; i < matches.length; i++ ) {

	if (key == matches[i][0] * matches[i][1]) {
		check = 1;
		break;
	}
}
return check;
}



var repeatID, repeats;											// initialize varibles used in forcedMatch

function forceMatch(charID, times) {

sortByScore();
repeats = times;
repeatID = charID;
let min = 0;
let max = charArray.length -1;

left = charID;
let pos = toIndex(left);
if ( (pos - range) > 0 )		min = pos - range;				// lower limit for neighbouring characters
if ( (pos + range) < max )		max = pos + range;				// upper limit for neighbouring characters

right = charArray[Math.floor(Math.random()*(max-min))+min][4];	// choose character withing "range" to "pos"
let tempKey = left*right;
let checkpoint = 0;

while ( (left == right) || checkKey(tempKey) ) {				// make sure we get 2 different chars with new matchID
	right = charArray[Math.floor(Math.random()*charArray.length)][4];
	tempKey = left*right;
	checkpoint++;
	
	if (checkpoint > range)	{									// fail-save: break loop before randomizer gets stuck
		left = charArray[Math.floor(Math.random()*charArray.length)][4];
		right = charArray[Math.floor(Math.random()*charArray.length)][4];
		tempKey = left*right;
	}
}

genTable()
showImage();
}



function genTable() {
	let table = "<table id='mainTable' align='center'><tr> <td id='leftField' onclick=' matchUp(-1);' rowspan='2' style='text-align:center;'></td> <td class='middleField' onclick=' matchUp(0);' style='text-align:center;'>Can't Decide</td> <td id='rightField' onclick='matchUp(1);' rowspan='2' style='text-align:center;'></td> </tr> <tr> <td class='middleField' onclick='matchUp();' style='text-align:center;'>Skip for now</td> </tr></table>";
	let buttons = '<button onclick="showResult(0);" style="text-align: center;"> <b>Show Scores</b> </button> <button onclick="showResult(1);" style="text-align: center;"> <b>Force Match</b> </button> <button onclick="exportData(0);" style="text-align: center;"> <b>Save Data</b> </button>';
	document.getElementById("mainTable").innerHTML = table;				// initialize mainTable
	document.getElementById("bottomField").innerHTML = buttons;			// add forceMatch button
}



function toName(ID) {			// convert index to picture

let name = "";
for (n = 0; n < charArray.length; n++) {
	if (charArray[n][4] == ID) {		
		name = charArray[n][0];
		break;
	}
}
return name;
}



function toIndex(ID) {			// translate character IDs back into indices

let ind = 0;
for (var n = 0; n < charArray.length; n++) {

	if (charArray[n][4] == ID) {
		ind = n;
		break;
	}
}
return ind;
}



function matchUp(flag) {									// sorter
let char1 = toIndex(left);
let char2 = toIndex(right);
	
if (typeof flag === 'undefined') {							// skip this match

	let skipkey = left*right;
	let count = 0;
	while (skipkey == left*right) {							// don't show the same match again if skipped
		getElement();
		count++;
		if (count > threshold)	break;						// fail-save: you can't skip last match
	}
	
} else {
	
	charArray[char1][2]++;									// increase match counter for involved chars
	charArray[char2][2]++;
	if (flag < 0)	charArray[char1][3]++;					// left wins
	if (flag > 0)	charArray[char2][3]++;					// right wins
	if (flag == 0) {										// draw
		charArray[char1][3] += 0.5;
		charArray[char2][3] += 0.5;
	}

	matches.push([ left, right, flag ]);					// generate match key to prevent double matchups
	matches = matches.sort( function(a,b) {	return  a[0]*a[1] - b[0]*b[1]; } );
	numQuestion++;
	change++;
	finish++;
	getElement();
}
}



var finish = 0;

function showImage() {										// indicate two elements to compare

let str1 = toName(left)+"<br />"+toImg(left, 225);
let str2 = toName(right)+"<br />"+toImg(right, 225);
document.getElementById("leftField").innerHTML = str1;
document.getElementById("rightField").innerHTML = str2;

let progress = (100*(showResult()-1)/(charArray.length-1)).toFixed(precision);
if ( (progress == 100) && (finish > threshold) )	{		// interupt sorting, show "you're done" screen
	phase = 3;
	finish = 0;
	document.getElementById("mainTable").innerHTML = '<br><center> <button onclick="launch();" class="block"> <b>Continue</b> </button> <center>';
	showResult(0);
} else nuke();

let header = '<font face="calibri, serif" size="5"><b>Battle #'+numQuestion+'<br></b></font> <font face="calibri, serif" size="4">';

if (repeats > 0)	header += "Forcing matchup for <b>"+charArray[toIndex(repeatID)][0]+"</b> "+repeats+" more time(s)...";
else {
	header += "<b>Phase "+phase+":  </b>";
	if		(phase == 1)	header += "find characters with few matches... "+progress+" % sorted";
	else if	(phase == 2)	header += "fine-tuning score... "+progress+" % sorted";
	else if	(phase == 3)	header += "You can stop now, or further refine your score... "+progress+" % sorted";
	else					header += "all possible matches exhausted! Why are you still going?";
}

header += "<br><br></font>";
document.getElementById("topField").innerHTML = header;
}



function showResult(flag) {											// generate score table
let score = 0;
let rank = 1;
let results = '<br>characters in this sorter: <b>'+charArray.length+'</b><br>maximum possible matchups: <b>'+maxMatch+'</b> <br><br> <table class="resultTable"> <tr> <td> Rank </td> <td>Name</td> <td>Score</td>';
if ( flag == 1 )	results += '<td>Matches</td> <td>Option</td>';	// enable force match buttons
results += "</tr>";
sortByScore();

for (let i = 0; i < charArray.length; i++) {
	score = calcScore(i);

	if ( (i > 0) && ( score !== calcScore(i-1) ) )	rank++;
	results += '<tr> <td>'+rank+'</td> <td>'+charArray[i][0]+'</td> <td>'+score+' %</td>';

	if ( flag == 1 )	results += '<td>'+charArray[i][2]+'</td> <td style="padding-left:1px; padding-right:1px;"> <button onclick="forceMatch('+charArray[i][4]+', threshold);" class="smallBlock"> <b>Match!</b> </button> </td>';
	results += "</tr>";
}

results += "</table>";

let buttons = "";
if ( flag == 0 )	buttons = '<button onclick="showResult(1);"style="text-align: center;"> <b>Force Match</b> </button> ';
else				buttons = '<button onclick="showResult(0);"style="text-align: center;"> <b>Show Scores</b> </button> ';
buttons += '<button onclick="exportData(0);" style="text-align: center;"> <b>Save Data</b> </button>'
results = '<button onclick="nuke();" style="text-align: center;"> <b>Hide</b> </button> <button onclick="exportData(1);" style="text-align: center;"> <b>Debug Mode</b> </button> <br>'+results;
document.getElementById("bottomField").innerHTML = buttons;
document.getElementById("resultField").innerHTML = results;
return rank;
}



function exportData(flag) {

if (flag == 0) {											// export data
	sortByScore();
	var str = 'var numQuestion = '+numQuestion+';\n\nvar charArray = [ \n';
	var linebreak = "\n";
}

else {														// debug mode
	sortByMatches();
	var str = '<button onclick="nuke();" style="text-align: center;"> <b>Hide</b> </button><br> <br>characters in this sorter: <b>'+charArray.length+'</b> <br>maximum possible matchups: <b>'+maxMatch+'</b> <br>phase indicator: <b>'+phase+'</b> <br>phase 1 threshold: <b>'+threshold+'</b> <br>phase 2 match range: <b>'+range+'</b> <br>score decimal precision: <b>'+precision+'</b> <br>scramble in: <b>'+scramble+'</b> matches<br> ID of left character displayed: <b>'+left+'</b> <br>ID of right character displayed: <b>'+right+'</b> <br>last repeated character ID: <b>'+repeatID+'</b><br> repeats match for current character: <b>'+repeats+'</b> times<br> matches decided since last save: <b>'+change+'</b><br> matches decided since last continue: <b>'+finish+'</b><br> <br><font face="Consolas">var numQuestion = '+numQuestion+'<br><br>var charArray = [<br>';
	var linebreak = "<br>";
}

for (let i = 0; i < charArray.length; i++) {
	str += '[ ';
	for (let j = 0; j < charArray[i].length-1; j++) {
		if ( isNaN(charArray[i][j]) )	str += '"'+charArray[i][j]+'", ';
		else							str += charArray[i][j]+", ";
	}
	
	if (i < charArray.length -1)		str += charArray[i][4]+" ],"+linebreak;
	else								str += charArray[i][4]+" ]"+linebreak;
}

str += '];'+linebreak+linebreak+'var matches = ['+linebreak;
for (let i = 0; i < matches.length; i++) {
	str += '[ ';
	for (let j = 0; j < matches[i].length-1; j++) {
		str += matches[i][j]+", ";
	}
	
	if (i < matches.length -1)			str += matches[i][2]+" ],"+linebreak;
	else								str += matches[i][2]+" ]"+linebreak;
}
str += '];'

if (flag == 0) {											// create file and initialize save promt
	let blobData = new Blob([str], {type: "text/plain"});
	let a = document.createElement("a");

	a.href = window.URL.createObjectURL(blobData);
	a.download = 'data.txt';
	a.click();
	str = '<br>';
	change = 0;

} else	str += '</font>';

nuke();
document.getElementById("resultField").innerHTML = str;
}