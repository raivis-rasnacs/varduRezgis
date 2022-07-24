const alphabet = [
    "A", "Ā", "B", "C", "Č", "D", 
    "E", "Ē", "F", "G", "Ģ", "H", 
    "I", "Ī", "J", "K", "Ķ", "L", 
    "Ļ", "M", "N", "Ņ", "O", "P", 
    "R", "S", "Š", "T", "U", "Ū", 
    "V", "Z", "Ž"
];

const words = [
    "ZEĶE", "LĀDE", "VILCIENS", "SPOGULIS", 
    "KRŪZE", "JUCEKLIS", "CIPARNĪCA", "GLIEMEŽVĀKS", 
    "KLEITA", "TĒJKANNA", "MELODIJA", "HARMONIJA",
    "ORĶESTRIS", "KONCERTZĀLE", "PROMBŪTNE", "BRAVŪRA", 
    "CILVĒCĪBA", "KLEJOTĀJS", "DRAUDZĪBA"
]

function getTheLengthOfTheLongestWord() {
    const allLengths = [];
    for (word of words) {
        allLengths.push(word.length);
    }
    const theLongest = Math.max(...allLengths);
    return theLongest;
}

getGridSize = (theLengthOfTheLongestWord, totalWords) => Math.max(...[theLengthOfTheLongestWord, totalWords]);

function newGrid() {
    const gridSize = getGridSize(getTheLengthOfTheLongestWord(), words.length);
    console.log(gridSize);

    var grid = [];
    for (i = 0; i < gridSize; i++) {
        grid.push([]);
        for (j = 0; j < gridSize; j++) {
            grid[i].push("");
        }
    }
    fillUpGrid(grid, gridSize);
}

function fillUpGrid(grid, gridSize) {
    var fillableRows = getFillableRows(gridSize); 
    console.log(fillableRows);
    
    var usedWords = [];
    for (let i = 0; i < words.length; i++) {
        if (randInt(0, 1) == 0) { var direction = "normal"; } else { var direction = "reverse"; }
        if (direction == "normal") { var startPosition = randInt(0, gridSize - words[i].length); } else { var startPosition = randInt(0 + words[i].length - 1, gridSize - 1); }
        for (letter of words[i]) {
            grid[fillableRows[i]][startPosition] = letter;
            if (direction == "normal") { startPosition++; } else { startPosition--; }
        }
    }
    fillBlankSpaces(grid);
}

function fillBlankSpaces(grid) {
    for (row in grid) {
        for (element in grid[row]) {
            if (grid[row][element] == "") {
                grid[row][element] = alphabet[randInt(0, alphabet.length - 1)].toLowerCase();
            }
        }
    }
    makeTable(grid);
}

function makeTable(grid) {
    const table = document.getElementById("grid");

    for (row in grid) {
        var tableRow = document.createElement("tr");
        for (element in grid[row]) {
            var tableCell = document.createElement("td");
            tableCell.textContent = grid[row][element].toUpperCase();
            if (grid[row][element] == grid[row][element].toUpperCase()) {
                tableCell.classList.add("*letter*");
            }
            else {
                tableCell.classList.add("letter");
            }
            tableCell.addEventListener("mousedown", mouseDownOnLetter);
            
            
        tableRow.append(tableCell);
        }
        table.append(tableRow);
    }
}

function getFillableRows(gridSize) {
    var fillableRows = [];
    if (words.length < gridSize) {
        while (fillableRows.length < words.length) {
            let row = randInt(0, gridSize);
            if (!fillableRows.includes(row)) {
                fillableRows.push(row);
            }
        }
    }
    else {
        while (fillableRows.length <= gridSize - 1) {
            let row = randInt(0, gridSize - 1);
            if (!fillableRows.includes(row)) {
                fillableRows.push(row);
            }
        }
    }
    return fillableRows;
}

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

newGrid();

function mouseDownOnLetter() {
    this.style.backgroundColor = "lightgreen";
    const row = this.parentElement;
    for (element of row.children) {
        element.addEventListener("mouseenter", mouseMovedOnLetter);
        element.addEventListener("mouseup", mouseUpOnLetter);
        element.parentElement.addEventListener("mouseleave", mouseOutOfRow);
    }
}

function mouseUpOnLetter() {
    const row = this.parentElement;
    for (element of row.children) {
        element.removeEventListener("mouseenter", mouseMovedOnLetter);
        element.addEventListener("mouseup", mouseUpOnLetter);
    }
}

function mouseMovedOnLetter() {
    this.style.backgroundColor = "lightgreen";
}

function mouseOutOfRow() {
    for (element of this.children) {
        element.removeEventListener("mouseenter", mouseMovedOnLetter);
    }
}