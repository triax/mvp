import instagramIcon from "../assets/instagram.svg";
import tiktokIcon from "../assets/tiktok.png";
import twitterIcon from "../assets/twitter.svg";

export default function AboutView({
    divider = true,
    social = true,
}: {
    divider?: boolean;
    social?: boolean;
}) {
    return (
        <>
            <div style={{textAlign: "center"}}>
                {divider ? <div style={{ textAlign: "center", marginTop: "18px" }}>***</div> : null}
                <h3>リアルタイム投票システムとは？</h3>
                <span>「リアルタイム投票システム」は、観客の皆様と試合およびチームの距離をもっと近づけ、アメリカンフットボールの試合をより双方向で楽しめるコンテンツにすべく、<b>CLUB TRIAX に所属する職業プログラマのメンバーにより独自に開発された</b>システムです。</span>
                <div>より詳しい説明は、<a href="https://www.triax.football/about/mvp-system" target="_blank">こちら</a>をご参照ください。<a href="https://www.triax.football/about/mvp-system" target="_blank">https://www.triax.football/about/mvp-system</a></div>
                {social ? <div style={{marginTop: "18px"}}>
                    <a href="https://www.instagram.com/clubtriax/" target="_blank">
                        <img src={instagramIcon} style={{ height: "1.8rem", marginRight: "0.5rem" }} />
                    </a>
                    <a href="https://www.tiktok.com/@clubtriax" target="_blank">
                        <img src={tiktokIcon} style={{ height: "1.8rem", marginRight: "0.5rem" }} />
                    </a>
                    <a href="https://twitter.com/clubtriax" target="_blank">
                        <img src={twitterIcon} style={{ height: "1.8rem", marginRight: "0.5rem" }} />
                    </a>
                </div> : null}
            </div>
        </>
    )
}