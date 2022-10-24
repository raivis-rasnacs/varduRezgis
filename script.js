// *** LAYOUT THINGS ***
function prepareLayout(words) {
    const saraksts = document.getElementById("listOfWords");

    // Clears list
    while (saraksts.children.length > 0) {
        saraksts.children[0].remove();
    }

    // Adds words to list
    for (word of words) {
        var wordInList = document.createElement("li");
        wordInList.textContent = word;
        saraksts.append(wordInList);
    }
}

// Aligns table to look better
function resizeTable() {
    var table = document.getElementById("grid");
    for (row of table.rows) {
        for (cell of row.cells) {
            cell.style.width = "50px";
            cell.style.height = "50px";
        }
    }
}

// *** GAME LOGIC ***
function getTheLengthOfTheLongestWord(words) {
    const allLengths = [];
    for (word of words) {
        allLengths.push(word.length);
    }
    const theLongest = Math.max(...allLengths);
    return theLongest;
}

getGridSize = (theLengthOfTheLongestWord, totalWords) => Math.max(...[theLengthOfTheLongestWord, totalWords]);

// Makes correctly sized empty array
function newGrid(wordList) {
    const words = wordList;
    prepareLayout(words);
    const gridSize = getGridSize(getTheLengthOfTheLongestWord(words), words.length);
    var grid = [];
    for (i = 0; i < gridSize; i++) {
        grid.push([]);
        for (j = 0; j < gridSize; j++) {
            grid[i].push("");
        }
    }
    fillUpGrid(words, grid, gridSize);
}

// Fills an array with given words
function fillUpGrid(words, grid, gridSize) {
    
    var fillableRows = getFillableRows(words, gridSize); 
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

// Fills grid with random letters when words are positioned already
function fillBlankSpaces(grid) {
    const alphabet = [
        "A", "Ā", "B", "C", "Č", "D", 
        "E", "Ē", "F", "G", "Ģ", "H", 
        "I", "Ī", "J", "K", "Ķ", "L", 
        "Ļ", "M", "N", "Ņ", "O", "P", 
        "R", "S", "Š", "T", "U", "Ū", 
        "V", "Z", "Ž"
    ];

    for (row in grid) {
        for (element in grid[row]) {
            if (grid[row][element] == "") {
                grid[row][element] = alphabet[randInt(0, alphabet.length - 1)].toLowerCase();
            }
        }
    }
    makeTable(grid);
}

// Clears table before new words are inserted
function clearTable(table) {
    while (table.rows.length > 0) {
        table.rows[0].remove();
    }
}

// Makes table from given letters
function makeTable(grid) {
    const table = document.getElementById("grid");
    clearTable(table);
    for (row in grid) {
        var tableRow = document.createElement("tr");
        for (element in grid[row]) {
            var tableCell = document.createElement("td");
            tableCell.textContent = grid[row][element].toUpperCase();
            tableCell.addEventListener("mousedown", mouseDownOnLetter);
            tableRow.append(tableCell);
        }
        table.append(tableRow);
    }
    resizeTable();
}

// Randomly generarates array with numbers of rows where words will be in
function getFillableRows(words, gridSize) {
    var fillableRows = [];
    if (words.length < gridSize) {
        while (fillableRows.length < words.length) {
            let row = randInt(0, gridSize - 1);
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

// If word is found, disables its parent row
function lockFoundWord(word, row) {
    var rowLetters = "";
    for (element of row.children) {
        rowLetters += element.textContent;
    }
    var startIndex = rowLetters.indexOf(word);
    
    if (startIndex == -1) {
        startIndex = rowLetters.indexOf(word.split("").reverse().join(""));
    }

    for (let i = startIndex; i < startIndex + word.length; i++) {
        row.children[i].classList.add("highlighted");
    }

    for (element of row.children) {     // removes eventListeners from all row cells
        element.removeEventListener("mouseenter", mouseMovedOnLetter);
        element.removeEventListener("mouseup", mouseUpOnLetter);
        element.removeEventListener("mousedown", mouseDownOnLetter);
        element.classList.add("locked");
    }

    removeWordFromList(word);
}

// Removes found word from list
function removeWordFromList(foundWord) {
    const list = document.getElementById("listOfWords");
    for (list_item of list.children) {
        if (list_item.textContent == foundWord) {
            list_item.classList.add("found");
        }
        }
}

// Checks if selected word is present in list
function checkFoundWords(row) {
    var selectedLetters = "";
    for (element of row.children) {
        if (element.classList.contains("selected")) {
            selectedLetters += element.textContent;
        }
    }

    const words = [];
    const list = document.getElementById("listOfWords");
    for (list_item of list.children) {
        words.push(list_item.textContent);
    }

    var wordFound;
    for (word of words) {
        const wordArray = Array.from(word);
        if (selectedLetters == wordArray.join("") || selectedLetters == wordArray.reverse().join("")) {
            return word;
        }
    }
    return false;
}

// *** EVENT LISTENERS ***

function mouseDownOnLetter() {
    this.classList.add("selected");
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
    var wordFound = checkFoundWords(row);
    if (wordFound == false) {
        for (element of row.children) {
            element.classList.remove("selected");
        }
    }
    else {
        lockFoundWord(wordFound, row);
    }
}

function mouseMovedOnLetter() {
    this.classList.add("selected");
}

function mouseOutOfRow() {
    for (element of this.children) {
        element.removeEventListener("mouseenter", mouseMovedOnLetter);
    }
}

// *** JUST A RANDOMIZER ***
function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}