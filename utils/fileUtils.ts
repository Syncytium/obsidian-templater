import { App, TFolder, TFile } from 'obsidian';

export function getFolders(app: App): string[] {
  return app.vault.getAllLoadedFiles()
    .filter(file => file instanceof TFolder)
    .map(folder => folder.path);
}

export function getTemplates(app: App): string[] {
  const templateFolder = app.vault.getAbstractFileByPath(app.vault.configDir + '/templates');
  if (templateFolder instanceof TFolder) {
    return templateFolder.children
      .filter(file => file instanceof TFile)
      .map(file => file.path);
  }
  return [];
}