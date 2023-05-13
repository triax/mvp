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

    const getButtonText = (game: Game) => {
        switch (game.status) {
            case GameStatus.ACTIVE:
                return "この試合にチェックイン";
            case GameStatus.ENDED:
                return "この試合は終了しました";
            case GameStatus.UPCOMING:
                return "この試合はまだ始まっていません";
        }
    };

    return (
        <div>
            <h2>MVP投票システム</h2>
            <span>Provided by <a href="https://www.triax.football" target="_blank">Club Triax</a></span>
            <h1>STEP 2/3:<br/>観戦中の試合にチェックインしてください</h1>
            <div>
                {games.map((game) => <div key={game.id} style={{ marginBottom: "3rem" }}>
                    <div>{game.kickoff_time?.toDateString()} {game.kickoff_time?.toLocaleTimeString()} Kickoff</div>
                    <h2 style={{ margin: 0, lineHeight: "0.8em" }}>{game.home_team}</h2>
                    <h2 style={{ textAlign: "right", lineHeight: "0.8em" }}><i>vs</i> {game.visitor_team}</h2>
                    <button
                        disabled={game.status != GameStatus.ACTIVE}
                        onClick={() => checkin(game)}
                    >{getButtonText(game)}</button>
                </div>)}
            </div>
            <h2>{myself.nickname}</h2>
        </div>
    )
}
