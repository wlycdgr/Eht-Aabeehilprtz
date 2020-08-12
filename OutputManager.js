export default class OutputManager {
    constructor(outputElId, ignoreCaseCheckboxElId, duplicateHandlingRadioFieldsetElId) {
        this._items = [];
        this._displayItems = [];
        this._outputEl = document.getElementById(outputElId);
        this._ignoreCaseCheckboxEl =
            document.getElementById(ignoreCaseCheckboxElId);
        this._ignoreCaseCheckboxEl.addEventListener(
            'click', this._handleIgnoreCaseCheckboxClick.bind(this)
        );
        this._dupeHandlingRadioFieldsetEl =
            document.getElementById(duplicateHandlingRadioFieldsetElId);
        this._dupeHandlingRadioFieldsetEl.addEventListener(
            'click', this._handleDupeHandlingRadioClick.bind(this)
        );
        this._duplicateHandlingMethod = "leave";
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
        this._displayItems.length = 0;
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

        this._displayItems.forEach(item => {
            const itemEl = document.createElement('span');
            itemEl.innerText = `${item}\n`;
            this._outputEl.appendChild(itemEl);
        })
    }

    _handleDupeHandlingRadioClick(e) {
        const t = e.target;
        console.log(t);

        if (t.id === "radioLeave") {
            this._duplicateHandlingMethod = "leave";
        }
        else if (t.id === "radioGroup") {
            this._duplicateHandlingMethod = "group";
        }
        else if (t.id === "radioRemove") {
            this._duplicateHandlingMethod = "remove";
        }

        if (t.id === "radioLeave" || t.id === "radioGroup" || t.id === "radioRemove") {
            this._sort();
            this._display();
        }
    }

    _handleIgnoreCaseCheckboxClick(e){
        this._sort();
        this._display();
    }

    _sort() {
        // Reset displayItems
        this._displayItems.length = 0;
        this._displayItems = [...this._items];

        // Handle duplicates
        if (this._duplicateHandlingMethod === "remove") {
            this._displayItems = [...new Set(this._displayItems)];
        }
        else if (this._duplicateHandlingMethod === "group") {
            // count occurrence of each item
            const itemCounts = {};
            this._displayItems.forEach(item => {
                if (itemCounts[item]) {
                    itemCounts[item] += 1;
                } else {
                    itemCounts[item] = 1;
                }
            });

            console.log(itemCounts);

            // create new array with dupes replaced by counts
            const groupedDisplayItems = [];
            Object.entries(itemCounts).forEach(itemCount => {
                const item = itemCount[0];
                const count = itemCount[1];
                if (count === 1) {
                    groupedDisplayItems.push(item);
                } else {
                    groupedDisplayItems.push(`${item} (${count})`);
                }
            })

            this._displayItems = [...groupedDisplayItems];
        }

        console.log(this._displayItems);

        // Handle ignore case setting
        const ignoreCase = this._ignoreCaseCheckboxEl.checked;
        if (ignoreCase) {
            this._displayItems.sort((a, b) => {
                if (a.toLowerCase() <= b.toLowerCase()) {
                    return -1;
                } else {
                    return 1;
                }
            });
        }
        else {
            this._displayItems.sort();
        }
    }
}
