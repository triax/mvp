import { useEffect, useState } from "react";
import User from "../models/User";
import Game, { SupportingSide } from "../models/Game";
import { Player } from "../models/Player";
import PlayerItem from "../components/PlayerItem";
import DebugResetButton from "../components/debug/DebugReset";
import TeamSwitchView from "../components/TeamSwitch";
import LoadingIndicator from "../components/Loading";

import { CollectionReference, DocumentData } from "firebase/firestore";
import Vote from "../models/Vote";

export default function PickUpView({
    myself,
    game,
    switchTeam,
    collection,
    refresh,
}: {
    myself: User;
    game: Game;
    switchTeam: (team: SupportingSide) => void;
    collection: CollectionReference<DocumentData>;
    refresh: () => void;
}) {
    const [players, setPlayers] = useState<Player[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        setLoading(true);
        Player.fetch(game.getRosterURL(game.supporting), true).then((players) => {
            setPlayers(players);
            setLoading(false);
        });
    }, [game]);

    const upvote = async (player: Player) => {
        const vote = new Vote(myself, game, player, game.supporting);
        await vote.push(collection);
        await myself.update({
            voted: { ...myself.voted, [game.id]: true },
            lastVotedTimestamp: vote.timestamp,
        });
        refresh();
    };

    return (
        <div>
            <h2>MVP投票システム</h2>
            <span>Provided by <a href="https://www.triax.football" target="_blank">Club Triax</a></span>
            <h1>まず誰かに投票してみましょう！</h1>
            <small>※ 試合中、30秒ごとに何度でも投票できます！まずは直感で好きな選手に投票してみてください。</small>
            <TeamSwitchView game={game} switchTeam={switchTeam} />
            {loading ? <LoadingIndicator /> :  <div>
                {players.map((player) => <PlayerItem
                    key={player.fullname_eng} player={player}
                    defaultIcon={game.getDefaultIconURL(game.supporting)}
                    upvote={upvote}
                />)}
            </div>}
            {/* <h2>{myself.nickname}</h2> */}
            <DebugResetButton />
        </div>
    )
}
