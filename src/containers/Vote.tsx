import { CollectionReference, DocumentData } from "firebase/firestore";
import TeamSwitchView from "../components/TeamSwitch";
import Game, { SupportingSide } from "../models/Game";
import { Player } from "../models/Player";
import User from "../models/User";
import Vote from "../models/Vote";
import { useEffect, useState } from "react";
import LoadingIndicator from "../components/Loading";
import PlayerItem from "../components/PlayerItem";

export default function VoteView({
    myself,
    game,
    collection,
    switchTeam,
}: {
    myself: User,
    game: Game,
    collection: CollectionReference<DocumentData>,
    switchTeam: (team: SupportingSide) => void,
}) {
    const [cooltime, setCooltime] = useState<number>(myself.secondsUntilRevote());
    const [players, setPlayers] = useState<Player[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [query, setQuery] = useState<string>("");

    useEffect(() => {
        setLoading(true);
        Player.fetch(game.getRosterURL(game.supporting), true).then((players) => {
            setPlayers(players);
            setLoading(false);
        });
    }, [game]);
    useEffect(() => {
        const timer = setInterval(() => {
            setCooltime(myself.secondsUntilRevote());
        }, 1000);
        return () => clearInterval(timer);
    }, [myself]);
     const upvote = async (player: Player) => {
        const vote = new Vote(myself, game, player, game.supporting);
        await vote.push(collection);
        await myself.update({
            voted: { ...myself.voted, [game.id]: true },
            lastVotedTimestamp: vote.timestamp,
        });
        location.replace("/");
    };

    const filter = (p: Player) => {
        if (query === "") return true;
        return [p.first_name, p.last_name, p.fullname_eng, p.yomi_hiragana, p.number, p.position].some((s) => s.includes(query));
    }

    return (
        <div>
            <TeamSwitchView
                game={game}
                switchTeam={switchTeam}
            />
            {loading ? <LoadingIndicator /> : <div>
                {cooltime < 0 ? <div style={{ display: "flex" }}>
                    <span>再投票まであと{-1 * cooltime}秒</span>
                </div> : <div style={{ display: "flex" }}>
                    <input type="text"
                        style={{ flex: 1, fontSize: "0.8rem", height: "2rem", border: "1px solid #d0d0d0" }}
                        placeholder=" 🔍 名前、背番号、ふりがな、ポジション"
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>}
                {players.filter(filter).map((player) => <PlayerItem
                    key={player.identifier}
                    player={player}
                    defaultIcon={game.getDefaultIconURL(game.supporting)}
                    upvote={upvote}
                    myself={myself}
                />)}
            </div>}
        </div>
    )
}