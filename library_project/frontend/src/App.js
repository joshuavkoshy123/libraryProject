import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/login';
import CheckInPage from './components/CheckInPage.jsx';
import './App.css';

function App() {
  return (
    <div className='App'>
      <nav>
        <Link to='/login'>Log In</Link>
      </nav>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/checkin' element={<CheckInPage />} />
      </Routes>
    </div>
  );
}

export default App;