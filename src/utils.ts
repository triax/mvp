import User from "./models/User";

export function cooltimeRoutine(myself: User, setCooltime: (t: number) => void) {
    const timer = setInterval(() => {
        const t = myself.secondsUntilRevote();
        (t > 0) ? clearInterval(timer) : setCooltime(t);
    }, 1000);
    return () => clearInterval(timer);
}

export function shuffle<T>(entries: T[]): T[] {
    const shuffled = entries.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

export function humanize(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    // 0埋め
    const pad = (n: number) => n.toString().padStart(2, "0");
    // h,m,sのうち、最初に0でないものから表示する
    if (h > 0) {
        return `${h}時間${pad(m)}分${pad(s)}秒`;
    }
    if (m > 0) {
        return `${m}分${pad(s)}秒`;
    }
    return `${s}秒`;
}
