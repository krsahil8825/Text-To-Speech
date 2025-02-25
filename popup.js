document.addEventListener("DOMContentLoaded", function () {
    const textInput = document.getElementById("text-input");
    const languageSelect = document.getElementById("language-select");
    const voiceSelect = document.getElementById("voice-select");
    const speakBtn = document.getElementById("speak-btn");
    const stopBtn = document.getElementById("stop-btn");
    const toggleBtn = document.getElementById("toggle-btn");

    let isExtensionOn = false;
    let utterance = new SpeechSynthesisUtterance();

    toggleBtn.addEventListener("click", function () {
        isExtensionOn = !isExtensionOn;
        toggleBtn.textContent = isExtensionOn ? "Turn OFF" : "Turn ON";
        speakBtn.disabled = !isExtensionOn;
        stopBtn.disabled = !isExtensionOn;
    });

    speakBtn.addEventListener("click", function () {
        if (!isExtensionOn) return;

        const text = textInput.value.trim();
        if (text === "") return;

        utterance.text = text;

        let selectedLang = languageSelect.value;
        if (selectedLang === "auto") {
            selectedLang = detectLanguage(text);
        }

        const voices = speechSynthesis.getVoices();
        let selectedVoice = voices.find(voice =>
            (voiceSelect.value === "male" && voice.lang.includes(selectedLang) && voice.name.includes("Male")) ||
            (voiceSelect.value === "female" && voice.lang.includes(selectedLang) && voice.name.includes("Female"))
        );

        utterance.voice = selectedVoice || voices[0];
        speechSynthesis.speak(utterance);
    });

    stopBtn.addEventListener("click", function () {
        speechSynthesis.cancel();
    });

    speechSynthesis.onvoiceschanged = () => {
        console.log("Voices loaded");
    };

    function detectLanguage(text) {
        const regex = {
            "zh-CN": /[\u4e00-\u9fff]/,
            "es-ES": /[ñáéíóúü]/,
            "fr-FR": /[àâçéèêëîïôœùûüÿ]/,
            "de-DE": /[äöüß]/,
            "en-US": /[a-zA-Z]/,
        };
        for (let lang in regex) {
            if (regex[lang].test(text)) return lang;
        }
        return "en-US"; // Default to English
    }
});
