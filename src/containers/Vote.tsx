import TeamSwitchView from "../components/TeamSwitch";
import User from "../models/User";
import { useEffect, useState } from "react";
import PlayerItem from "../components/PlayerItem";


import { default as NeuGame, Status } from "../models/common/Game";
import { default as NeuMember } from "../models/common/Member";
// import { default as NeuVote } from "../models/common/Vote";
import { useLoaderData, useNavigate, type LoaderFunction } from "react-router-dom";
import { cooltimeRoutine, shuffle } from "../utils";

export const loader: LoaderFunction = async ({ params }) => {
    const game = await NeuGame.get(params.gameId!);
    const home = await NeuMember.list(game!.home.id!);
    const visitor = await NeuMember.list(game!.visitor.id!);
    const myself = await User.myself();
    return { myself, game, players: { home, visitor } };
}

export default function VoteView() {
    const navigate = useNavigate();
    const { myself, game, players } = useLoaderData() as {
        myself: User; game: NeuGame; players: { home: NeuMember[], visitor: NeuMember[] };
    };
    const [cooltime, setCooltime] = useState<number>(myself.secondsUntilRevote());

    useEffect(() => cooltimeRoutine(myself, setCooltime), [myself]);

    const url = new URL(location.href);
    const [query, setQuery] = useState<string>(url.searchParams.get("q") || "");
    const [side, setSide] = useState<string>(location.hash.replace("#", "") || "visitor");

    //  const upvote = async (member: NeuMember) => {
    //     const vote = new NeuVote({
    //         game_id: game.id!, game,
    //         member_id: member.id!, member,
    //         side: side as "visitor"| "home",
    //         timestamp: Date.now(),
    //         uuid: myself.uuid,
    //     });
    //     await vote.insert();
    //     await myself.update({
    //         voted: { ...myself.voted, [game.id!]: true },
    //         lastVotedTimestamp: vote.timestamp,
    //     });
    //     setCooltime(myself.secondsUntilRevote());
    //     navigate(`/_g/${game.id}/_v`);
    // };

    const filter = (p: NeuMember) => {
        if (query === "") return true;
        return [p.name, p.name_eng, p.name_yomi, p.number, p.position].some((s = "") => s.includes(query));
    }
    const _s = side == "home" ? "home" : "visitor";

    const getActionableSection = () => {
        const s = game.getStatus();
        if (s == Status.CLOSED || s == Status.FINISHED) return <div style={{ display: "flex" }}>
            <button
                style={{flex: 1}}
                onClick={() => navigate(`/_g/${game.id}/_v`)}
            >結果を見る</button>
        </div>;
        if (cooltime < 0) return <div style={{ display: "flex" }}>
            <span>再投票まであと{-1 * cooltime}秒</span>
        </div>;
        return <div style={{ display: "flex" }}>
            <input type="text"
                style={{ flex: 1, fontSize: "0.8rem", height: "2rem", border: "1px solid #d0d0d0", paddingLeft: "0.4rem" }}
                placeholder="🔍 名前、背番号、ふりがな、ポジション"
                onChange={(e) => setQuery(e.target.value)}
                defaultValue={query}
            />
        </div>;
    }

    return (
        <div>
            <TeamSwitchView
                game={game}
                side={_s}
                switchSide={(side) => setSide(side)}
            />
            <div>
                {getActionableSection()}
                {shuffle(players[_s]).filter(filter).map((player) => <PlayerItem
                    key={player.id}
                    player={player}
                    defaultIcon={game[_s].icon_image_url}
                    // TODO: Dynamicにする
                    // upvote={ upvote}
                    myself={myself}
                />)}
            </div>
        </div>
    )
}