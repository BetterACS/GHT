import './App.css'
import Home from './pages/Home'
import Monster from './pages/Monster'
import Sign_up from './pages/Sign_up'
import Log_in from './pages/Log_in'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/monster" element={<Monster />} />
          <Route path="/sign_up" element={<Sign_up/>} />
          <Route path="/log_in" element = {<Log_in/>} />
        </Routes>
      </Router>
    </>
  )
}

export default App
