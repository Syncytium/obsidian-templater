import { App, TFile, Notice } from 'obsidian';

export class TemplateService {
    app: App;

    constructor(app: App) {
        this.app = app;
    }

    async insertTemplate(file: TFile, templatePath: string): Promise<void> {
        // try loading path directly
        let templateFile;
        templateFile = this.app.vault.getAbstractFileByPath(templatePath);
        // if didnt work, try with .md at end
        if (!templatePath.endsWith('.md') && !(templateFile instanceof TFile)) {
            templateFile = this.app.vault.getAbstractFileByPath(templatePath + '.md');
        }

        if (templateFile instanceof TFile) {
            const templateContent = await this.app.vault.read(templateFile);
            await this.app.vault.modify(file, templateContent);
        } else {
            new Notice(`could not find ${templatePath} to insert`, 5000)
        }
    }
}

