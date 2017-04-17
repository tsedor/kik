"use strict";

var l1 = 0;
var l2 = 0;
var l3 = 0;
var l4 = 0;
var x1 = 0;
var x2 = 0;
var r = 0.01;
var baseX = 17;
var baseY = 10;
var direction = true;
var clickListener = false;
var animation = true;
var difLevel = false;
var selectedSide = false;
var game = false;
var gameFields = [0, 0, 0, 0, 0, 0, 0, 0, 0];
var winCondition = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
var round = 1;
var computerTurn = false;

var mousePosition = [0, 0];

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

function mousePos(e) {
    var x = e.clientX - canvas.offsetLeft;
    var y = e.clientY - canvas.offsetTop;
    mousePosition = [x, y];
}

////////////////////////////////////////////////////Dokończ
function saveMove(x, y, type) {
    gameFields[x + (y * 3)] = type;
    console.log(gameFields);
}

function clearCanvas() {
    ctx.clearRect(0, 0, 230, 230);
}

function refresh() {
    window.location.reload();
}

function drawWinLine(i) {
    x1 += 4;
    //translate, rotate, x, y, w, h
    var line = [[false, false, 0, 31, 230, 8], [false, false, 0, 111, 230, 8], [false, false, 0, 191, 230, 8], [false, false, 31, 0, 8, 230], [false, false, 111, 0, 8, 230], [false, false, 191, 0, 8, 230], [false, -45, -4, 0, 8, 325], [true, 45, -4, 0, 8, 325]];
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.beginPath();
    ctx.fillStyle = "#F00";
    var max = 0;
    if (line[i][0] === true) {
        ctx.translate(230, 0);
    }
    if (line[i][1] !== false) {
        ctx.rotate(line[i][1] * Math.PI / 180);
    }
    if (line[i][4] > line[i][5]) {
        max = line[i][4];
        ctx.fillRect(line[i][2], line[i][3], x1, line[i][5]);
    } else {
        max = line[i][5];
        ctx.fillRect(line[i][2], line[i][3], line[i][4], x1);
    }
    ctx.closePath();
    console.log(x1);
    if  (x1 < max) {
        requestAnimationFrame(function () {
            drawWinLine(i);
        });
    } else {
        x1 = 0;
        window.setTimeout(refresh, 5000);
    }

}

function checkWin() {
    for (var i = 0; i < winCondition.length; i += 1) {
        if (gameFields[winCondition[i][0]] === "x" && gameFields[winCondition[i][1]] === "x" && gameFields[winCondition[i][2]] === "x") {
            console.log("x is winner");
            game = false;
            drawWinLine(i);
        } else if (gameFields[winCondition[i][0]] === "o" && gameFields[winCondition[i][1]] === "o" && gameFields[winCondition[i][2]] === "o") {
            console.log("o is winner");
            game = false;
            drawWinLine(i);
        }
    }
}

function drawX(x, y) {
    ctx.beginPath();
    ctx.clearRect((x * 80), (y * 80), 70, 70);
    ctx.translate(baseX + (x * 80), baseY + (y * 80));
    ctx.fillStyle = "#444";
    ctx.rotate(45 * Math.PI / 180);
    ctx.fillRect(0, 0, x1, 10);
    ctx.rotate(-90 * Math.PI / 180);
    ctx.fillRect(-35, 25, x2, 10);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.closePath();
    if (x1 < 60) {
        x1 += 3;
    } else if (x1 >= 60 || x2 < 60) {
        x2 += 3;
    }
    if (x1 <= 60 && x2 <= 60) {
        requestAnimationFrame(function () {
            drawX(x, y);
        });
    } else {
        checkWin();
        x1 = 0;
        x2 = 0;
        if (game === true && computerTurn === true) {
            computerPlay();
        }
    }
}

function drawO(x, y) {
    ctx.beginPath();
    ctx.lineWidth = 10;
    ctx.strokeStyle = "#444";
    ctx.clearRect((x * 80), (y * 80), 70, 70);
    ctx.arc(baseX + (x * 80) + 18, baseY + (y * 80) + 25, 21, 0, Math.PI * r);
    ctx.stroke();
    ctx.closePath();
    if (r < 2) {
        r += 0.045;
        requestAnimationFrame(function () {
            drawO(x, y);
        });
    } else {
        checkWin();
        r = 0.01;
        if (game === true && computerTurn === true) {
            computerPlay();
        }
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function play() {
    var x = Math.floor(mousePosition[0] / 80);
    var y = Math.floor(mousePosition[1] / 80);
    computerTurn = true;
    if (selectedSide === "o") {
        canvas.removeEventListener("click", play);
        saveMove(x, y, "o");
        drawO(x, y);
    } else {
        canvas.removeEventListener("click", play);
        saveMove(x, y, "x");
        drawX(x, y);
    }
    round += 1;
}

function computerEasyMove() {
    if (round < 9) {
        do {
            var rand = getRandomInt(0, 8);
        } while (gameFields[rand] !== 0);
    } else {
        return false;
    }

    return rand;
}

function checkFieldSet(side) {
    var z = 0;
    var id = false;
    var compSide = side === "o" ? "x" : "o";

    for (var x = 0; x < winCondition.length; x += 1) {
        for (var y = 0; y < winCondition[x].length; y += 1) {
            if (gameFields[winCondition[x][y]] === selectedSide) {
                z += 1;
            } else {
                id = winCondition[x][y];
            }
        }
        if (z === 2 && gameFields[id] !== side) {
            return id;
        }
        z = 0;
    }
    return false;
}

function computerMediumMove() {

    if (round === 2) {
        return computerEasyMove();
    } else {
        var compSide = selectedSide === "o" ? "x" : "o";
        var id = checkFieldSet(compSide);

        if (id === false) {
            return computerEasyMove();
        } else {
            return id;
        }
    }
}

function computerHardMove() {

    if (round === 2) {
        return computerEasyMove();
    } else {
        var compSide = selectedSide === "o" ? "x" : "o";
        var id = checkFieldSet(selectedSide);
        if (id !== false) {
            return id;
        }
        id = checkFieldSet(compSide);
        if (id === false) {
            return computerEasyMove();
        } else {
            return id;
        }
    }
}

function computerPlay() {
    if(round > 9)
        return false;
    computerTurn = false;
    switch (difLevel) {
        case "medium":
            var move = computerMediumMove();
        break;
        case "hard":
            var move = computerHardMove();
        break;
        default:
            var move = computerEasyMove();
        break;
    }
    
    var x = move % 3;
    var y = Math.floor(move / 3);
    if (selectedSide === "o") {
        saveMove(x, y, "x");
        drawX(x, y);
    } else {
        saveMove(x, y, "o");
        drawO(x, y);
    }
    round += 1;

    canvas.addEventListener("click", play);
}

function drawGameField() {
    clearCanvas();
    var step = 10;
    ctx.beginPath();
    ctx.fillStyle = "#444";
    ctx.fillRect(70, 0, 10, l1);
    ctx.fillRect(150, 0, 10, l2);
    ctx.fillRect(0, 70, l3, 10);
    ctx.fillRect(0, 150, l4, 10);
    ctx.closePath();
    if (l1 < 230) {
        l1 += step;
    } else if (l2 < 230) {
        l2 += step;
    } else if (l3 < 230) {
        l3 += step;
    } else if (l4 <= 230) {
        l4 += step;
    }
    if (l1 <= 230 && l2 <= 230 && l3 <= 230 && l4 <= 230) {
        requestAnimationFrame(drawGameField);
    } else {
        if (clickListener === false) {
            clickListener = canvas.addEventListener("click", play);
        }
    }
}

function resetIndexes() {
    l1 = 0;
    l2 = 0;
    l3 = 0;
    l4 = 0;
}

function goToGameField(e) {
    mousePos(e);
    if (mousePosition[0] < 115) {
        selectedSide = "o";
    } else {
        selectedSide = "x";
    }
    resetIndexes();
    canvas.removeEventListener("click", goToGameField);
    clickListener = false;
    game = true;
    drawGameField();
}

function drawSelectSide() {
    clearCanvas();
    ctx.textAlign = "center";
    ctx.fillStyle = "#444";
    ctx.font = "28px Caveat Brush";
    ctx.fillText("Select side:", 115, 28);

    drawO(0, 1);
    drawX(2, 1);

    canvas.addEventListener("click", goToGameField);
}

function goToSelectSide(e) {
    mousePos(e);

    if (mousePosition[1] > 70 && mousePosition[1] <= 110) {
        difLevel = "easy";
    } else if (mousePosition[1] > 110 && mousePosition[1] <= 150) {
        difLevel = "medium";
    } else if (mousePosition[1] > 150 && mousePosition[1] <= 190) {
        difLevel = "hard";
    }

    if (difLevel !== false) {
        animation = false;
        requestAnimationFrame(function () {
            resetIndexes();
            canvas.removeEventListener("click", goToSelectSide);
            drawSelectSide();
        });
    }
}

function drawDifChoose(anim) {
    if (clickListener === false) {
        clickListener = canvas.addEventListener("click", goToSelectSide);
    }
    var d1 = 25;
    var d2 = 25;
    var d3 = 25;
    var step = 0.2;

    ctx.clearRect(0, 0, 230, 230);
    if (l1 === 0) {
        l1 = 24.0;
    }
    if (mousePosition[1] > 70 && mousePosition[1] <= 110) {
        anim = "easy";
    } else if (mousePosition[1] > 110 && mousePosition[1] <= 150) {
        anim = "medium";
    } else if (mousePosition[1] > 150 && mousePosition[1] <= 190) {
        anim = "hard";
    }

    if (anim === "easy") {
        d1 = l1;
    } else if (anim === "medium") {
        d2 = l1;
    } else if (anim === "hard") {
        d3 = l1;
    }
    ctx.textAlign = "center";
    ctx.fillStyle = "#444";
    ctx.font = "28px Caveat Brush";
    ctx.fillText("Choose difficulty:", 115, 28);
    ctx.font = d1 + "px Caveat Brush";
    ctx.fillText("easy", 115, 90);
    ctx.font = d2 + "px Caveat Brush";
    ctx.fillText("medium", 115, 130);
    ctx.font = d3 + "px Caveat Brush";
    ctx.fillText("hard", 115, 170);
    if (l1 < 30 && direction === true) {
        l1 += step;
    } else if (l1 >= 30 && direction === true) {
        direction = false;
    } else if (l1 > 22 && direction === false) {
        l1 -= step;
    } else if (l1 <= 22 && direction === false) {
        direction = true;
    }
    if (animation === true) {
        requestAnimationFrame(function () {
            drawDifChoose(anim);
        });
    }
}

function init() {
    canvas.addEventListener("mousemove", function (e) {
        mousePos(e);
    });
    var f = new FontFace("test", "url(https://fonts.gstatic.com/s/caveatbrush/v2/_d7bgsk3hfC4DXnUEeYKs-gdm0LZdjqr5-oayXSOefg.woff2)");
    f.load().then(function () {
        drawDifChoose("easy");
    });
}

init();
