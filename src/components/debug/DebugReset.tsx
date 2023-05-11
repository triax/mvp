import Game from "../../models/Game";
import User from "../../models/User";

export default function DebugResetButton() {
    if (!import.meta.env.VITE_DEBUG) return <></>;
    return <button
        style={{ backgroundColor: "black", color: "white" }}
        onClick={async () => {
            await Game.drop();
            await User.drop();
            location.reload();
        }}
    >リセット</button>;
}