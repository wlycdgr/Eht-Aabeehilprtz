import { trimArr } from "./utils.js";

export default class InputManager {
    constructor(separatorSelectDropdownId, inputTextareaId, onSubmitHandler) {
        this.separator = 'none';

        this._separatorSelectEl = document.getElementById(separatorSelectDropdownId);
        this._separatorSelectEl.addEventListener('change', this._handleUpdateSelection.bind(this));

        this._inputTextareaEl = document.getElementById(inputTextareaId);
        this._inputTextareaEl.addEventListener('input', this._handleInput.bind(this));

        this._onSubmit = onSubmitHandler;
    }

    reset() {
        // Reset separator select dropdown
        const separatorOptions = this._separatorSelectEl.children;
        Array.from(separatorOptions).forEach(option => {
            option.selected = false;
        });
        separatorOptions[0].selected = true;
        this.separator = separatorOptions[0].value;

        // Clear input textarea
        this._inputTextareaEl.value = "";
    }

    _handleUpdateSelection(e) {
        console.log(this);
        this.separator = e.target.value;
    }

    _handleInput(e) {
        console.log(e);

        // Don't fuck with Paste
        if (e.inputType === "insertFromPaste") {
            return;
        }

        // Don't fuck with Backspace
        if (e.inputType === "deleteContentBackward") {
            return;
        }

        // Block newline insertion
        if (e.target.value === "\n") {
            e.target.value = "";
            return;
        }

        // Submit on Enter
        if (e.data === null) {
            console.log(e.target.value);
            const input = this._inputTextareaEl.value;
            switch (this.separator) {
                case "none":
                    this._onSubmit(input.trim());
                    break;
                case "newline":
                    this._onSubmit(trimArr(input.split('\n')));
                    break;
                case "comma":
                    this._onSubmit(trimArr(input.split(',')));
                    break;
                case "space":
                    this._onSubmit(trimArr(input.split(' ')));
                    break;
                default:
                    this._onSubmit(input.trim());
            }

            this._inputTextareaEl.value = '';
        }
    }
}
