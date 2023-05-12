import { CollectionReference, DocumentData, addDoc } from "firebase/firestore";
import Game, { SupportingSide } from "./Game";
import User from "./User";
import { Player } from "./Player";

export default class Vote {
    id: string;
    user: User;
    game: Game;
    player: Player;
    timestamp: number;

    side: SupportingSide;

    constructor(
        user: User,
        game: Game,
        player: Player,
        side: SupportingSide,
        id = "", timestamp = Date.now(),
    ) {
        this.id = id;
        this.timestamp = timestamp;
        this.user = user;
        this.game = game;
        this.player = player;
        this.side = side;
    }

    public encode(): Record<string, any> {
        return {
            // id: this.id,
            timestamp: this.timestamp,
            side: this.side,
            user: {
                uuid: this.user.uuid,
                nickname: this.user.nickname,
                timestamp: this.user.timestamp,
            },
            game: {
                id: this.game.id,
                home: this.game.home_team,
                visitor: this.game.visitor_team,
                date: this.game.kickoff_time,
            },
            player: {
                first_name: this.player.first_name,
                last_name: this.player.last_name,
                fullname_eng: this.player.fullname_eng,
                position: this.player.position,
                number: this.player.number,
                yomi_hiragana: this.player.yomi_hiragana,
                profile_image_url: this.player.profile_image_url,
            },
        }
    }

    public static decode(data: Record<string, any>): Vote {
        // User
        const user = new User();
        user.uuid = data.user.uuid;
        user.nickname = data.user.nickname;
        user.timestamp = data.user.timestamp;
        // Game
        const game = new Game();
        game.id = data.game.id;
        game.home_team = data.game.home;
        game.visitor_team = data.game.visitor;
        game.kickoff_time = data.game.date;
        // Player
        const player = new Player();
        player.first_name = data.player.first_name;
        player.last_name = data.player.last_name;
        player.fullname_eng = data.player.fullname_eng;
        player.position = data.player.position;
        player.number = data.player.number;
        player.yomi_hiragana = data.player.yomi_hiragana;
        player.profile_image_url = data.player.profile_image_url;
        // Vote
        return new Vote(user, game, player, data.side, data.id, data.timestamp);
    }

    async push(collection: CollectionReference<DocumentData>): Promise<Vote> {
        const ref = await addDoc(collection, this.encode());
        this.id = ref.id;
        return this;
    }
}