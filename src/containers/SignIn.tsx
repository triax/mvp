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
      <input type="text" onChange={ev => setNickname(ev.target.value)} />
      <button
        disabled={nickname.trim().length === 0}
        onClick={() => signin(nickname)}
      >Sign In</button>
    </div>
  )
}
