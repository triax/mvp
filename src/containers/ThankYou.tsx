import { onSnapshot, type CollectionReference, type DocumentData } from "firebase/firestore";
import { useEffect, useState } from "react";
import User from "../models/User";
import Game, { SupportingSide } from "../models/Game";
import Vote from "../models/Vote";
import TeamSwitchView from "../components/TeamSwitch";
import { votesToEntries } from "../models/RankingEntry";
import PlayerRankingItem from "../components/PlayerRankingItem";
import AboutView from "../components/About";

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

export default function ThankYouView({
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
    useEffect(() => {
        // FIXME: 現状、全votesを取得しているが、当試合のvotesだけ取得するようにする
        startListeningVotes(collection, game, setVotes);
    }, [collection, game]);
    const entries = votesToEntries(game, votes, (vote) => vote.side == game.supporting);
    return (
        <div>
            <div>
                {game.kickoff_time?.toDateString()}
            </div>
            <h2>MVP投票結果</h2>
            <TeamSwitchView game={game} switchTeam={switchTeam} />
            {entries.map((entry, i) => <PlayerRankingItem
                rank={i + 1}
                key={entry.player.identifier} entry={entry}
                defautlIcon={game.getDefaultIconURL(game.supporting)}
                refresh={refresh}
            />)}

            <div>
                <h3 style={{marginBottom: 0}}>ご参加ありがとうございました！</h3>
                <h3 style={{margin: 0}}>次回試合も応援よろしくお願いいたします！</h3>
                <div style={{fontSize: "xx-small"}}>{myself.uuid}</div>
            </div>
            <AboutView />
        </div>
    )
}
