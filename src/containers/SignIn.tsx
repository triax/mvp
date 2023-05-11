import { useEffect, useState } from "react";


export default function SignInView({ signin }: {
  signin: (easyid: string, nickname: string) => void;
}) {
  const [nickname, setNickname] = useState<string>("");
  const [easyid, setEasyid] = useState<string>("");
  useEffect(() => {
    setEasyid(Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8));
  }, []);
  return (
    <div>
      <h2>リアルタイムMVP投票システム</h2>
      <span>Provided by <a href="https://www.triax.football" target="_blank">Clud Triax</a></span>
      <div>「リアルタイムMVP投票システム」とは？ <br/><a href="https://www.triax.football/about/mvp-system" target="_blank">より詳しい説明はこちら</a></div>
      <h1>登録不要で参加できます！</h1>
      <h3>ニックネーム設定すると、よりたのしいと思います！</h3>
      <div style={{display: "flex"}}>
        <input
          style={{ flex: 1, fontSize: "1.2rem", height: "2rem" }}
          type="text" onChange={ev => setNickname(ev.target.value)}
          placeholder="ニックネームを設定"
        />
      </div>
      <div style={{ textAlign: "center", marginTop: "0.5em" }}>
        <button
          style={{ borderRadius: 3 }}
          onClick={() => signin(easyid, nickname)}
        >{nickname.length ? "ニックネームを設定して次へ" : "設定せずに次へ"}</button>
      </div>
    </div>
  )
}
