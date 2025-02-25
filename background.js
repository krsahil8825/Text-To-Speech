chrome.runtime.onInstalled.addListener(() => {
    console.log("Text to Speech extension installed.");
});

chrome.runtime.onSuspend.addListener(() => {
    speechSynthesis.cancel(); // Stop reading when the page is closed
});
