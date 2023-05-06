import { Model, Types } from "jstorm/lib/browser/local";

export enum GameStatus {
    UPCOMING = "upcoming",
    ACTIVE = "active",
    ENDED = "ended",
    UNKOWN = "unknown",
}

export default class Game extends Model {
    static override _namespace_ = "Game";
    public static current(): Promise<Game | null> {
        return Game.find("current");
    }
    public static async checkin(game: Game): Promise<Game> {
        game._id = "current";
        return await game.save();
    }

    public static async fetch(spreadsheetURL: string): Promise<Game[]> {
        const response = await fetch(spreadsheetURL);
        const text = await response.text();
        const lines = text.split("\n");
        const headers = lines[0].split(",").map(col => col.trim());
        return lines.slice(1).map((line) => {
            const values = line.split(",").map(val => val.trim());
            const obj: any = {};
            for (let i = 0; i < headers.length; i++) {
                obj[headers[i]] = values[i];
            }
            return Game.new({
                ...obj,
                kickoff_time: new Date(obj.date + " " + obj.kickoff_time),
                gameset_time: new Date(obj.date + " " + obj.gameset_time),
            });
        });
    }

    id = "";
    status = GameStatus.UNKOWN;
    kickoff_time?: Date;
    gameset_time?: Date;
    home_team = "";
    visitor_team = "";
    venue = "";
    home_team_roster_url = "";
    visitor_team_roster_url = "";

    // とりあえず、TRIAXがvisitorなのでvisitorを返す
    supporting = "visitor";

    static override schema = {
        kickoff_time: Types.date,
        gameset_time: Types.date,
    }

    public getRosterURL(team = this.supporting): string {
        switch (team) {
            case "home":
                return this.home_team_roster_url;
            case "visitor":
                return this.visitor_team_roster_url;
            default:
                return this.visitor_team_roster_url;
        }
    }
}
