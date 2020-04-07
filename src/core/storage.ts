interface CachedListProps {
    name: string;
    length: number;
}

interface CachedListItem {
    id: number;
}

export class CachedList {
    private readonly json: string | null;
    private _items: CachedListItem[] = [];
    private readonly name: string;
    private length: number;

    constructor(props: CachedListProps) {
        this.json = localStorage.getItem(props.name);
        this._items = this.json ? JSON.parse(this.json) : [];
        this.name = props.name;
        this.length = props.length;
    }

    has(item: CachedListItem): boolean {
        for (let i = 0; i < this._items.length; i++) {
            let cachedListItem = this._items[i];
            if (cachedListItem.id === item.id) {
                return true;
            }
        }
        return false;
    }

    add(item: CachedListItem) {
        const itemJSON = localStorage.getItem(this.name);
        let items = itemJSON ? JSON.parse(itemJSON) : [];
        if (!this.has(item)) {
            items.unshift(item);
            localStorage.setItem(this.name, JSON.stringify(items));
            this._items = items;
        }
    }

    remove(item: CachedListItem) {
        let indexToRemove = -1;
        const itemJSON = localStorage.getItem(this.name);
        let items = [];
        if (itemJSON) {
            items = JSON.parse(itemJSON);
            for (let i = 0; i < items.length; i++) {
                let currentItem = items[i];
                if (currentItem.id === item.id) {
                    indexToRemove = i;
                    break;
                }
            }
            if (indexToRemove > -1) {
                items.splice(indexToRemove, 1);
                localStorage.setItem(this.name, JSON.stringify(items));
                this._items = items;
            }
        }
    }

    public get items() {
        return this._items;
    }
}
