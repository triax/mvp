import { Model, Types } from "jstorm/lib/browser/local";

export enum GameStatus {
    UPCOMING = "upcoming",
    ACTIVE = "active",
    ENDED = "ended",
    UNKOWN = "unknown",
}

export enum SupportingSide {
    HOME = "home",
    VISITOR = "visitor",
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

    public static async fetch(spreadsheetURL: string = import.meta.env.VITE_GAMEDATA_SPREADSHEET_URL): Promise<Game[]> {
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
    venue = "";
    home_team = "";
    home_team_roster_url = "";
    home_team_default_icon = "";
    visitor_team = "";
    visitor_team_roster_url = "";
    visitor_team_default_icon = "";

    // とりあえず、TRIAXがvisitorなのでvisitorを返す
    supporting = SupportingSide.VISITOR;

    static override schema = {
        kickoff_time: Types.date,
        gameset_time: Types.date,
    }

    public getRosterURL(team = SupportingSide.VISITOR): string {
        switch (team) {
            case "home":
                return this.home_team_roster_url;
            case "visitor":
                return this.visitor_team_roster_url;
            default:
                return this.visitor_team_roster_url;
        }
    }
    public getDefaultIconURL(team = SupportingSide.VISITOR): string {
        switch (team) {
            case "home":
                return this.home_team_default_icon;
            case "visitor":
                return this.visitor_team_default_icon;
            default:
                return this.visitor_team_default_icon;
        }
    }

    isReadyForVote(offsetHours = 1): boolean {
        if (this.status !== GameStatus.ACTIVE) return false;
        if (!this.kickoff_time) return false;
        const offset = (1000 * 60 * 60 * offsetHours)
        return (this.kickoff_time?.getTime() <= (Date.now() + offset));
    }
}
