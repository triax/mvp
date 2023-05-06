import { useEffect, useState } from "react";
import Game, { GameStatus } from "../models/Game";
import User from "../models/User";

export default function CheckInView({ checkin, myself }: {
    checkin: (game: Game) => void;
    myself: User;
}) {
    const [games, setGames] = useState<Game[]>([]);
    useEffect(() => {
        const url = import.meta.env.VITE_GAMEDATA_SPREADSHEET_URL;
        (async () => setGames(await Game.fetch(url)))();
    }, []);

    return (
        <div>
            <h2>MVP投票システム</h2>
            <span>Provided by <a href="https://www.triax.football" target="_blank">Clud Triax</a></span>
            <h1>STEP 2/3:<br/>観戦中の試合にチェックインしてください</h1>
            <div>
                {games.map((game) => <div key={game.id}>
                    <div>{game.kickoff_time?.toDateString()}</div>
                    <div>{game.home_team} vs {game.visitor_team}</div>
                    <button
                        disabled={game.status != GameStatus.ACTIVE}
                        onClick={() => checkin(game)}
                    >この試合にチェックイン</button>
                </div>)}
            </div>
            <h2>{myself.nickname}</h2>
        </div>
    )
}
