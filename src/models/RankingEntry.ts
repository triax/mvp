import Game, { SupportingSide } from "./Game";
import { Player } from "./Player";
import Vote from "./Vote";

export interface PlayerRankingEntry {
    // 誰が
    player: Player;
    // どこで
    game: Game;
    side: SupportingSide;
    // 何票
    votes: Vote[];
}

export function votesToEntries(game: Game, votes: Vote[], filter: (v: Vote) => boolean): PlayerRankingEntry[] {
    return votes
        .filter(filter)
        .reduce<PlayerRankingEntry[]>((ctx, vote) => {
            for (const entry of ctx) {
                if (entry.player.identifier == vote.player.identifier) {
                    entry.votes.push(vote);
                    return ctx;
                }
            }
            return [...ctx, { player: vote.player, game: game, side: vote.side, votes: [vote] }]
        }, [])
        .sort((a, b) => b.votes.length - a.votes.length);
}