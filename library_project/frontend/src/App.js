import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/login';
import Search from './pages/search';
import CheckInPage from './components/CheckInPage';
import FinesPage from './pages/FinesPage.jsx';
import './App.css';
import NewAccount from './NewAccount';

function App() {
  return (
    <div className='App'>
      <nav className='Nav'>
        <Link to='/login'>Add New Borrower</Link>
        <Link to='/search'>Search Books</Link>
        <Link to='/checkin'>Check In</Link>
        <Link to='/fines'>Fines</Link>
      </nav>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/search' element={<Search />} />
        <Route path='/checkin' element={<CheckInPage />} />
        <Route path='/fines' element={<FinesPage />} />
      </Routes>
    </div>

  );
}

export default App;
