import { useEffect, useState } from 'react'
import './App.css'

import { type FirebaseOptions, initializeApp } from "firebase/app";
const firebaseConfig: FirebaseOptions = JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG_JSONSTR);
const app = initializeApp(firebaseConfig, "mvp");
import { getFirestore, collection } from "firebase/firestore";
const db = getFirestore(app);
const refVotes = collection(db, "votes");

import User from './models/User';
import { default as LSGame, GameStatus, SupportingSide } from "./models/Game";
import SignInView from './containers/SignIn';
// import CheckInView from './containers/CheckIn'; // TODO:
import RankingView from './containers/Ranking';
import WaitingRoomView from './containers/WaitingRoom';
import VoteView from './containers/Vote';
import ThankYouView from './containers/ThankYou';

// v2023/06//03
import { default as NeuGame } from "./models/common/Game";
import { useLoaderData, type LoaderFunction, Link } from "react-router-dom";
import CheckInView from './containers/CheckIn';
import AboutView from './components/About';

export const loader: LoaderFunction = async () => {
  const games = await NeuGame.list();
  const myself = await User.myself();
  return { games, myself };
}

function App() {
  const { games, myself } = useLoaderData() as { games: NeuGame[], myself: User };

  const [game, setCurrentGame] = useState<LSGame|null>(null);
  const [_, refresh] = useState<number>(0);

  const signin = async (easyid: string, nickname: string) => {
    // setMyself(await User.signin(easyid, nickname));
  }

  if (!myself) {
    return <SignInView
      signin={signin}
    />;
  }

  // FIXME: https://github.com/triax/mvp-page/issues/1
  // if (!game) {
  //   return <CheckInView
  //     checkin={checkin}
  //     myself={myself}
  //   />;
  // }

  if (games.length == 0) {
    return <>
      <h1>現在表示可能な試合はありません...</h1>
      <AboutView />
    </>;
  }
  return <>
    {games.map(game => <div key={game.id}>
      <Link to={`/_g/${game.id}`}>{game.id}</Link>
    </div>)}
  </>;

  // if (!game.isReadyForVote(1) && !import.meta.env.DEV) {
  //   return <WaitingRoomView upcoming={game} />;
  // }

  // if (game.hasJustFinished()) {
  //   return <ThankYouView
  //     myself={myself}
  //     game={game}
  //     collection={refVotes}
  //     switchTeam={switchTeam}
  //     refresh={() => refresh(Date.now())}
  //   />;
  // }

  // if (!myself.hasVotedFor(game)) {
  //   return <PickUpView
  //     myself={myself}
  //     game={game}
  //     switchTeam={switchTeam}
  //     collection={refVotes}
  //     refresh={() => refresh(Date.now())}
  //   />;
  // }

  // if (location.hash == "#vote") {
  //   return <VoteView />;
  // }

  // return <RankingView
  //   // signout={() => setMyself(null)}
  //   myself={myself}
  //   game={game}
  //   collection={refVotes}
  //   switchTeam={switchTeam}
  //   refresh={() => refresh(Date.now())}
  // />;
}

export default App
