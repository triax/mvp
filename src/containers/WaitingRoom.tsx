import { useEffect, useState } from "react";
import Game from "../models/Game";

import AboutView from "../components/About";

function secondsToHumanReadable(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    // 0埋め
    const pad = (n: number) => n.toString().padStart(2, "0");
    // h,m,sのうち、最初に0でないものから表示する
    if (h > 0) {
        return `${h}時間${pad(m)}分${pad(s)}秒`;
    }
    if (m > 0) {
        return `${m}分${pad(s)}秒`;
    }
    return `${s}秒`;
}

export default function WaitingRoomView({
    upcoming,
}: {
    upcoming: Game;
}) {
    const diff = upcoming.kickoff_time!.getTime() - Date.now();
    const [secondsToStart, setSecondsToStart] = useState<number>(diff);
    useEffect(() => {
        const interval = setInterval(() => {
            const diff = upcoming.kickoff_time!.getTime() - Date.now();
            setSecondsToStart(Math.floor(diff / 1000));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return <div>
        <h2>試合開始をお待ちください...</h2>
        <h2 style={{marginBottom: 0, lineHeight: "1rem"}}>
            <img src={upcoming.home_team_default_icon} style={{ height: "1.8rem", marginRight: "0.5rem" }} />
            {upcoming.home_team}
        </h2>
        <h2 style={{ margin: 0, textAlign: "right" }}>
            vs
            {upcoming.visitor_team}
            <img src={upcoming.visitor_team_default_icon} style={{ height: "1.8rem", marginLeft: "0.5rem" }} />
        </h2>
        <span>{upcoming.kickoff_time?.toLocaleTimeString()} Kickoff</span>
        <h2>キックオフまで {secondsToHumanReadable(secondsToStart)}</h2>

        <AboutView />
    </div>;
}