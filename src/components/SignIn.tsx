

export default function SignInView({ signin }: {
  signin: (nickname: string) => void;
}) {
  return (
    <div>
      <h1>Input your nickname</h1>
      <input type="text" />
      <button onClick={() => signin("otiai10")}>Sign In</button>
    </div>
  )
}
