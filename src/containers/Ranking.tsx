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

// eslint-disable-next-line react-refresh/only-export-components
export const loader: LoaderFunction = async ({ params }) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const game = await Game.get(params.gameId!);
    const myself = await User.myself();
    const votes = await Vote.list(`games/${game?.id}/votes`);
    return { myself, game, initialVotes: votes };
};

export default function RankingView() {
    const navigate = useNavigate();
    const { myself, game, initialVotes } = useLoaderData() as { myself: User; game: Game; initialVotes: Vote[]; };
	const [side, setSide] = useState<string>(location.hash.replace("#", "") || "visitor");
	const switchSide = (side: string) => setSide(side);
    const [votes, setVotes] = useState<Vote[]>(initialVotes);
    const entries = votesToEntries(game, votes, (vote) => vote.side === side);
    const status = game.getStatus();

    const [cooltime, setCooltime] = useState<number>(myself.secondsUntilRevote());
    useEffect(() => Vote.onUpdate(setVotes, `games/${game.id}/votes`), [game]);
    useEffect(() => cooltimeRoutine(myself, setCooltime), [myself]);

	if (status == Status.FINISHED || status == Status.CLOSED) {
        return <div>
            <h2>ご声援ありがとうございました！</h2>
            <GameTitle game={game} />
            <h2 style={{ textAlign: "center" }}>~~ 最終結果 ~~</h2>
            <TeamSwitchView game={game} side={side} switchSide={switchSide} />
            {entries.map((entry, i) => <PlayerRankingItem
                rank={i + 1}
                key={entry.member.id} entry={entry}
                defautlIcon={game.getTeam(side).icon_image_url}
            />)}
            <AboutView />
        </div>;
    }

    return (
        <div>
            <div style={{textAlign: "center"}}>
                <h2>現在の投票順位</h2>
                <span style={{fontSize: "small"}}>10分に1度、<span style={{fontWeight:"bold"}}>何度でも</span>投票いただけます</span>
            </div>
            <TeamSwitchView game={game} side={side} switchSide={switchSide} />
            <div style={{margin: "16px 0"}}
                onClick={() => navigate(`/_g/${game.id}`)}
            ><button style={{width:"100%"}}>
			{myself.canVote() ? "投票する" : `${humanize(-1*cooltime)}後に投票可能`}
            </button></div>
            {entries.map((entry, i) => <PlayerRankingItem
                rank={i + 1}
                key={entry.member.id} entry={entry}
                defautlIcon={game.getTeam(side).icon_image_url}
            />)}
            <AboutView />
        </div>
    )
}
