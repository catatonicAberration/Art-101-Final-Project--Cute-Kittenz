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
    ]
};

function arrayCheck(key,array){
    let length = array.length;
    let count = 0;
    while (count != length){
        if (array[count] == key){
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
let keyid =""

$(".screen").html("<p>" + space[0] + "-" + space[1] + "-" + space[2] + "-" + space[3] + "</p>");

$(".key").click(function(){
    if (keyselect == -1 || keyid != this.id) {
        keyid = this.id;
        keycount = 0;
        keyselect = arrayCheck(this.id,letterkeys.key);
        if (keyselect == -1 && this.id == "key*" && currentspace < 3) {
            currentspace ++;
        }
    }
    else {
        if (keycount < letterkeys.letter[keyselect].length - 1) {
            keycount ++;
            console.log(keycount);
        }
        else{
            keycount = 0;
        }
        space[currentspace] = letterkeys.letter[keyselect][keycount];
    }
    $(".screen").html("<p>" + space[0] + "-" + space[1] + "-" + space[2] + "-" + space[3] + "</p>");
});