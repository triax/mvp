import { Player } from "../models/Player";
import { PlayerRankingEntry } from "../models/RankingEntry";

// FIXME: このコンポーネントを実装する
export default function PlayerRankingItem({
    entry,
    upvote,
}: {
    entry: PlayerRankingEntry
    upvote?: (player: Player) => void;
}) {
    const profsize = "20vw";
    return (
        <div style={{borderRadius: 4, border: "solid thin #f0f0f0", margin: "8px 0", padding: "4px"}}>
            <div style={{display: "flex"}}>
                <div style={{width: profsize}}>
                    <div

                        style={{
                            backgroundImage: `url(${entry.player.profile_image_url})`,
                            backgroundSize: "cover",
                            width: profsize,
                            height: profsize,
                            borderRadius: 4,
                            overflow: "hidden",
                        }}
                    >
                        <img

                            src={entry.player.profile_image_url}
                            style={{
                                width: profsize,
                                borderRadius: 4,
                                objectFit: "cover",
                            }}
                            onError={(e) => e.currentTarget.style.display = "none"}
                        />
                    </div>
                </div>
                <div style={{flex: 2, marginLeft: "8px"}}>
                    {/* <div>
                        {entries[0].player.number !== "" ? <span style={{}}>#{entries[0].player.number} </span> : null}
                        <span style={{fontWeight: "bold"}}>{entries[0].player.last_name} {entries[0].player.first_name} ({entries[0].player.position})</span>
                    </div>
                    <div>
                        <blockquote>{entries[0].player.comment}</blockquote>
                    </div> */}
                </div>
            </div>
            </div>
    )
}