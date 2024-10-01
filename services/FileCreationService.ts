import { App, TFile } from 'obsidian';
import { Item } from '../models/Item';
import { formatDate } from '../utils/dateUtils';

export class FileCreationService {
  app: App;

  constructor(app: App) {
    this.app = app;
  }

  async createDatedFile(item: Item): Promise<TFile | null> {
    const fileName = formatDate(new Date(), item.filePattern);
    const filePath = `${item.location}/${fileName}.md`;

    try {
      return await this.app.vault.create(filePath, '');
    } catch (error) {
      console.error('Error creating file:', error);
      return null;
    }
  }
}