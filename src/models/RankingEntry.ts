import Game from "./common/Game";
import Vote from "./common/Vote";
import Member from "./common/Member";

export interface PlayerRankingEntry {
    // 誰が
    member: Member;
    // どこで
    game: Game;
    side: "home" | "visitor";
    // 何票
    votes: Vote[];
}

export function votesToEntries(game: Game, votes: Vote[], filter: (v: Vote) => boolean): PlayerRankingEntry[] {
    return votes
        .filter(filter)
        .reduce<PlayerRankingEntry[]>((ctx, vote) => {
            for (const entry of ctx) {
                if (entry.member.id == vote.member?.id) {
                    entry.votes.push(vote);
                    return ctx;
                }
            }
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return [...ctx, { member: vote.member!, game: game, side: vote.side, votes: [vote] }]
        }, [])
        .sort((a, b) => b.votes.length - a.votes.length);
}