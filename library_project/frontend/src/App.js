import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/login';
import './App.css';
import NewAccount from './NewAccount';

function App() {
  return (
    <div className='App'>
      <nav>
        <Link to='/login'>Log In</Link>
        <Link to='/new-account'>New Account</Link>
      </nav>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/new-account' element={<NewAccount />} />
      </Routes>
    </div>

  );
}

export default App;


