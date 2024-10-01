import { App, TFolder } from 'obsidian';

export class FolderSuggester {
    constructor(private app: App, private inputEl: HTMLInputElement) {
        inputEl.addEventListener('focus', this.onFocus.bind(this));
        inputEl.addEventListener('input', this.onInput.bind(this));
    }

    onFocus() {
        this.updateSuggestions();
    }

    onInput() {
        this.updateSuggestions();
    }

    updateSuggestions() {
        const inputVal = this.inputEl.value;
        const folders = this.app.vault.getAllLoadedFiles().filter(f => f instanceof TFolder) as TFolder[];
        const matchingFolders = folders.filter(f => f.path.toLowerCase().includes(inputVal.toLowerCase()));

        const datalist = document.createElement('datalist');
        datalist.id = 'folder-suggestions';
        matchingFolders.forEach(folder => {
            const option = document.createElement('option');
            option.value = folder.path;
            datalist.appendChild(option);
        });

        const existingDatalist = document.getElementById('folder-suggestions');
        if (existingDatalist) {
            existingDatalist.replaceWith(datalist);
        } else {
            document.body.appendChild(datalist);
        }

        this.inputEl.setAttribute('list', 'folder-suggestions');
    }
}
