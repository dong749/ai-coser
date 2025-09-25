import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router/index.jsx';

import './styles/reset.css';
import './styles/variables.css';
import './styles/globals.css';

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('index.html 缺少 <div id="root"></div>');

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
