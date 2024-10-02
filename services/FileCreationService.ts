import { App, TFile, Notice } from 'obsidian';
import { Item } from '../models/Item';
import { formatDate } from '../utils/dateUtils';

export class FileCreationService {
  app: App;

  constructor(app: App) {
    this.app = app;
  }

  async createDatedFile(item: Item): Promise<TFile | null> {
    const fileName = formatDate(new Date(), item.filePattern);
    let filePath = `${item.location}/${fileName}`;
    if (!filePath.endsWith('.md')) {
      filePath = filePath + '.md'
    }

    try {
      await this.ensureDirectoryExists(filePath);
      return await this.app.vault.create(filePath, '');

    } catch (error) {
      const errMsg = `Error creating file ${filePath}: ${error}`;
      console.error(errMsg);
      new Notice(errMsg, 5000);
      return null;
    }
  }

  async ensureDirectoryExists(filePath: string): Promise<void> {
    const dirPath = filePath.substring(0, filePath.lastIndexOf('/'));
    if (dirPath) {
      try {
        await this.app.vault.createFolder(dirPath);
      } catch (error) {
        // Ignore errors if the folder already exists
        if (error.message.toLowerCase().indexOf('already exists') === -1) {
          throw error;
        }
      }
    }
  }
}
