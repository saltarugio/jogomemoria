const tiles = document.querySelector(".tile-container");
const backSpaceAndEnterRow = document.querySelector("#backSpaceAndEnterRow");
const keyboardFirstRow = document.querySelector("#keyboardFirstRow");
const keyboardSecondRow = document.querySelector("#keyboardSecondRow");
const keyboardThridRow = document.querySelector("#keyboardThridRow");
const tipsBox = document.querySelector(".tipsBox");
const restart_btn = document.querySelector("#restart-button");
const msg = document.querySelector(".curiosity");

const keysFirstRow = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
const keysSecondRow = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
const keysThridRow = ["Z", "X", "C", "V", "B", "N", "M"];

const rows = 6;
let columns = 5;

let currentRow = 0;
let currentColumn = 0;
let counter = 0;
let wordNow = [];
let wordMap = {};
let validity = [];
const guesses = [];
var verified = new Boolean(false);
init();
//Verifica se a palavra fornecida é valida
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
                        resolve(true);
                        return;
                    }
                }
                resolve(false);
            })
            .catch(error => {
                console.error("Erro ao fazer verificação! " + error.status);
                reject(error);
            });
    });
}

//Checa as posições das letras. Se existe na palavra, se está na posição correta ou não
//verifica se acertou ou se acabou as chances.
const checkGuess = async () => {
    const guess = guesses[currentRow].join("");
    if (guess.length !== columns) {
        return;
    }

    try {
        verified = await checkWordValidity(guess);

        if (verified === true) {
            var currentColumns = document.querySelectorAll(".typing");

            const guessWordMap = {};

            for (let index = 0; index < guess.length; index++) {
                const letter = guess[index];
                if (!guessWordMap.hasOwnProperty(letter)) {
                    guessWordMap[letter] = 0;
                }
            }

            for (let i = 0; i < columns; i++) {
                const letter = guess[i];
                var colorB = document.getElementById(letter.toUpperCase());
                if (wordMap[letter] === undefined || guessWordMap[letter] >= wordMap[letter].length) {
                    currentColumns[i].classList.add("wrong");
                    colorB.classList.add("wrong");
                } else {
                    if (wordMap[letter].includes(i)) {
                        currentColumns[i].classList.add("right");
                        colorB.classList.add("right");

                        guessWordMap[letter]++;
                    } else {
                        // Verifica se a letra já foi marcada como errada antes
                        if (guessWordMap[letter] < wordMap[letter].length) {
                            currentColumns[i].classList.add("displaced");
                            colorB.classList.add("displaced");
                            guessWordMap[letter]++;
                        } else {
                            if (wordMap[letter].includes(i)) {
                                currentColumns[i].classList.add("right");
                                colorB.classList.add("right");
                            } else {
                                currentColumns[i].classList.add("wrong");
                                colorB.classList.add("wrong");
                            }
                        }
                    }
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

//Função de movimentação de linhas
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

// Função de exibir as teclas na tela
const keyboard = (key) => {
    if (currentColumn === columns) {
        return;
    }
    const currentTile = document.querySelector("#row" + currentRow + "column" + currentColumn);
    currentTile.textContent = key;
    guesses[currentRow][currentColumn] = key;
    currentColumn++;
}

//Cria os botões da tela
const createKeyboardRow = (keys, keyboardRow) => {
    keys.forEach((key) => {
        var buttonElement = document.createElement("button");
        buttonElement.textContent = key;
        buttonElement.setAttribute("id", key);
        buttonElement.addEventListener("click", () => keyboard(key));
        keyboardRow.append(buttonElement);
    });
}

//Função de apagar
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
        for (let i = 0; i < wordlistError.length; i++) {
            wordlistError[i].classList.remove("wordlistError");
            wordlistError[i].classList.add("typing");
        }
    }
}

//Função de exibição de mensagem quando o jogo acaba
function displayMessage(message) {
    // Exiba a mensagem
    const messageContainer = document.getElementById("message-container");
    const messageText = document.getElementById("message-text");
    const restartButton = document.getElementById("restart-button");
    const overlay = document.getElementById("overlay");

    msg.textContent = wordNow[0].curiosidade;
    messageText.textContent = message;
    messageContainer.style.display = "block";
    overlay.style.display = "block";

    // Mostrar botão de reinício se necessário
    if (message.includes("Errou") || message.includes("Parabéns")) {
        restartButton.style.display = "block";
    } else {
        restartButton.style.display = "none";
    }
}

//Função do botão de reiniciar o jogo
restart_btn.onclick = ()=>{
    // Recarrega a página para reiniciar o jogo
    window.location.reload();
}

function init() {
    //Embaralha o array de palavras
    for (let i = words.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i * 1));
        [words[i], words[j]] = [words[j], words[i]];
    }
    wordNow = words.slice(0, 1);
    columns = wordNow[0].palavra.length;
    console
    //Faz o mapeamento das letras da palavra escolhida
    for (let index = 0; index < wordNow[0].palavra.length; index++) {
        const letter = wordNow[0].palavra[index];
        if (wordMap.hasOwnProperty(letter)) {
            wordMap[letter].push(index);
        } else {
            wordMap[letter] = [index];
        }
    }

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

    createKeyboardRow(keysFirstRow, keyboardFirstRow);
    createKeyboardRow(keysSecondRow, keyboardSecondRow);
    createKeyboardRow(keysThridRow, keyboardThridRow);

    //Cria o botão de apagar
    const backSpaceButton = document.createElement("button");
    const backSpaceIcon = document.createElement("img");
    backSpaceIcon.src = "./icons/backspace.png";
    backSpaceButton.appendChild(backSpaceIcon);
    backSpaceButton.addEventListener("click", backSpace);
    backSpaceAndEnterRow.append(backSpaceButton);

    //Cria o botão de entre
    const enterButton = document.createElement("button");
    const enterIcon = document.createElement("img");
    enterIcon.src = "./icons/enter.png";
    enterButton.appendChild(enterIcon);
    enterButton.addEventListener("click", checkGuess);
    backSpaceAndEnterRow.append(enterButton);

    //Função de pegar as letras do teclado
    document.onkeydown = function (evt) {
        evt = evt || window.evt;
        if (evt.key === "Enter") {
            checkGuess();
        } else if (evt.key === "Backspace") {
            backSpace();
        } else {
            if (/^[a-z]$/.test(evt.key) || /^[A-Z]$/.test(evt.key)) {
                keyboard(evt.key.toUpperCase());
            }
        }
    }

    const tipsText = document.querySelector(".tips_text");
    const tips = document.querySelector(".tips");
    tipsText.textContent = wordNow[0].dica;
    tips.append(tipsText);

}
