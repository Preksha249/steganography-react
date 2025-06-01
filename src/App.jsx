import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './COMPONENTS/HomePage.jsx';
import Encode from './COMPONENTS/Encode.jsx';
import Decode from './COMPONENTS/Decode.jsx';

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/encode" element={<Encode />} />
        <Route path="/decode" element={<Decode />} />
      </Routes>
    </Router>
  );
}