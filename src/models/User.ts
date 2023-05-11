import { Model } from "jstorm/lib/browser/local";
import Game from "./Game";

export default class User extends Model {
    static override _namespace_ = "User";
    public nickname = "";
    public uuid = ""; // easy uuid
    public timestamp = 0;
    public voted: Record<string, any> = {};
    static myself(): Promise<User | null> {
        return User.find("myself");
    }
    static signin(easyid: string, nickname: string): Promise<User> {
        const myself = User.new({ nickname });
        myself._id = "myself";
        myself.timestamp = Date.now();
        myself.uuid = easyid;
        return myself.save();
    }

    hasVotedFor(game: Game | null): boolean {
        if (!game) return false;
        return !!this.voted[game.id];
    }
}

