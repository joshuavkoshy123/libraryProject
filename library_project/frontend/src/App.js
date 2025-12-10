import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/login';
import Search from './pages/search';
import './App.css';

function App() {
  return (
    <div className='App'>
      <nav>
        <Link to='/login'>Log In</Link>
        <Link to='/search'>Search Books</Link>
      </nav>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/search' element={<Search />} />
      </Routes>
    </div>
  );
}

export default App;
