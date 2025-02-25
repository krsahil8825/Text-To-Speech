let utterance;
let words = [];
let currentWordIndex = 0;

window.addEventListener("message", function (event) {
    if (event.data.action === "toggleReading") {
        if (event.data.isReading) {
            startReading();
        } else {
            stopReading();
        }
    } else if (event.data.action === "stopReading") {
        stopReading();
    }
});

function startReading() {
    stopReading(); // Stop any ongoing speech

    const text = document.body.innerText;
    words = text.split(/\s+/);
    currentWordIndex = 0;

    if (words.length === 0) return;

    utterance = new SpeechSynthesisUtterance();
    utterance.lang = "en-US";
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onboundary = function (event) {
        highlightWord();
    };

    utterance.onend = function () {
        clearHighlight();
    };

    readNextChunk();
}

function readNextChunk() {
    if (currentWordIndex >= words.length) return;

    let chunkSize = 20; // Read in chunks
    let chunkText = words.slice(currentWordIndex, currentWordIndex + chunkSize).join(" ");
    currentWordIndex += chunkSize;

    utterance.text = chunkText;
    speechSynthesis.speak(utterance);
}

function stopReading() {
    if (utterance) speechSynthesis.cancel();
    clearHighlight();
}

function highlightWord() {
    clearHighlight();
    if (currentWordIndex < words.length) {
        let wordToHighlight = words[currentWordIndex];
        let regex = new RegExp("\\b" + wordToHighlight + "\\b", "gi");

        document.body.innerHTML = document.body.innerHTML.replace(
            regex,
            `<span class="highlighted-word">${wordToHighlight}</span>`
        );

        currentWordIndex++;
    }
}

function clearHighlight() {
    document.querySelectorAll(".highlighted-word").forEach(el => {
        el.outerHTML = el.innerText;
    });
}
