import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/login';
import CheckInPage from './components/CheckInPage.jsx';
import './App.css';
import NewAccount from './NewAccount';

function App() {
  return (
    <div className='App'>
      <nav className='Nav'>
        <Link to='/login'>Log In</Link>
        <Link to='/checkin'>Check In</Link>
      </nav>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/checkin' element={<CheckInPage />} />
      </Routes>
    </div>

  );
}

export default App;
