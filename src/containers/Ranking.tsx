import { useEffect, useState } from "react";
import User from "../models/User";
import TeamSwitchView from "../components/TeamSwitch";
import { votesToEntries } from "../models/RankingEntry";
import PlayerRankingItem from "../components/PlayerRankingItem";
import { useLoaderData, useNavigate, type LoaderFunction } from "react-router-dom";
import { default as Game } from "../models/common/Game";
import { default as Vote } from "../models/common/Vote";
import { cooltimeRoutine } from "../utils";

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

    return (
        <div>
            <h2>現在の投票順位</h2>
            <TeamSwitchView game={game} side={side} switchSide={switchSide} />
            <div style={{margin: "16px 0"}}
                onClick={() => navigate(`/_g/${game.id}`)}
            >
                {myself.canVote() ? <button style={{ width: "100%" }}>
                    投票する
                </button> : <button style={{ width: "100%" }} disabled>
                    {-1 * cooltime}秒後に投票可能
                </button>}
            </div>
            {entries.map((entry, i) => <PlayerRankingItem
                rank={i + 1}
                key={entry.member.id} entry={entry}
                defautlIcon={game.getTeam(side).icon_image_url}
            />)}
            <div style={{marginTop: "16px"}}>
                <a style={{fontSize: "x-small"}} href="https://www.triax.football/about/mvp-system" target="_blank">
                    リアルタイム投票システムについて https://www.triax.football/about/mvp-system
                </a>
            </div>
        </div>
    )
}
