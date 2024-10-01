import { App, FuzzySuggestModal } from 'obsidian';
import { Item } from '../models/Item';

export class ItemSelector extends FuzzySuggestModal<Item> {
  items: Item[];
  onSelectItem: (item: Item) => void;

  constructor(app: App, items: Item[], onSelectItem: (item: Item) => void) {
    super(app);
    this.items = items;
    this.onSelectItem = onSelectItem;
  }

  getItems(): Item[] {
    return this.items;
  }

  getItemText(item: Item): string {
    return `${item.template} (${item.location})`;
  }

  onChooseItem(item: Item, evt: MouseEvent | KeyboardEvent): void {
    this.onSelectItem(item);
  }
}