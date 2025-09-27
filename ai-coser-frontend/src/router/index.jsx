import { createBrowserRouter } from 'react-router-dom';
import App from '../App.jsx';
import Home from '../pages/Home/Home.jsx';
import Search from '../pages/Search/Search.jsx';
import CharacterPage from '../pages/Character/CharacterPage.jsx';
import VoiceSettings from '../pages/VoiceSettings/VoiceSettings.jsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: '/search', element: <Search /> },
      { path: '/character/:id', element: <CharacterPage /> },
      { path: '/voice-settings', element: <VoiceSettings /> },
    ],
  },
]);
