import './Entrance.css'
import User from '../models/User';
import SignInView from './SignIn';

// v2023/06//03
import { default as NeuGame } from "../models/common/Game";
import { useLoaderData, type LoaderFunction, useNavigate } from "react-router-dom";
import AboutView from '../components/About';
import GameItemView from "../components/GameItem";

export const loader: LoaderFunction = async () => {
  const games = await NeuGame.list();
  const myself = await User.myself();
  return { games, myself };
}

function App() {
  const navigate = useNavigate();
  const { games, myself } = useLoaderData() as { games: NeuGame[], myself: User };

  if (!myself) return <SignInView signin={async (easyid: string, nickname: string) => {
    await User.signin(easyid, nickname);
    navigate("/"); // reload
  }} />;

  if (games.length == 0) {
    return <>
      <h1>現在表示可能な試合はありません...</h1>
      <AboutView />
    </>;
  }
  return <>
    {games.map(game => <GameItemView key={game.id} game={game} />)}
    <AboutView />
  </>;

  // if (game.hasJustFinished()) {
  //   return <ThankYouView
  //     myself={myself}
  //     game={game}
  //     collection={refVotes}
  //     switchTeam={switchTeam}
  //     refresh={() => refresh(Date.now())}
  //   />;
  // }
}

export default App
