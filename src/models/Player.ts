
export class Player {

    public number: string;
    public first_name: string;
    public last_name: string;
    public fullname_eng: string;
    public unique_nickname: string;
    public position: string;
    public comment: string;
    public profile_image: string;
    public optional_instagram_url?: string;
    public optional_twitter_url?: string;

    constructor(props: Record<string, any> = {}) {
        this.number = props.number;
        this.first_name = props.first_name;
        this.last_name = props.last_name;
        this.fullname_eng = props.fullname_eng;
        this.unique_nickname = props.unique_nickname;
        this.position = props.position;
        this.comment = props.comment;
        this.profile_image = Player.googledrivePictureURL(props.googledrive_sharable_picture_url);
        this.optional_instagram_url = props.optional_instagram_url;
        this.optional_twitter_url = props.optional_twitter_url;
    }

    private static googledrivePictureURL(raw: string): string {
        const id = raw.split("/")[5]; // /view?usp=sharingの場合はこれで正しい
        return `https://drive.google.com/uc?export=view&id=${id}`;
    }

    static async fetch(spreadsheetURL: string): Promise<Player[]> {
        const response = await fetch(spreadsheetURL);
        const text = await response.text();
        const lines = text.split("\n").map(v => v.trim());
        const headers = lines[0].split(",").map(col => col.trim());
        return lines.slice(1).map(line => {
            const values = line.split(",").map(v => v.trim());
            const obj: Record<string, any> = {};
            for (let i = 0; i < headers.length; i++) {
                obj[headers[i]] = values[i];
            }
            return new Player(obj);
        });
    }
}