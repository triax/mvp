import React from 'react'
import ReactDOM from 'react-dom/client'
import App, { loader as appLoader } from './App.tsx'
import './index.css'

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import VoteView, { loader as voteLoader } from './containers/Vote.tsx';
import RankingView, { loader as rankingLoader } from './containers/Ranking.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    loader: appLoader,
  },
  {
    path: "/_g/:gameId",
    element: <VoteView />,
    loader: voteLoader,
  },
  {
    path: "/_g/:gameId/_v",
    element: <RankingView />,
    loader: rankingLoader,
  },
  {
    path: "*",
    element: <App />,
    loader: appLoader,
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
