import { useEffect, useState } from "react";
import User from "../models/User";
import TeamSwitchView from "../components/TeamSwitch";
import { votesToEntries } from "../models/RankingEntry";
import PlayerRankingItem from "../components/PlayerRankingItem";
import { useLoaderData, useNavigate, type LoaderFunction } from "react-router-dom";
import { default as Game, Status } from "../models/common/Game";
import { default as Vote } from "../models/common/Vote";
import { cooltimeRoutine, humanize } from "../utils";
import GameTitle from "../components/GameTitle";
import AboutView from "../components/About";

export const loader: LoaderFunction = async ({ params }) => {
    const game = await Game.get(params.gameId!);
    const myself = await User.myself();
    const votes = await Vote.list(`games/${game!.id!}/votes`);
    return { myself, game, initialVotes: votes };
};

export default function RankingView() {
    const navigate = useNavigate();
    const { myself, game, initialVotes } = useLoaderData() as { myself: User; game: Game; initialVotes: Vote[]; };
    const [votes, setVotes] = useState<Vote[]>(initialVotes);
    const [cooltime, setCooltime] = useState<number>(myself.secondsUntilRevote());
    const [side, setSide] = useState<string>(location.hash.replace("#", "") || "visitor");
    const switchSide = (side: string) => setSide(side)

    useEffect(() => Vote.onUpdate(setVotes, `games/${game.id}/votes`), [game]);
    useEffect(() => cooltimeRoutine(myself, setCooltime), [myself]);

    const entries = votesToEntries(game, votes, (vote) => vote.side === side);


    const status = game.getStatus();

    const getActionableSection = () => {
        if (status == Status.CLOSED || status == Status.FINISHED) return <div>
        </div>;
        if (myself.canVote()) return <button style={{ width: "100%" }}>
            投票する
        </button>;
        return <button style={{ width: "100%" }} disabled>
            {humanize(-1 * cooltime)}後に投票可能
        </button>;
    }



    return (
        <div>
            {(status == Status.FINISHED || status == Status.CLOSED) ? <>
                <h2>ご声援ありがとうございました！</h2>
                <GameTitle game={game} />
                <h2 style={{textAlign: "center"}}>~~ 最終結果 ~~</h2>
            </> : <h2>現在の投票順位</h2>}
            <TeamSwitchView game={game} side={side} switchSide={switchSide} />
            <div style={{margin: "16px 0"}}
                onClick={() => navigate(`/_g/${game.id}`)}
            >{getActionableSection()}</div>
            {entries.map((entry, i) => <PlayerRankingItem
                rank={i + 1}
                key={entry.member.id} entry={entry}
                defautlIcon={game.getTeam(side).icon_image_url}
            />)}
            <AboutView />
        </div>
    )
}
