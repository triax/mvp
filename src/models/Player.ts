export class Player {

    public number: string;
    public first_name: string;
    public last_name: string;
    public fullname_eng: string;
    // public unique_nickname: string;
    public yomi_hiragana: string;
    public position: string;
    public comment: string;
    public profile_image_url: string;
    public optional_instagram_url?: string;
    public optional_twitter_url?: string;

    constructor(props: Record<string, any> = {}) {
        this.number = props.number;
        this.first_name = props.first_name;
        this.last_name = props.last_name;
        this.fullname_eng = props.fullname_eng;
        // this.unique_nickname = props.unique_nickname;
        this.yomi_hiragana = props.yomi_hiragana;
        this.position = props.position;
        this.comment = props.comment;
        this.profile_image_url = Player.googledrivePictureURL(props.profile_image_url);
        this.optional_instagram_url = props.optional_instagram_url;
        this.optional_twitter_url = props.optional_twitter_url;
    }

    private static googledrivePictureURL(raw: string): string {
        try {
            const url = new URL(raw);
            if (url.host.match("drive.google.com")) {
                const id = raw.split("/")[5];
                return `https://drive.google.com/uc?export=view&id=${id}`;
            }
        } catch (e) {
            return ""; // Invalid URL
        }
        return raw; // Valid URL but not Google Drive
    }

    static shuffle(players: Player[]): Player[] {
        const shuffled = players.slice();
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    get identifier(): string {
        return `${this.number} ${this.fullname_eng} ${this.position}`;
    }
}
