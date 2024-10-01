import { App, Modal, Setting } from 'obsidian';
import DateFolderPlugin from 'main';
import { DateFolderPair } from 'types';

export class FileCreator extends Modal {
    plugin: DateFolderPlugin;
    result: DateFolderPair;

    constructor(app: App, plugin: DateFolderPlugin) {
        super(app);
        this.plugin = plugin;
    }

    onOpen() {
        const { contentEl } = this;

        contentEl.createEl('h2', { text: 'Select a Date-Folder Pair' });

        new Setting(contentEl)
            .setName('Pair')
            .addDropdown(dropdown => {
                this.plugin.settings.pairs.forEach((pair, index) => {
                    dropdown.addOption(`${index}`, `${pair.template} - ${pair.folder}`);
                });
                dropdown.onChange(async (value) => {
                    this.result = this.plugin.settings.pairs[parseInt(value)];
                });
            });

        new Setting(contentEl)
            .addButton(btn => btn
                .setButtonText('Create')
                .setCta()
                .onClick(() => {
                    this.close();
                    this.createFile();
                }));
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }

    async createFile() {
        if (!this.result) return;

        const date = new Date();
        const fileName = date.toLocaleDateString('en-CA', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).replace(/\//g, '-') + '.md';

        const filePath = `${this.result.folder}/${fileName}`;

        await this.app.vault.create(filePath, '');

        const leaf = this.app.workspace.getLeaf(false);
        await leaf.openFile(this.app.vault.getAbstractFileByPath(filePath) as any);

        this.app.workspace.setActiveLeaf(leaf, { focus: true });
    }
}
