import './App.css'
import Home from './pages/Home'
import Monster from './pages/Monster'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/monster" element={<Monster />} />
        </Routes>

      </Router>
    </>
  )
}

export default App
