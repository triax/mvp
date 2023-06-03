import "./index.css";

import { default as NeuGame } from "../../models/common/Game";

export default function TeamSwitchView({
    game,
    side,
    switchSide,
}: {
    game: NeuGame;
    side: string;
    switchSide: (side: string) => void;
}) {
    return <div className="team-switcher">
        <div className={"team-item " + (side == "home" ? "selected" : "")}
            onClick={() => switchSide("home")}
        >
            <div className="team-name">{game.home.name}</div>
            <div className="team-icon" style={{ backgroundImage: `url(${game.home.icon_image_url})` }}></div>
        </div>
        <div className={"team-item " + (side == "visitor" ? "selected" : "")}
            onClick={() => switchSide("visitor")}
        >
            <div className="team-name">{game.visitor.name}</div>
            <div className="team-icon" style={{ backgroundImage: `url(${game.visitor.icon_image_url})` }}></div>
        </div>
    </div>
}