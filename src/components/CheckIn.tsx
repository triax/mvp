import { useEffect, useState } from "react";
import Game from "../models/Game";
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
            <h2>Welcome, {myself.nickname}!</h2>
            <h1>Check In</h1>
            <div>
                {games.map((game) => <div key={game.id}>
                    <div>{game.kickoff_time?.toDateString()}</div>
                    <div>{game.home_team} vs {game.visitor_team}</div>
                    <button onClick={() => checkin(game)}>この試合にチェックイン</button>
                </div>)}
            </div>
        </div>
    )
}
