const tiles = document.querySelector(".tile-container");
const backSpaceAndEnterRow = document.querySelector("#backSpaceAndEnterRow");
const keyboardFirstRow = document.querySelector("#keyboardFirstRow");
const keyboardSecondRow = document.querySelector("#keyboardSecondRow");
const keyboardThridRow = document.querySelector("#keyboardThridRow");

const keysFirstRow = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
const keysSecondRow = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
const keysThridRow = ["Z", "X", "C", "V", "B", "N", "M"];

const rows = 6;
let columns = 5;

let currentRow = 0;
let currentColumn = 0;
let counter = 0;
let word = [];
let wordNow = [];
let wordMap = {};
let validity = [];
const guesses = [];
var verified = new Boolean(false);

function loadword() {
    //const url = `http://localhost/hunterword/api/index.php`;
    const url = `https://DESKTOP-J458M9S/hunterword/api/index.php`;
    fetch(url, {
        method: 'GET'
    }).then(response => {
        if (!response.ok) {
            throw new Error('Erro na solicitação: ' + response.status);
        }
        return response.json();
    }).then(data => {
        if (Array.isArray(data)) {
            data.map(data => data.id);
            word = data;
            for (let i = word.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i * 1));
                [word[i], word[j]] = [word[j], word[i]];
            }
            wordNow = word.slice(0, 1);
            console.log("Palavra de agora: " + wordNow[0].palavra);

            // Atualize a variável 'columns' com base no tamanho da palavra
            columns = wordNow[0].palavra.length;

            wordMap = {};
            for (let index = 0; index < wordNow[0].palavra.length; index++) {
                const letter = wordNow[0].palavra[index];
                if (wordMap.hasOwnProperty(letter)) {
                    wordMap[letter].push(index);
                } else {
                    wordMap[letter] = [index];
                }
            }
            console.log(wordMap);
            // Agora, crie as colunas com base no novo valor de 'columns'
            createColumns();
        }
    });
}
loadword();

// Crie as colunas
function createColumns() {

    // Crie as novas colunas com base no tamanho da palavra
    for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
        guesses[rowIndex] = new Array(columns);
        const tileRow = document.createElement("div");
        tileRow.setAttribute("id", "row" + rowIndex);
        tileRow.setAttribute("class", "tile-row");
        for (let columnIndex = 0; columnIndex < columns; columnIndex++) {
            const tileColumn = document.createElement("div");
            tileColumn.setAttribute("id", "row" + rowIndex + "column" + columnIndex);
            tileColumn.setAttribute("class", rowIndex === 0 ? "tile-column typing" : "tile-column disable");
            tileRow.append(tileColumn);
            guesses[rowIndex][columnIndex] = "";
        }
        tiles.append(tileRow);
    }
}

function checkWordValidity(wordToCheck) {
    return new Promise((resolve, reject) => {
        let apiUrl = `filters/palavras_${wordToCheck.length}.txt`;

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro na solicitação: ' + response.status);
                }
                return response.text();
            })
            .then(text => {
                const validity = text.split("\n");
                for (let index = 0; index < validity.length; index++) {
                    if (wordToCheck === validity[index]) {
                        console.log(`A palavra "${wordToCheck}" é válida.`);
                        resolve(true);
                        return;
                    }
                }
                resolve(false);
            })
            .catch(error => {
                console.error('Erro ao verificar a palavra:', error);
                reject(error);
            });
    });
}

const checkGuess = async () => {
    const guess = guesses[currentRow].join("");

    if (guess.length !== columns) {
        return;
    }

    try {
        verified = await checkWordValidity(guess);

        if (verified === true) {
            var currentColumns = document.querySelectorAll(".typing");

            for (let i = 0; i < columns; i++) {
                const letter = guess[i];
                if (wordMap[letter] === undefined) {
                    currentColumns[i].classList.add("wrong");
                } else if (wordMap[letter].includes(i)) {
                    currentColumns[i].classList.add("right");
                } else {
                    currentColumns[i].classList.add("displaced");
                }
            }
            if (guess === wordNow[0].palavra) {
                displayMessage("Parabéns, você acertou!");
            } else {
                if (currentRow === rows - 1) {
                    displayMessage("Errou, a palavra era: " + wordNow[0].palavra);
                } else {
                    moveNextRow();
                }
            }
        } else {
            var currentColumns = document.querySelectorAll(".typing");
            for (let i = 0; i < columns; i++) {
                if (verified === false) {
                    currentColumns[i].classList.remove("typing");
                    currentColumns[i].classList.add("wordlistError");
                }
            }
        }
    } catch (error) {
        console.error('Erro ao verificar a palavra:', error);
    }
}

const moveNextRow = () => {
    var typingColumns = document.querySelectorAll(".typing");
    for (let index = 0; index < typingColumns.length; index++) {
        typingColumns[index].classList.remove("typing");
        typingColumns[index].classList.add("disabled");
    }
    currentRow++;
    currentColumn = 0;

    const currentRowEl = document.querySelector("#row" + currentRow);
    var currentColumns = currentRowEl.querySelectorAll(".tile-column");
    for (let index = 0; index < currentColumns.length; index++) {
        currentColumns[index].classList.remove("disabled");
        currentColumns[index].classList.add("typing");
    }
}

const keyboard = (key) => {
    if (currentColumn === columns) {
        return;
    }
    const currentTile = document.querySelector("#row" + currentRow + "column" + currentColumn);
    currentTile.textContent = key;
    guesses[currentRow][currentColumn] = key;
    currentColumn++;
}

const createKeyboardRow = (keys, keyboardRow) => {
    keys.forEach((key) => {
        var buttonElement = document.createElement("button");
        buttonElement.textContent = key;
        buttonElement.setAttribute("id", key);
        buttonElement.addEventListener("click", () => keyboard(key));
        keyboardRow.append(buttonElement);
    });
}

createKeyboardRow(keysFirstRow, keyboardFirstRow);
createKeyboardRow(keysSecondRow, keyboardSecondRow);
createKeyboardRow(keysThridRow, keyboardThridRow);

const backSpace = () => {
    if (currentColumn === 0) {
        return;
    }
    currentColumn--;
    guesses[currentRow][currentColumn] = "";
    const tile = document.querySelector("#row" + currentRow + "column" + currentColumn);
    tile.textContent = "";
    var wordlistError = document.querySelectorAll(".wordlistError");
    if (wordlistError) {
        tile.classList.remove("wordlistError");
        tile.classList.add("typing");
    }
}

const backSpaceButton = document.createElement("button");
backSpaceButton.addEventListener("click", backSpace);
backSpaceButton.textContent = "<";
backSpaceAndEnterRow.append(backSpaceButton);

const enterButton = document.createElement("button");
enterButton.addEventListener("click", checkGuess);
enterButton.textContent = "ENTER";
backSpaceAndEnterRow.append(enterButton);

document.onkeydown = function (evt) {
    evt = evt || window.evt;
    if (evt.key === "Enter") {
        checkGuess();
    } else if (evt.key === "Backspace") {
        backSpace();
    } else {
        if (/^[a-z]$/.test(evt.key) || /^[A-Z]$/.test(evt.key)) {
            keyboard(evt.key.toUpperCase());
        } else {
            console.log("Tecla não é letra");
        }
    }
}

function displayMessage(message) {
    // Esconda o app-container
    const appContainer = document.querySelector(".app-container");
    appContainer.style.display = "none";

    // Exiba a mensagem
    const messageContainer = document.getElementById("message-container");
    const messageText = document.getElementById("message-text");
    const restartButton = document.getElementById("restart-button");

    messageText.textContent = message;
    messageContainer.style.display = "block";

    // Mostrar botão de reinício se necessário
    if (message.includes("Errou") || message.includes("Parabéns")) {
        restartButton.style.display = "block";
    } else {
        restartButton.style.display = "none";
    }
}

function restartGame() {
    // Recarrega a página para reiniciar o jogo
    window.location.reload();
}