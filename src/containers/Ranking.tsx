import { onSnapshot, type CollectionReference, type DocumentData } from "firebase/firestore";
import { useEffect, useState } from "react";
import User from "../models/User";
import Game, { SupportingSide } from "../models/Game";
import Vote from "../models/Vote";
import TeamSwitchView from "../components/TeamSwitch";
import { votesToEntries } from "../models/RankingEntry";
import PlayerRankingItem from "../components/PlayerRankingItem";

function startListeningVotes(
    ref: CollectionReference<DocumentData>,
    _: Game,
    update: (votes: Vote[]) => void,
) {
    onSnapshot(ref, (querySnapshot) => {
        const votes: Vote[] = [];
        querySnapshot.forEach((doc) => {
            votes.push(Vote.decode({ ...doc.data(), id: doc.id }));
        });
        update(votes);
    });
}

export default function RankingView({
    // signout,
    collection,
    myself,
    game,
    switchTeam,
    refresh,
}: {
    // signout: () => void;
    collection: CollectionReference<DocumentData>;
    switchTeam: (team: SupportingSide) => void;
    myself: User,
    game: Game,
    refresh: () => void;
}) {
    const [votes, setVotes] = useState<Vote[]>([]);
    const [cooltime, setCooltime] = useState<number>(myself.secondsUntilRevote());
    useEffect(() => {
        // FIXME: 現状、全votesを取得しているが、当試合のvotesだけ取得するようにする
        startListeningVotes(collection, game, setVotes);
    }, [collection, game]);
    useEffect(() => {
        const timer = setInterval(() => {
            setCooltime(myself.secondsUntilRevote());
        }, 1000);
        return () => clearInterval(timer);
    }, [myself]);
    const entries = votesToEntries(game, votes, (vote) => vote.side == game.supporting);
    return (
        <div>
            <h2>現在の投票順位</h2>
            <TeamSwitchView game={game} switchTeam={switchTeam} />
            {entries.map((entry) => <PlayerRankingItem
                key={entry.player.identifier} entry={entry}
                defautlIcon={game.getDefaultIconURL(game.supporting)}
            />)}
            <div>
                {myself.canVote() ? <button style={{ width: "100%" }}
                    onClick={() => {
                        location.replace("#vote")
                        setTimeout(refresh);
                    }}
                >
                    投票する
                </button> : <button style={{ width: "100%" }} disabled>
                    {-1 * cooltime}秒後に投票可能
                </button>}
            </div>
        </div>
    )
}
