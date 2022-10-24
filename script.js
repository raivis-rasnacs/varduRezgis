// *** LAYOUT THINGS ***
function prepareLayout(words) {
    //document.getElementById("starterForm").hidden = true;
    //var list = "<p id='listOfWords'></p>";
    //document.getElementById("title").insertAdjacentHTML("afterend", list);
    document.getElementById("listOfWords").textContent = "";
    for (word of words) {
        document.getElementById("listOfWords").textContent += word + "\n";
    }
}

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

function clearTable(table) {
    while (table.rows.length > 0) {
        table.rows[0].remove();
    }
}

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

function removeWordFromList(foundWord) {
    const alreadyFoundWords = document.getElementById("listOfWords").getElementsByTagName("s");
    var alreadyFoundWordsArray = [];
    for (element of alreadyFoundWords) {
        alreadyFoundWordsArray.push(element.textContent);
    } 
    alreadyFoundWordsArray += foundWord;
    var listOfWords = document.getElementById("listOfWords");
    var listArray = listOfWords.textContent.trim().split("\n");
    listOfWords.textContent = "";
    for (word of listArray) {
        if (alreadyFoundWordsArray.includes(word)) {
            listOfWords.innerHTML += `<s>${word}</s>` + "\n";
        }
        else {
            listOfWords.innerHTML += word + "\n";
        }
    }
}

function checkFoundWords(row) {
    var selectedLetters = "";
    for (element of row.children) {
        if (element.classList.contains("selected")) {
            selectedLetters += element.textContent;
        }
    }

    const words = document.getElementById("listOfWords").textContent.toUpperCase().trim().split("\n");
    
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