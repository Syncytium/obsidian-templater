import { Plugin, } from 'obsidian';
import { DateFolderPluginSettings, DEFAULT_SETTINGS } from 'types';
import { SettingsTab } from 'components/settingsTab';
import { FileCreator } from 'components/fileCreator';

export default class DateFolderPlugin extends Plugin {
    settings: DateFolderPluginSettings;

    async onload() {
        await this.loadSettings();

        this.addSettingTab(new SettingsTab(this.app, this));

        this.addCommand({
            id: 'create-date-folder-file',
            name: 'Create Date-Folder File',
            callback: () => {
                new FileCreator(this.app, this).open();
            }
        });
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}

