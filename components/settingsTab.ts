import { App, PluginSettingTab, Setting } from 'obsidian';
import DateFolderPlugin from 'main';
import { FolderSuggester } from 'components/folderSuggester';

export class SettingsTab extends PluginSettingTab {
    plugin: DateFolderPlugin;

    constructor(app: App, plugin: DateFolderPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;

        containerEl.empty();

        containerEl.createEl('h2', { text: 'Date-Folder Pairs Settings' });

        new Setting(containerEl)
            .setName('Add New Pair')
            .setDesc('Add a new date template and folder pair')
            .addButton(cb => cb
                .setButtonText('+')
                .onClick(() => {
                    this.plugin.settings.pairs.push({ template: '', folder: '' });
                    this.plugin.saveSettings();
                    this.display();
                }));

        this.plugin.settings.pairs.forEach((pair, index) => {
            const setting = new Setting(containerEl)
                .addText(text => text
                    .setPlaceholder('YYYY-MM-DD')
                    .setValue(pair.template)
                    .onChange(async (value) => {
                        this.plugin.settings.pairs[index].template = value;
                        await this.plugin.saveSettings();
                    }))
                .addText(text => {
                    new FolderSuggester(this.app, text.inputEl);
                    text.setPlaceholder('folder/path')
                        .setValue(pair.folder)
                        .onChange(async (value) => {
                            this.plugin.settings.pairs[index].folder = value;
                            await this.plugin.saveSettings();
                        });
                })
                .addButton(cb => cb
                    .setIcon('trash')
                    .onClick(async () => {
                        this.plugin.settings.pairs.splice(index, 1);
                        await this.plugin.saveSettings();
                        this.display();
                    }));
        });
    }
}
