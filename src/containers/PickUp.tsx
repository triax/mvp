import { useEffect, useState } from "react";
import User from "../models/User";
import Game from "../models/Game";
import { Player } from "../models/Player";
import PlayerItem from "../components/PlayerItem";

export default function PickUpView({
    myself,
    game,
}: {
    myself: User;
    game: Game;
}) {
    const [players, setPlayers] = useState<Player[]>([]);
    useEffect(() => {
        Player.fetch(game.getRosterURL(), true).then(setPlayers);
    }, []);

    return (
        <div>
            <h2>MVP投票システム</h2>
            <span>Provided by <a href="https://www.triax.football" target="_blank">Clud Triax</a></span>
            <h1>STEP 3/3:<br/>まず誰かに投票してみましょう</h1>
            <small>※ 試合中、30秒ごとに何度でも投票できます！まずは直感で好きな選手に投票してみてください。</small>
            <div>
                {players.map((player) => <PlayerItem
                    key={player.fullname_eng} player={player}
                    defaultIcon={game.getDefaultIconURL()}
                />)}
            </div>
            <h2>{myself.nickname}</h2>
        </div>
    )
}
