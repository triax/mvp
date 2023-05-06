import { useEffect, useState } from 'react'
import './App.css'

import { type FirebaseOptions, initializeApp } from "firebase/app";
const firebaseConfig: FirebaseOptions = JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG_JSONSTR);
const app = initializeApp(firebaseConfig, "mvp");
import { getFirestore, collection } from "firebase/firestore";
const db = getFirestore(app);
const refVotes = collection(db, "votes");

import User from './models/User';
import Game from "./models/Game";
import SignInView from './containers/SignIn';
import CheckInView from './containers/CheckIn';
import RankingView from './containers/Ranking';
import PickUpView from './containers/PickUp';

function App() {
  const [myself, setMyself] = useState<User|null>(null);
  const [game, setCurrentGame] = useState<Game|null>(null);

  useEffect(() => {
    (async () => {
      setMyself(await User.myself());
      setCurrentGame(await Game.current());
    })();
  }, []);

  const signin = async (nickname: string) => {
    setMyself(await User.signin(nickname));
  }
  const checkin = async (game: Game) => {
    setCurrentGame(await Game.checkin(game));
  }

  if (!myself) {
    return <SignInView
      signin={signin}
    />;
  }
  if (!game) {
    return <CheckInView
      checkin={checkin}
      myself={myself}
    />;
  }
  if (!myself.hasVotedFor(game)) {
    return <PickUpView
      myself={myself}
      game={game}
    />
  }
  return <RankingView
    signout={() => setMyself(null)}
    myself={myself}
    game={game}
    collection={refVotes}
  />;
}

export default App
