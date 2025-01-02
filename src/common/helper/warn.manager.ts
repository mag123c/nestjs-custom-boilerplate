export class WarnManager {
    private readonly warnLogCount: Map<string, number> = new Map();

    constructor(
        private readonly warnThreshold: number,
        private readonly interval: number,
    ) {
        setInterval(() => this.resetWarnLogCount(), this.interval);
    }

    increment(url: string): boolean {
        const currentCount = this.warnLogCount.get(url) ?? 0;
        this.warnLogCount.set(url, currentCount + 1);

        return currentCount + 1 >= this.warnThreshold;
    }

    resetWarnLogCount(): void {
        this.warnLogCount.clear();
    }

    get warnLogCounts(): Map<string, number> {
        return this.warnLogCount;
    }

    get threshold(): number {
        return this.warnThreshold;
    }

    get cleanupInterval(): number {
        return this.interval;
    }
}
