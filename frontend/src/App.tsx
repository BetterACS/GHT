import './index.css';
import Home from './pages/Home';
import Monster from './pages/Monster';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Quest from './pages/QuestPage';
import TaskDemo from './pages/TaskDemo';

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
					<Route path="/task_demo" element={<TaskDemo />} />
				</Routes>
			</Router>
		</>
	);
}

export default App;
