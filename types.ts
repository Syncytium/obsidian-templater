export interface DateFolderPair {
    template: string;
    folder: string;
}

export interface DateFolderPluginSettings {
    pairs: DateFolderPair[];
}

export const DEFAULT_SETTINGS: DateFolderPluginSettings = {
    pairs: []
}

