import { Base } from "./base";
import Game, { GameProps } from "./Game";
import Member, { MemberProps } from "./Member";

interface VoteProps {
    id?: string;
    game_id: string;
    game?: GameProps | Game;
    member_id: string;
    member?: MemberProps | Member;
    side: "home" | "visitor";
    timestamp: number;
    uuid: string; // of the user
}

export default class Vote extends Base {
    game_id: string;
    game?: Game;
    member_id: string;
    member?: Member;
    side: "home" | "visitor" = "visitor";
    timestamp: number = Date.now();
    uuid: string;

    constructor(props: VoteProps) {
        super(props.id);
        this.game_id = props.game_id;
        this.game = props.game ? (props.game instanceof Game ? props.game : new Game(props.game)) : undefined;
        this.member_id = props.member_id;
        this.member = props.member ? (props.member instanceof Member ? props.member : new Member(props.member)) : undefined;
        this.side = props.side;
        this.timestamp = props.timestamp;
        this.uuid = props.uuid;
    }

    encode(): VoteProps {
        return {
            ...(this.id ? { id: this.id } : {}),
            game_id: this.game_id,
            // game: this.game ? this.game.encode() : undefined,
            member_id: this.member_id,
            member: this.member ? this.member.encode() : undefined,
            side: this.side,
            timestamp: this.timestamp,
            uuid: this.uuid,
        };
    }


    async insert(): Promise<Vote> {
        if (this.id) throw Error("id must be null");
        return await super.upsert<Vote>(`games/${this.game_id}/votes`);
    }
}