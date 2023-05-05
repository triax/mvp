import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { type FirebaseOptions, initializeApp } from "firebase/app";
const firebaseConfig: FirebaseOptions = JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG_JSONSTR);
const app = initializeApp(firebaseConfig, "mvp");

import { getFirestore, collection, addDoc, onSnapshot } from "firebase/firestore";

function App() {
  const [users, setUsers] = useState<any[]>([]);
  const db = getFirestore(app);
  const ref =  collection(db, "users");

  useEffect(() => {
    onSnapshot(ref, (querySnapshot) => {
      const data: any[] = [];
      querySnapshot.forEach((doc) => {
        // console.log("doc.id", doc.id);
        data.push({ id: doc.id, data: doc.data() });
      });
      setUsers(data);
    });
  }, []);

  const addUser = async () => {
    await addDoc(ref, {
      first: "Ada",
      last: "Lovelace",
      born: 1815
    });
  }

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <div className="card">
        <button onClick={() => addUser()}>Click me</button>
        {users.map((user) => <div key={user.id}>{user.id}</div>)}
      </div>
    </>
  )
}

export default App
