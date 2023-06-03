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