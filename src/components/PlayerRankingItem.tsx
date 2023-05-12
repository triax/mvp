import { Player } from "../models/Player";
import { PlayerRankingEntry } from "../models/RankingEntry";

export default function PlayerRankingItem({
    entry,
    // upvote,
    defautlIcon,
    rank,
    refresh,
}: {
    entry: PlayerRankingEntry
    upvote?: (player: Player) => void;
    defautlIcon: string;
    rank: number;
    refresh: () => void;
}) {
    const profsize = "10vw";
    const { player, votes } = entry;
    return (
        <div
            style={{
                marginBottom: "2px", display: "flex",
                alignItems: "center",
            }}
        >
            <div style={{width: "6vw", fontSize: "x-small", fontWeight: "bold"}}>
                <span>{rank}</span>
            </div>
            <div style={{width: profsize}}
                onClick={() => {
                    location.replace(`?q=${player.number}#vote`)
                    setTimeout(refresh);
                }}
            >
                <div
                    style={{
                        backgroundImage: `url(${defautlIcon})`,
                        backgroundSize: "cover",
                        width: profsize,
                        height: profsize,
                        borderRadius: 1,
                        overflow: "hidden",
                    }}
                >
                    <img
                        src={player.profile_image_url}
                        style={{
                            width: profsize,
                            borderRadius: 1,
                            objectFit: "cover",
                        }}
                        onError={(e) => e.currentTarget.style.display = "none"}
                    />
                </div>
            </div>
            <div
                style={{
                    flex: "1 1",
                    marginLeft: "8px",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <div style={{ fontSize: "x-small" }}>
                    {player.last_name} {player.first_name}
                </div>
                <div style={{ fontSize: "x-small" }}>
                    {player.number !== "" ? `#${player.number} ` : null} {player.position}
                </div>
            </div>
            <div style={{ flex: "3 3", display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: "xx-small", width: "100%", display: "flex", flexWrap: "wrap"  }}>
                    {(new Array(votes.length)).fill(0).map((_, i) => <div key={i}>⭐️</div>)}
                    <span style={{ fontSize: "xx-small", marginLeft: "2px" }}>{votes.length}票</span>
                </div>
            </div>
        </div>
    )
}