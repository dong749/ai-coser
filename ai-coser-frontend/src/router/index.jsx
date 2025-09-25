import { createBrowserRouter } from 'react-router-dom';
import App from '../App.jsx';
import Home from '../pages/Home/Home.jsx';
import ComingSoon from '../pages/Common/ComingSoon.jsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: '/search', element: <ComingSoon title="Search" /> },
      { path: '/character/:id', element: <ComingSoon title="Character" /> },
      { path: '*', element: <ComingSoon /> },
    ],
  },
]);
