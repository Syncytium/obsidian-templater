import { App, TFile } from 'obsidian';

export class TemplateService {
  app: App;

  constructor(app: App) {
    this.app = app;
  }

  async insertTemplate(file: TFile, templatePath: string): Promise<void> {
    const templateFile = this.app.vault.getAbstractFileByPath(templatePath);
    if (templateFile instanceof TFile) {
      const templateContent = await this.app.vault.read(templateFile);
      await this.app.vault.modify(file, templateContent);
    }
  }
}