import { Outlet } from 'react-router-dom';
import Navbar from './components/layout/Navbar.jsx';
import './App.css';

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <Outlet />
    </div>
  );
}
