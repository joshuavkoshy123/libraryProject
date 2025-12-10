import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/login';
import CheckInPage from './components/CheckInPage.jsx';
import FinesPage from './pages/FinesPage.jsx';
import './App.css';

function App() {
  return (
    <div className='App'>
      <nav className='Nav'>
        <Link to='/login'>Log In</Link>
        <Link to='/checkin'>Check In</Link>
        <Link to='/fines'>Fines</Link>
      </nav>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/checkin' element={<CheckInPage />} />
        <Route path='/fines' element={<FinesPage />} />
      </Routes>
    </div>
  );
}

export default App;