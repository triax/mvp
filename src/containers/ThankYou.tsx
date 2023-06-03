import AboutView from "../components/About";

export default function ThankYouView() {
    // const [votes, setVotes] = useState<Vote[]>([]);
    // const entries = votesToEntries(game, votes, (vote) => vote.side == game.supporting);
    return (
        <div>
            {/* <div>
                {game.kickoff_time?.toDateString()}
            </div>
            <h2>MVP投票結果</h2>
            <TeamSwitchView game={game} switchTeam={switchTeam} />
            {entries.map((entry, i) => <PlayerRankingItem
                rank={i + 1}
                key={entry.player.identifier} entry={entry}
                defautlIcon={game.getDefaultIconURL(game.supporting)}
                refresh={refresh}
            />)}
 */}
            <div>
                <h3 style={{marginBottom: 0}}>ご参加ありがとうございました！</h3>
                <h3 style={{margin: 0}}>次回試合も応援よろしくお願いいたします！</h3>
                {/* <div style={{fontSize: "xx-small"}}>{myself.uuid}</div> */}
            </div>
            <AboutView />
        </div>
    )
}
