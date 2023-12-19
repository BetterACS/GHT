import './index.css';
import Home from './pages/Home';
import Monster from './pages/Monster';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Quest from './pages/QuestPage';
import Analytics from './pages/Analytics';
import Inventory from './pages/Inventory';
import Profile from './pages/Profile';
import Forgot from './pages/Forgot';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
	return (
		<>
			<Router>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/monster" element={<Monster />} />
					<Route path="/sign_up" element={<SignUp />} />
					<Route path="/log_in" element={<Login />} />
					<Route path="/forgot" element={<Forgot />} />
					<Route path="/quest" element={<Quest />} />
					<Route path="/analysis" element={<Analytics />} />
					<Route path="/collection" element={<Inventory />} />
					<Route path="/profile" element={<Profile />} />
				</Routes>
			</Router>
		</>
	);
}

export default App;
