import Game, { SupportingSide } from "../../models/Game";
import "./index.css";

export default function TeamSwitchView({
    game,
    switchTeam,
}: {
    game: Game;
    switchTeam: (team: SupportingSide) => void;
}) {
    return <div className="team-switcher">
        <div className={"team-item " + (game.supporting == SupportingSide.HOME ? "selected" : "")}
            onClick={() => switchTeam(SupportingSide.HOME)}>
            <div className="team-name">{game.home_team}</div>
            <div className="team-icon" style={{ backgroundImage: `url(${game.home_team_default_icon})` }}></div>
        </div>
        <div className={"team-item " + (game.supporting == SupportingSide.VISITOR ? "selected" : "")}
            onClick={() => switchTeam(SupportingSide.VISITOR)}>
            <div className="team-name">{game.visitor_team}</div>
            <div className="team-icon" style={{ backgroundImage: `url(${game.visitor_team_default_icon})` }}></div>
        </div>
    </div>
}