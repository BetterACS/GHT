import './index.css';
import Home from './pages/Home';
import Monster from './pages/Monster';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Quest from './pages/QuestPage';
import Tag from './pages/Tag';
import Inventory from './pages/Inventory';

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
					<Route path="/quest" element={<Quest />} />
					<Route path="/inventory" element={<Inventory />} />
				</Routes>
			</Router>
		</>
	);
}

export default App;
