import { Model } from "jstorm/lib/browser/local";
import Game from "./Game";

export default class User extends Model {
    static override _namespace_ = "User";
    public nickname = "";
    public timestamp = 0;
    public voted: Record<string, any> = {};
    static myself(): Promise<User | null> {
        return User.find("myself");
    }
    static signin(nickname: string): Promise<User> {
        const myself = User.new({ nickname });
        myself._id = "myself";
        myself.timestamp = Date.now();
        return myself.save();
    }

    hasVotedFor(game: Game): boolean {
        return !!this.voted[game.id];
    }
}

