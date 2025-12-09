import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/login';
import './App.css';

function App() {
  return (
    <div className='App'>
      <nav>
        <Link to='/login'>Log In</Link>
      </nav>
      <Routes>
        <Route path='/login' element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
