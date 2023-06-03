import { useNavigate } from "react-router";
import Game, { Status } from "../../models/common/Game";
import { useEffect, useState } from "react";
import { humanize } from "../../utils";
import GameTitle from "../GameTitle";

const getButtonText = (game: Game) => {
    switch (game.getStatus()) {
        case Status.STANDBY:
        case Status.DRAFT:
            return "この試合はまだ始まっていません";
        case Status.ONGOING:
            return "この試合に参加する";
        case Status.FINISHED:
        case Status.CLOSED:
            return "この試合は終了しました";
    }
};

function GameCountDown({game} : {game: Game}) {
    const secKickoff = Math.floor(game.kick_off.getTime() / 1000);
    const [remaining, setRemaining] = useState<number>(game.secondsToCheckIn());
    useEffect(() => {
        const t = setInterval(() => setRemaining(game.secondsToCheckIn()), 1000);
        return () => clearInterval(t);
    }, [secKickoff]);
    return <div style={{textAlign: "center", marginTop: "0.5rem"}}>
        <div style={{fontSize: "0.8rem"}}>{humanize(remaining)}後に参加が可能になります</div>
    </div>;
}

export default function GameItem({game} : {game: Game}) {
    const navigate = useNavigate();
    return <div key={game.id}
        style={{
            marginBottom: "3rem", border: "1px solid #ccc", borderRadius: "0.5rem", padding: "0.5rem 1rem",
        }}
    >
        <div>{game.kick_off?.toDateString()} {game.kick_off?.toLocaleTimeString()} Kickoff</div>
        <GameTitle game={game} />
        <button style={{padding: "0.4rem 1.2rem", marginTop: "0.5rem", width: "100%"}}
            disabled={game.getStatus() != Status.ONGOING}
            onClick={() => navigate(`/_g/${game.id}`)}
        >{getButtonText(game)}</button>
        {game.getStatus() == Status.STANDBY ? <GameCountDown game={game} /> : null}
    </div>;
}