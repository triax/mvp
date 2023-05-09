import { Player } from "../models/Player";

export default function PlayerItem({
    player,
    defaultIcon,
}: {
    player: Player;
    defaultIcon: string;
}) {
    const profsize = "20vw";
    return (
        <div style={{borderRadius: 4, border: "solid thin #f0f0f0", margin: "8px 0", padding: "4px"}}>
           <div style={{display: "flex"}}>
                <div style={{width: profsize}}>
                    <div
                        style={{
                            backgroundImage: `url(${defaultIcon})`,
                            backgroundSize: "cover",
                            width: profsize,
                            height: profsize,
                            borderRadius: 4,
                            overflow: "hidden",
                        }}
                    >
                        <img
                            src={player.profile_image}
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
                    <div>
                        {player.number !== "" ? <span style={{}}>#{player.number} </span> : null}
                        <span style={{fontWeight: "bold"}}>{player.last_name} {player.first_name} ({player.position})</span>
                    </div>
                    <div>
                        <blockquote>{player.comment}</blockquote>
                    </div>
                </div>
            </div>
            <div>
                <button style={{width: "100%", height: "40px", borderRadius: 4, border: "solid thin #f0f0f0", marginTop: "8px"}}>
                    投票する ★+1
                </button>
            </div>
        </div>
    );
}