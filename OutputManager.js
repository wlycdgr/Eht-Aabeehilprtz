export default class OutputManager {
    constructor(outputElId, ignoreCaseCheckboxElId) {
        this._items = [];
        this._outputEl = document.getElementById(outputElId);
        this._ignoreCaseCheckboxEl =
            document.getElementById(ignoreCaseCheckboxElId);
        this._ignoreCaseCheckboxEl.addEventListener(
            'click', this._handleIgnoreCaseCheckboxClick.bind(this)
        );
    }

    add(newItems) {
        if (typeof newItems === "string") {
            this._items.push(newItems);
        } else {
            this._items.push(...newItems);
        }
        this._sort();
        this._display();
    }

    reset() {
        this._items.length = 0;
        this._display();
    }

    get(format) {
        if (format === 'txt') {
            return(this._items.join('\n'));
        }

        if (format === 'csv') {
            const allCommas = /,/g;
            const csvEncodedItems = this._items.map(item => item.replace(allCommas, '[comma]'));
            return (csvEncodedItems.join('\n'));
        }

        return '';
    }

    _display() {
        this._outputEl.innerHTML = null;

        this._items.forEach(item => {
            const itemEl = document.createElement('span');
            itemEl.innerText = `${item}\n`;
            this._outputEl.appendChild(itemEl);
        })
    }

    _handleIgnoreCaseCheckboxClick(e){
        this._sort();
        this._display();
    }

    _sort() {
        const ignoreCase = this._ignoreCaseCheckboxEl.checked;

        if (ignoreCase) {
            this._items.sort((a, b) => {
                if (a.toLowerCase() <= b.toLowerCase()) {
                    return -1;
                } else {
                    return 1;
                }
            });
        } else {
            this._items.sort();
        }
    }
}
