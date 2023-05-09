import { onSnapshot, type CollectionReference, type DocumentData } from "firebase/firestore";
import { useEffect, useState } from "react";
import User from "../models/User";
import Game from "../models/Game";
import { Player } from "../models/Player";

function startListeningVotes(
    ref: CollectionReference<DocumentData>,
    update: (votes: any[]) => void,
) {
    onSnapshot(ref, (querySnapshot) => {
        const data: any[] = [];
        querySnapshot.forEach((doc) => {
            data.push({ id: doc.id, data: doc.data() });
        });
        update(data);
    });
}

function PlayerRow({ player }: {
    player: Player,
}) {
    return (
        <div style={{ display: "flex" }}>
            <div style={{flex: 1}}>
                <div style={{
                    width: "40%", height: "80px",
                    backgroundImage: `url(${player.profile_image})`,
                    backgroundSize: "cover",
                }}></div>
            </div>
        </div>
    );
}

export default function RankingView({
    signout,
    collection,
    myself,
    game,
}: {
    signout: () => void;
    collection: CollectionReference<DocumentData>;
    myself: User,
    game: Game,
}) {
    const [votes, setVotes] = useState<any[]>([]);
    const [players, setPlayers] = useState<Player[]>([]);
    useEffect(() => {
        startListeningVotes(collection, setVotes);
        Player.fetch(game.getRosterURL()).then(setPlayers);
    }, []);
    console.log(votes, myself, game);
    return (
        <div>
            <h1>Ranking</h1>
            <div>
                {players.map((player) => <PlayerRow key={player.fullname_eng} player={player} />)}
            </div>
            <button onClick={signout}>Sign Out</button>
        </div>
    )
}
