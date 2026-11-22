let letterkeys = {
    key: [
        "key2",
        "key3",
        "key4",
        "key5",
        "key6",
        "key7",
        "key8",
        "key9"
    ],

    letter: [
        ["A","B","C"],
        ["D","E","F"],
        ["G","H","I"],
        ["J","K","L"],
        ["M","N","O"],
        ["P","Q","R","S"],
        ["T","U","V"],
        ["W","X","Y","Z"],       
    ],

    //elements tied to passwords
    validcode: [
        "TEST"
    ],

    requiredpoints: [
        0
    ],

    flags: [
        false
    ]
};

//takes a variable and compares them with various elements in a single array to find a match
function arrayCheck(key,array){
    let length = array.length;
    let count = 0;
    while (count != length){
        console.log(array[count]);
        console.log(key);
        if (array[count] == key){
            console.log(count);
            return count;
        };
        count ++;
    };
    return -1;
};

let keyselect = -1
let space = ["_","_","_","_"];
let currentspace = 0;
let keycount = 0;
let keyid ="";
let points = 0;

$(".screen").html("<p>#" + "-" + space[1] + "-" + space[2] + "-" + space[3] + "</p>");

//Controls functionality of the letter keys
$(".key").click(function(){
    //If the key being clicked on has not been clicked immediately before, it gets the id of the key that was just clicked, and checks to see if it has letters tied to it.
    if (keyselect == -1 || keyid != this.id) {
        //Gets the id of the key and resets the active letter to the first  
        keyid = this.id;
        keycount = 0;
        //Changes the active key and inputs its first letter into the active space slot
        keyselect = arrayCheck(this.id,letterkeys.key);
        space[currentspace] = letterkeys.letter[keyselect][keycount];
    }
    //If the key being clicked has been clicked immediately before, it cycles through the active letter
    else {
        //If the key is not on its final active letter, increment the active letter upwards by 1
        if (keycount < letterkeys.letter[keyselect].length - 1) {
            keycount ++;
            console.log(keycount);
        }
        //If not, reset to the first letter
        else{
            keycount = 0;
        }
        //Record the new letter into the active space slot
        space[currentspace] = letterkeys.letter[keyselect][keycount];
    }
    //Update screen
    $(".screen").html("<p>" + space[0] + "-" + space[1] + "-" + space[2] + "-" + space[3] + "</p>");
});

//moves the active space from left to right
$(".nav-right").click(function(){
    let spacemem = "";
    //If not in the last space, increment the active space up by one
    if (currentspace < 3) {
        //Increment the active space upwards
        currentspace ++;
        //Take note of what is in the current space
        spacemem = space[currentspace];
        //Show a visual indicator by replacing what is currently in the space and updating the screen
        space[currentspace] = "#";
        keycount = 0;
        $(".screen").html("<p>" + space[0] + "-" + space[1] + "-" + space[2] + "-" + space[3] + "</p>");
        //Reinstate the space's previous inhabitant
        space[currentspace] = spacemem;
    }
    //Cycle back to the beginning otherwise
    else{
        currentspace = 0;
        spacemem = space[currentspace];
        space[currentspace] = "#";
        keycount = 0;
        $(".screen").html("<p>" + space[0] + "-" + space[1] + "-" + space[2] + "-" + space[3] + "</p>");
        space[currentspace] = spacemem;
    }
})
//Same as above but in opposite direction
$(".nav-left").click(function(){
    let spacemem = "";
    if (currentspace > 0) {
        currentspace --;
        spacemem = space[currentspace];
        space[currentspace] = "#";
        keycount = 0;
        $(".screen").html("<p>" + space[0] + "-" + space[1] + "-" + space[2] + "-" + space[3] + "</p>");
        space[currentspace] = spacemem;
    }
    else{
        currentspace = 3;
        spacemem = space[currentspace];
        space[currentspace] = "#";
        keycount = 0;
        $(".screen").html("<p>" + space[0] + "-" + space[1] + "-" + space[2] + "-" + space[3] + "</p>");
        space[currentspace] = spacemem;
    }
})

//Reset user inputs
$(".phone-icon:nth-of-type(2)").click(function(){
    currentspace = 0;
    space = ["_","_","_","_"];
    keycount = 0;
    keyselect = -1
    $(".screen").html("<p>#" + "-" + space[1] + "-" + space[2] + "-" + space[3] + "</p>");
})

//Submits user input
$(".phone-icon:nth-of-type(1)").click(function(){
    //Flattens the code into a single string and checks if it matches any valid codes
    let code = space[0] + space[1] + space[2] + space[3];
    let codeindex = arrayCheck(code,letterkeys.validcode)
    //If it matches and the user has enough points, display a message saying the code is valid and set its corresponding flag to true
    if (codeindex != -1 && points == letterkeys.requiredpoints[codeindex]){
        $(".screen").html("<p>CODE VALID</p>");
        letterkeys.flags[codeindex] = true;
    }
    //If not, display a message saying the code is invalid
    else {
        $(".screen").html("<p>CODE INVALID</p>");
    }
    //Reset inputs
    currentspace = 0;
    space = ["_","_","_","_"];
    keycount = 0;
    keyselect = -1
})