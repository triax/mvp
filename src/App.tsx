import { useEffect, useState } from 'react'
import './App.css'

import { type FirebaseOptions, initializeApp } from "firebase/app";
const firebaseConfig: FirebaseOptions = JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG_JSONSTR);
const app = initializeApp(firebaseConfig, "mvp");
import { getFirestore, collection } from "firebase/firestore";
const db = getFirestore(app);
const refVotes = collection(db, "votes");

import User from './models/User';
import Game, { GameStatus, SupportingSide } from "./models/Game";
import SignInView from './containers/SignIn';
// import CheckInView from './containers/CheckIn'; // TODO: 
import RankingView from './containers/Ranking';
import PickUpView from './containers/PickUp';
import WaitingRoomView from './containers/WaitingRoom';

function App() {
  const [myself, setMyself] = useState<User|null>(null);
  const [game, setCurrentGame] = useState<Game|null>(null);

  useEffect(() => {
    (async () => {
      setMyself(await User.myself());
      // {{{ FIXME: Delete this block https://github.com/triax/mvp-page/issues/1
      const current = await Game.current();
      if (!current) {
        const active = (await Game.fetch()).filter(g => g.status == GameStatus.ACTIVE).pop();
        if (active) await Game.checkin(active);
      }
      // }}}
      setCurrentGame(await Game.current());
    })();
  }, []);

  const signin = async (easyid: string, nickname: string) => {
    setMyself(await User.signin(easyid, nickname));
  }
  // const checkin = async (game: Game) => {
  //   setCurrentGame(await Game.checkin(game));
  // }
  const switchTeam = async (team: SupportingSide) => {
    const x = Game.new(game as any, "current");
    x.supporting = team;
    setCurrentGame(await x.save() || null);
  }

  if (!myself) {
    return <SignInView
      signin={signin}
    />;
  }

  if (!game) {
    return <h1>試合情報を<br/>読込中...</h1>;
  }

  if (!game.isReadyForVote(2)) {
    return <WaitingRoomView upcoming={game} />;
  }

  // if (!game) {
  //   return <CheckInView
  //     checkin={checkin}
  //     myself={myself}
  //   />;
  // }

  if (!myself.hasVotedFor(game)) {
    return <PickUpView
      myself={myself}
      game={game}
      switchTeam={switchTeam}
    />;
  }

  return <RankingView
    signout={() => setMyself(null)}
    myself={myself}
    game={game}
    collection={refVotes}
  />;
}

export default App
