import InputManager from './InputManager.js';
import OutputManager from './OutputManager.js';

let inputManager;
let outputManager;
let fileCounter = 1;

function onSubmit(value) {
    outputManager.add(value);
}

function handleStartOverClick(e) {
    inputManager.reset();
    outputManager.reset();
}

// As per https://stackoverflow.com/questions/3665115/how-to-create-a-file-in-memory-for-user-to-download-but-not-through-server/18197341#18197341
function handleDownloadClick(e) {
    const buttonId = e.target.id;

    // This works only because there are only two buttons: Download TXT and Download CSV
    const filetype = buttonId === "downloadTXTButton" ? 'text/plain' : 'text/csv';
    const ext = buttonId === "downloadTXTButton" ? 'txt' : 'csv';

    const blob = new Blob([outputManager.get(ext)], {type: filetype});
    const filename = `alphabetizer_results_${fileCounter}.${ext}`;

    // Support freakin' IE11 cos why not
    if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob, filename);
        return;
    }

    const dl = document.createElement('a');
    const url = window.URL.createObjectURL(blob);
    dl.href = url;
    dl.download= filename;
    dl.style.display = "none";
    document.body.appendChild(dl);
    dl.click();
    document.body.removeChild(dl);
    window.URL.revokeObjectURL(url);

    fileCounter += 1;
}

function handleOnload() {
    inputManager = new InputManager('separatorSelectDropdown', 'inputTextarea', onSubmit);
    outputManager = new OutputManager('output', 'ignoreCaseCheckbox', 'duplicateHandlingRadioFieldset');

    const startOverButton = document.getElementById('startOverButton');
    startOverButton.addEventListener('click', handleStartOverClick);

    const downloadTXTButtonEl = document.getElementById('downloadTXTButton');
    downloadTXTButtonEl.addEventListener('click', handleDownloadClick);

    const downloadCSVButtonEl = document.getElementById('downloadCSVButton');
    downloadCSVButtonEl.addEventListener('click', handleDownloadClick);
}

window.onload = handleOnload;
