import { App, PluginSettingTab, Setting, TFolder, TFile } from 'obsidian';
import DatedTemplatePlugin from '../main';
import { Item } from '../models/Item';

export class SettingsTab extends PluginSettingTab {
  plugin: DatedTemplatePlugin;

  constructor(app: App, plugin: DatedTemplatePlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl('h2', { text: 'Dated Template Settings' });

    this.plugin.settings.items.forEach((item, index) => {
      this.addItemSetting(containerEl, item, index);
    });

    new Setting(containerEl)
      .addButton(cb => cb
        .setButtonText('Add New Item')
        .onClick(() => {
          this.plugin.settings.items.push({ template: '', location: '', filePattern: '' });
          this.plugin.saveSettings();
          this.display();
        }));
  }

  addItemSetting(containerEl: HTMLElement, item: Item, index: number) {
    const itemSetting = new Setting(containerEl)
      .setName(`Item ${index + 1}`)
      .addButton(cb => cb
        .setIcon('trash')
        .onClick(() => {
          this.plugin.settings.items.splice(index, 1);
          this.plugin.saveSettings();
          this.display();
        }));

    itemSetting.addText(text => {
      const textComponent = text
        .setPlaceholder('Template')
        .setValue(item.template)
        .onChange(async (value) => {
          item.template = value;
          await this.plugin.saveSettings();
        });

      textComponent.inputEl.addEventListener('focus', () => {
        this.setupAutoComplete(textComponent.inputEl, this.getTemplates());
      });
    });

    itemSetting.addText(text => {
      const textComponent = text
        .setPlaceholder('Location')
        .setValue(item.location)
        .onChange(async (value) => {
          item.location = value;
          await this.plugin.saveSettings();
        });

      textComponent.inputEl.addEventListener('focus', () => {
        this.setupAutoComplete(textComponent.inputEl, this.getFolders());
      });
    });

    itemSetting.addText(text => text
      .setPlaceholder('File Pattern (e.g., YYYY-MM-DD)')
      .setValue(item.filePattern)
      .onChange(async (value) => {
        item.filePattern = value;
        await this.plugin.saveSettings();
      }));
  }

  setupAutoComplete(inputEl: HTMLInputElement, items: string[]) {
    const autoCompleteContainer = createDiv('suggestion-container');
    document.body.appendChild(autoCompleteContainer);
    autoCompleteContainer.style.display = 'none';
    let selectedIndex = -1;

    const updateSelectedItem = () => {
      const suggestionItems = autoCompleteContainer.querySelectorAll('.suggestion-item');
      suggestionItems.forEach((item, index) => {
        if (index === selectedIndex) {
          item.addClass('is-selected');
        } else {
          item.removeClass('is-selected');
        }
      });
    };

    const selectItem = (index: number) => {
      const suggestionItems = autoCompleteContainer.querySelectorAll('.suggestion-item');
      if (index >= 0 && index < suggestionItems.length) {
        selectedIndex = index;
        inputEl.value = suggestionItems[index].textContent;
        updateSelectedItem();
      }
    };

    const positionDropdown = () => {
      const rect = inputEl.getBoundingClientRect();
      autoCompleteContainer.style.position = 'absolute';
      autoCompleteContainer.style.width = rect.width + 'px';
      autoCompleteContainer.style.left = rect.left + 'px';
      autoCompleteContainer.style.top = (rect.bottom + window.scrollY) + 'px';
    };

    inputEl.addEventListener('input', () => {
      const value = inputEl.value.toLowerCase();
      const matches = items.filter(item => item.toLowerCase().includes(value));

      autoCompleteContainer.empty();
      if (matches.length > 0) {
        autoCompleteContainer.style.display = 'block';
        positionDropdown();
        matches.forEach((match, index) => {
          const suggestionEl = autoCompleteContainer.createDiv('suggestion-item');
          suggestionEl.setText(match);
          suggestionEl.onClickEvent(() => {
            inputEl.value = match;
            autoCompleteContainer.style.display = 'none';
          });
        });
        selectedIndex = -1;
      } else {
        autoCompleteContainer.style.display = 'none';
      }
    });

    inputEl.addEventListener('keydown', (event) => {
      const suggestionItems = autoCompleteContainer.querySelectorAll('.suggestion-item');

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          selectItem((selectedIndex + 1) % suggestionItems.length);
          break;
        case 'ArrowUp':
          event.preventDefault();
          selectItem((selectedIndex - 1 + suggestionItems.length) % suggestionItems.length);
          break;
        case 'Enter':
          event.preventDefault();
          if (selectedIndex >= 0) {
            inputEl.value = suggestionItems[selectedIndex].textContent;
            autoCompleteContainer.style.display = 'none';
          }
          break;
        case 'Escape':
          autoCompleteContainer.style.display = 'none';
          break;
      }
    });

    inputEl.addEventListener('blur', () => {
      setTimeout(() => {
        autoCompleteContainer.style.display = 'none';
      }, 100);
    });

    inputEl.addEventListener('focus', () => {
      if (autoCompleteContainer.children.length > 0) {
        autoCompleteContainer.style.display = 'block';
        positionDropdown();
      }
    });

    // Reposition dropdown on window resize
    window.addEventListener('resize', () => {
      if (autoCompleteContainer.style.display !== 'none') {
        positionDropdown();
      }
    });
  }

  getTemplates(): string[] {
    const templateFolder = this.app.vault.getAbstractFileByPath(this.app.vault.configDir + '/templates');
    if (templateFolder instanceof TFolder) {
      return templateFolder.children
        .filter(file => file instanceof TFile)
        .map(file => file.path);
    }
    return [];
  }

  getFolders(): string[] {
    return this.app.vault.getAllLoadedFiles()
      .filter(file => file instanceof TFolder)
      .map(folder => folder.path);
  }
}