
export function TemporarilyClosed() {
    return (
        <div style={{ textAlign: "center", padding: "16px" }}>
            <h1>ご声援<br />ありがとうございます！</h1>
            <h2>リアルタイム投票システムは現在パワーアップのため再設計中です</h2>
            <p>よりよい観戦体験の提供のため、みなさまのご意見をいただければ幸いです</p>
            <div style={{ marginBottom: "8px" }}>
                <button onClick={() => location.href = "https://www.triax.football/members"}>選手表を見る</button>
            </div>
            <div style={{ marginBottom: "8px" }}>
                <button onClick={() => location.href = "https://forms.gle/65RtwkFcvAiTCx939"}>ご意見募集</button>
            </div>
        </div>
    );
}