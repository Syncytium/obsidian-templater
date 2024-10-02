import { Plugin, TFolder } from 'obsidian';
import { SettingsTab } from './components/SettingsTab';
import { ItemSelector } from './components/ItemSelector';
import { Item } from './models/Item';
import { FileCreationService } from './services/FileCreationService';
import { TemplateService } from './services/TemplateService';

interface PluginSettings {
  items: Item[];
}

const DEFAULT_SETTINGS: PluginSettings = {
  items: []
};

export default class DatedTemplatePlugin extends Plugin {
  settings: PluginSettings;

  async onload() {
    await this.loadSettings();

    this.addSettingTab(new SettingsTab(this.app, this));

    this.addCommand({
      id: 'create-dated-template',
      name: 'create dated file with template - tracking/journal',
      callback: () => {
        new ItemSelector(this.app, this.settings.items, this.createDatedFile.bind(this)).open();
      }
    });
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  async createDatedFile(item: Item) {
    const fileCreationService = new FileCreationService(this.app);
    const templateService = new TemplateService(this.app);

    const file = await fileCreationService.createDatedFile(item);
    if (file) {
      await templateService.insertTemplate(file, item.template);
      this.app.workspace.getLeaf().openFile(file);

      const folder = this.app.vault.getAbstractFileByPath(item.location) as TFolder;
      if (folder) {
        this.app.workspace.setActiveLeaf(this.app.workspace.getLeaf(), { focus: false });
        this.app.workspace.revealLeaf(this.app.workspace.getLeaf());
      }
    }
  }
}