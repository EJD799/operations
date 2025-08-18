function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function eraseCookie(name) {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let params = new URLSearchParams(document.location.search);

function setURLParam(key, value) {
    params.set(key, value);
    const newSearchString = params.toString();
    history.replaceState(null, '', `?${newSearchString}${window.location.hash}`); 
    location.reload();
}

var settingsMenu = document.getElementById("settingsMenu");
var shareMenu = document.getElementById("shareMenu");
var shareTitle = document.getElementById("shareTitle");
var shareText = document.getElementById("shareText");
var typingElement = document.getElementById("typingElement");
var typeHereText = document.getElementById("typeHereText");
var goalText = document.getElementById("goalText");

var eqBox1 = document.getElementById("eqBox1");
var eqBox2 = document.getElementById("eqBox2");
var eqBox3 = document.getElementById("eqBox3");
var eqBox4 = document.getElementById("eqBox4");
var eqBox5 = document.getElementById("eqBox5");
var eqBox6 = document.getElementById("eqBox6");
var eqBox7 = document.getElementById("eqBox7");
var eqBox8 = document.getElementById("eqBox8");
var eqBox9 = document.getElementById("eqBox9");

var c1Btn = document.getElementById("c1");
var c2Btn = document.getElementById("c2");
var c3Btn = document.getElementById("c3");
var c4Btn = document.getElementById("c4");
var c5Btn = document.getElementById("c5");
var c6Btn = document.getElementById("c6");
var c7Btn = document.getElementById("c7");
var c8Btn = document.getElementById("c8");
var c9Btn = document.getElementById("c9");

var customNumbers = ["", "", "", "", "", "", "", "", ""];
var equations = 0;
var equationsList = ["", "", "", "", "", "", "", "", ""];
var typedEquation = "";
var typedEquationList = [];
var goal = 0;
var inputSection = 1;
var gameDone = false;

var equationsChart;

if (getCookie("operationsInit") != "true") {
    setCookie("operationsInit", "true", 399);
    setCookie("1games", 0, 399);
    setCookie("2games", 0, 399);
    setCookie("3games", 0, 399);
    setCookie("4games", 0, 399);
    setCookie("5games", 0, 399);
    setCookie("6games", 0, 399);
    setCookie("7games", 0, 399);
    setCookie("8games", 0, 399);
    setCookie("9games", 0, 399);
    setCookie("lastPuzzleDate", "0", 399);
    setCookie("lastPuzzleGuesses", "0", 399);
}

var gamesGraph = [Number(getCookie("1games")),Number(getCookie("2games")),Number(getCookie("3games")),Number(getCookie("4games")),Number(getCookie("5games")),Number(getCookie("6games")),Number(getCookie("7games")),Number(getCookie("8games")),Number(getCookie("9games"))];

function generateShareText(isReload) {
    if (isReload) {
        return "Solved in " + getCookie("lastPuzzleGuesses") + " equation(s)!\n" + ("&#11035;").repeat(getCookie("lastPuzzleGuesses")-1) + "&#129001;";
    } else {
        return "Solved in " + equations + " equation(s)!\n" + ("&#11035;").repeat(equations-1) + "&#129001;";
    }
}

if (params.get("mode") == "daily") {
    goal = generateDailyRandomNumber(10, 999);
    modeSelector.value = "Daily";
    if (getCookie("lastPuzzleDate") == new Date().toISOString().substring(0, 10).replaceAll("-","")) {
        gameDone = true;
        typeHereText.hidden = false;
        typeHereText.innerHTML = "Solved in " + getCookie("lastPuzzleGuesses");
        typeHereText.setAttribute("class", "title is-2 green-text");
        shareTitle.innerHTML = "You Won!";
        shareText.innerHTML = generateShareText(true);
        setTimeout(showShare, 1000);
    }
} else {
    goal = getRandomInt(10, 999);
    modeSelector.value = "Unlimited";
}

goalText.innerHTML = "Goal: " + goal;

function showSettings() {
    settingsMenu.setAttribute("class", "modal is-active");
}
function hideSettings() {
    settingsMenu.setAttribute("class", "modal");
    if (params.get("mode") == "daily") {
        if (modeSelector.value == "Unlimited") {
            setURLParam("mode", "unlimited");
        }
    } else {
        if (modeSelector.value == "Daily") {
            setURLParam("mode", "daily");
        }
    }
}
function showShare() {
    shareMenu.setAttribute("class", "modal is-active");
}
function hideShare() {
    shareMenu.setAttribute("class", "modal");
}
function showHelp() {
    helpMenu.setAttribute("class", "modal is-active");
}
function hideHelp() {
    helpMenu.setAttribute("class", "modal");
}
function shareGame() {
    if (params.get("mode") == "daily") {
        navigator.share({
            text: "Operations Game #" + (getDaysSince("2025-08-12") + 1) + " (Beta)\nhttps://ejd799.github.io/operations/\n\n" + shareText.innerHTML
        });
    } else {
        navigator.share({
            text: "Operations Game (Beta) (Unlimited Mode)\n\n" + shareText.innerHTML
        });
    }
}

function handleButton(btn) {
    if (gameDone == false || btn == "help" || btn == "restart") {
        if (btn == "back") {
            if (typedEquation != "") {
                typedEquation = typedEquation.slice(0, -1);
                inputSection += -1;
            } else {
                equations += -1;
                equationsList[equations] = "";
                customNumbers[equations] = "";
                inputSection = 1;
            }
        } else if (btn == "done") {
            if (inputSection == 4) {
                customNumbers[equations] = eval(typedEquation.replaceAll("×","*").replaceAll("÷","/"));
                equationsList[equations] = typedEquation + "=" + eval(typedEquation.replaceAll("×","*").replaceAll("÷","/"));
                typedEquation = "";
                typedEquationList = [];
                inputSection = 1;
                equations += 1;
                if (customNumbers.includes(goal)) {
                    typeHereText.hidden = false;
                    typeHereText.innerHTML = "Solved in " + equations;
                    typeHereText.setAttribute("class", "title is-2 green-text");
                    document.getElementById("c" + equations).setAttribute("class", "button keypadBtn is-success");
                    document.getElementById("eqBox" + equations).setAttribute("class", "box equationBox green-bg");
                    gameDone = true;
                    if (params.get("mode") == "daily") {
                        setCookie("lastPuzzleGuesses", equations, 399);
                        setCookie("lastPuzzleDate", new Date().toISOString().substring(0, 10).replaceAll("-",""), 399);
                    }
                    setCookie(equations + "games", (Number(getCookie(equations + "games")) + 1), 399);
                    gamesGraph[equations-1] = getCookie(equations + "games");
                    equationsChart.destroy();
                    createGraph();
                    shareTitle.innerHTML = "You Won!";
                    shareText.innerHTML = generateShareText();
                    //shareIcon.setAttribute("src", "stats_icon.svg");
                    setTimeout(showShare, 1000);
                }
            }
        } else if (btn == "restart") {
            location.reload();
        } else if (btn == "+" || btn == "-" || btn == "×" || btn == "÷") {
            if (inputSection == 2) {
                typedEquation += btn;
                typedEquationList.push("btn");
                inputSection = 3;
            }
        } else if (btn == "help") {
            showHelp();
        } else if (btn.startsWith("c")) {
            if (inputSection == 1 || inputSection == 3) {
                typedEquation += customNumbers[btn.replace("c", "")-1];
                typedEquationList.push(customNumbers[btn.replace("c", "")-1]);
                inputSection += 1;
            }
        } else {
            if (inputSection == 1 || inputSection == 3) {
                typedEquation += btn.replace("n", "");
                typedEquationList.push(btn.replace("n", ""));
                inputSection += 1;
            }
        }

        typingElement.innerHTML = typedEquation;
        if (typingElement.innerHTML != "") {
            typeHereText.hidden = true;
            typeHereText.innerHTML = "Type here";
            typeHereText.setAttribute("class", "title is-2 gray-text");
        } else {
            typeHereText.hidden = false;
        }
        updateText();
    }
}

function updateText() {
    eqBox1.innerHTML = equationsList[0];
    eqBox2.innerHTML = equationsList[1];
    eqBox3.innerHTML = equationsList[2];
    eqBox4.innerHTML = equationsList[3];
    eqBox5.innerHTML = equationsList[4];
    eqBox6.innerHTML = equationsList[5];
    eqBox7.innerHTML = equationsList[6];
    eqBox8.innerHTML = equationsList[7];
    eqBox9.innerHTML = equationsList[8];
    c1Btn.innerHTML = customNumbers[0];
    c2Btn.innerHTML = customNumbers[1];
    c3Btn.innerHTML = customNumbers[2];
    c4Btn.innerHTML = customNumbers[3];
    c5Btn.innerHTML = customNumbers[4];
    c6Btn.innerHTML = customNumbers[5];
    c7Btn.innerHTML = customNumbers[6];
    c8Btn.innerHTML = customNumbers[7];
    c9Btn.innerHTML = customNumbers[8];
}

  const ctx = document.getElementById('myChart');

function createGraph() {
    equationsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
            datasets: [{
                label: '# of Puzzles',
                data: gamesGraph,
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            scales: {
            }
        }
    });
}
createGraph();

window.addEventListener('keydown', function(event) {
    console.log(event.key);
});

/*if ("serviceWorker" in navigator) {
  // register service worker
  navigator.serviceWorker.register("serviceWorker.js");
}*/
