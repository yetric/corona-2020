export class DataClient {
    private base: string;
    constructor(basePath: string) {
        this.base = basePath;
    }

    async getJSON(path: string) {
        let response = await fetch(this.base + path);
        return await response.json();
    }
}