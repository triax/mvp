import { Base } from "./base";

export interface MemberProps {
    id?: string;
    name: string;
    name_yomi: string;
    name_eng: string;
    team_id: string;
    number?: string;
    position?: string;
    profile_image_url?: string;
    comment?: string;
    social?: { twitter?: string; instagram?: string; };
}

export default class Member extends Base {

    name: string;
    name_yomi: string;
    name_eng: string;
    team_id: string;
    number?: string; // 67/94などダブルナンバーがある
    position?: string;
    profile_image_url?: string;
    comment?: string;
    social?: {
        twitter?: string;
        instagram?: string;
    }

    constructor(props: MemberProps) {
        super(props.id);
        this.name = props.name;
        this.name_yomi = props.name_yomi;
        this.name_eng  = props.name_eng;
        this.team_id   = props.team_id;
        this.number    = props.number;
        this.position  = props.position;
        this.comment   = props.comment;

        // FIXME: Cloudflare Images の URL は /small で終わるvariantの可能性があり,
        //        それを /public に置換する.
        //        variant管理むずかしい. べスプラを知りたい.
        //        せめてvariantが配列じゃなくて{[key]: url}の形式だったらよかったのに...
        this.profile_image_url = props.profile_image_url;
        this.profile_image_url = this.profile_image_url?.replace(/\/small$/, "/public");

        this.social    = props.social || {};
    }

    override encode(): MemberProps {
        return {
            name: this.name,
            name_yomi: this.name_yomi,
            name_eng: this.name_eng,
            team_id: this.team_id,
            number: this.number,
            position: this.position,
            profile_image_url: this.profile_image_url,
            comment: this.comment,
            social: this.social || {},
            ...(this.id ? { id: this.id } : {}),
        };
    }

    async insert(): Promise<Member> {
        if (this.id) throw Error("id must be null");
        return super.upsert<Member>(`teams/${this.team_id}/members`);
    }

    static list<T>(teamId: string): Promise<T[]> {
        return super.list<T>(`teams/${teamId}/members`);
    }
    static sort(members: Member[]): Member[] {
        return members.sort((a, b) => {
            if (a.number && b.number) {
                return parseInt(a.number) - parseInt(b.number);
            } else if (a.number) {
                return -1;
            } else if (b.number) {
                return 1;
            } else {
                return 0;
            }
        });
    }

    static async parseCSV_v20230523(file: File, teamId?: string): Promise<Member[]> {
        const text = await file.text();
        const rows = text.split("\n");
        const headers = rows[0].split(",");
        const members = rows.slice(1).map(row => {
            const cells = row.split(",");
             
            const member: any = {};
            headers.forEach((header, i) => {
                member[header] = cells[i];
            });
            return new Member({
                name: member["name"],
                name_yomi: member["name_yomi"],
                name_eng: member["name_eng"],
                team_id: member["team_id"],
                number: member["number"],
                position: member["position"],
                profile_image_url: member["profile_image_url"],
                comment: member["comment"],
                social: {
                    ...(member["twitter"] ? {twitter: member["twitter"]} : {}),
                    ...(member["instagram"] ? {twitter: member["instagram"]} : {}),
                },
                ...(teamId ? { team_id: teamId } : {}),
            });
        });
        return members;
    }
}