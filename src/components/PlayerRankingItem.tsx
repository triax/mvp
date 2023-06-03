import { useNavigate } from "react-router-dom";
import { PlayerRankingEntry } from "../models/RankingEntry";

export default function PlayerRankingItem({
    entry,
    defautlIcon,
    rank,
}: {
    entry: PlayerRankingEntry
    defautlIcon?: string;
    rank: number;
}) {
    const profsize = "10vw";
    const { member, votes } = entry;
    const navigate = useNavigate();
    return (
        <div
            style={{
                marginBottom: "2px", display: "flex",
                alignItems: "center",
            }}
            onClick={() => navigate(`/_g/${entry.game.id}?q=${member.number}`)}
        >
            <div style={{width: "6vw", fontSize: "x-small", fontWeight: "bold"}}>
                <span>{rank}</span>
            </div>
            <div style={{width: profsize}}>
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
                        src={member.profile_image_url}
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
                    {member.name}
                </div>
                <div style={{ fontSize: "x-small" }}>
                    {member.number !== "" ? `#${member.number} ` : null} {member.position}
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