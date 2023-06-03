import Game from "../models/common/Game";

export default function GameTitle({ game, venu = false }: { game: Game, venu?: boolean; }) {
    return <>
        <h2 style={{ margin: 0, lineHeight: "0.8em" }}>{game.home.name}</h2>
        <h2 style={{ textAlign: "right", lineHeight: "0.8em" }}><i>vs</i> {game.visitor.name}</h2>
        {venu ? <div style={{ textAlign: "center", fontSize: "0.8rem" }}>{game.venue}</div> : null}
    </>
}