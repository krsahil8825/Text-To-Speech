document.addEventListener("DOMContentLoaded", function () {
    const toggleBtn = document.getElementById("toggle-btn");
    const stopBtn = document.getElementById("stop-btn");

    let isReading = false;

    toggleBtn.addEventListener("click", function () {
        isReading = !isReading;
        toggleBtn.textContent = isReading ? "Turn OFF" : "Turn ON";
        stopBtn.disabled = !isReading;

        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: toggleReading,
                args: [isReading]
            });
        });
    });

    stopBtn.addEventListener("click", function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: stopReading
            });
        });

        isReading = false;
        toggleBtn.textContent = "Turn ON";
        stopBtn.disabled = true;
    });
});

function toggleReading(isReading) {
    window.postMessage({ action: "toggleReading", isReading }, "*");
}

function stopReading() {
    window.postMessage({ action: "stopReading" }, "*");
}
