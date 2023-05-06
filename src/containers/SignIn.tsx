import { useState } from "react";


export default function SignInView({ signin }: {
  signin: (nickname: string) => void;
}) {
  const [nickname, setNickname] = useState<string>("");
  return (
    <div>
      <h2>MVP投票システム</h2>
      <span>Provided by <a href="https://www.triax.football" target="_blank">Clud Triax</a></span>
      <h1>STEP 1/3:<br />あなたのニックネームを登録してください</h1>
      <div style={{display: "flex"}}>
        <input
          style={{flex: 1, fontSize: "0.8rem"}}
          type="text" onChange={ev => setNickname(ev.target.value)}
          placeholder="ニックネームを入力してください"
        />
        <button
          style={{ marginLeft: "0.2rem", borderRadius: 3 }}
          disabled={nickname.trim().length === 0}
          onClick={() => signin(nickname)}
        >次へ</button>
      </div>
    </div>
  )
}
