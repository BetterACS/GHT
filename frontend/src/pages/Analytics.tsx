import CalendarHeatmap from 'react-calendar-heatmap';
import '../styles/Activity.css';
import SideBar from '../components/SideBar';
import clsx from 'clsx';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { returnInterface } from '../../../backend/src/utils/interfaces';
import authorization from '../utils/authorization';
import Config from '../../../backend/src/config';
import tokenAuth from '../utils/tokenAuth';
import { useNavigate } from 'react-router-dom';

const Analytics = () => {
	const navigate = useNavigate();
	const email = localStorage.getItem('email') || '';
	const [values, setValues] = useState([{}]);
	const [username, setUsername] = useState('');
	const [accessToken, setAccessToken] = useState(localStorage.getItem('access_token'));
	const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refresh_token'));
	let headers = {
		authorization: `Bearer ${localStorage.getItem('access_token')}`,
		refreshToken: `Bearer ${localStorage.getItem('refresh_token')}`,
		email: `${localStorage.getItem('email')}`,
	};

	useEffect(() => {
		tokenAuth(navigate, '/analysis', '/log_in');
		fetchValues();
	}, []);

	const fetchValues = async () => {
		try {
			const results = await axios.get(`http://localhost:${Config.BACKEND_PORT}/filter/date`, {
				params: {
					email: email,
				},
				headers: headers,
			});

			const result = results.data as returnInterface;
			let temp: any = [];
			const counter_dict:any = {};
			result.data.map(async (item: any) => {
				if (item.status === 'Done') {
					// temp.push({ date: item.last_update_date, count: 1 });
					counter_dict[item.last_update_date] = (counter_dict[item.last_update_date] || 0) + 1;
				}
			});
			// หลักการทำงานคือเอายัดเข้า dict แล้ว loop dict แล้วยัดเข้า temp ซึ่งมันจะเขียนทับตัวเดิม
			Object.entries(counter_dict).forEach(([key, value]) => {
				temp.push({ date: key, count: value });
			  });
			
			setValues(temp);
		} catch (error) {}
	};

	const updateAccessToken = async (newToken: string, newRefresh: string) => {
		await setAccessToken(newToken);
		await localStorage.setItem('access_token', newToken);
		await setRefreshToken(newRefresh);
		await localStorage.setItem('refresh_token', newRefresh);
		console.log('update access token', newToken);
	};
	const userQuery = async () => {
		try {
			const results = await axios.get(`http://localhost:${Config.BACKEND_PORT}/user`, {
				params: {
					email: email,
				},
				headers: headers,
			});
			const result = results.data as returnInterface;
			authorization(
				result,
				async () => {
					setUsername(result.data[0].username);
				},
				updateAccessToken
			);
		} catch (error) {
			console.error('Error to query user', error);
		}
	};

	useEffect(() => {
		userQuery();
	});

	return (
		<div className="flex flex-row">
			<SideBar.noWorkingTags username={username} header={headers} currentPage="analysis" />
			<div className="w-full flex flex-col items-center">
				{/* <div className="pt-80 w-full flex flex-row px-40">
					<SimpleQuestContainer name={'Early'} />
					<SimpleQuestContainer name={'No update'} />
				</div> */}
				<div className="pt-80 w-full px-28">
					<CalendarHeatmap
						showWeekdayLabels
						startDate={new Date('2023-01-01')}
						endDate={new Date('2023-12-31')}
						values={values}
						classForValue={(value) => {
							if (!value) {
								return 'color-empty';
							}
							if (value.count > 0 && value.count <= 3) {
								return `color-1`;
							} else if (value.count > 3 && value.count <= 5) {
								return `color-2`;
							} else if (value.count > 5 && value.count <= 7) {
								return `color-3`;
							} else {
								return `color-4`;
							}
						}}
						gutterSize={1.5}
						tooltipDataAttrs={(value: any) => {
							return {
								'data-tip': `${value.date} has count: ${value.count}`,
							};
						}}
						onMouseOver={(value: any) => {
							console.log(value.target.attributes[5].value);
						}}
						showMonthLabels
					/>
				</div>
			</div>
		</div>
	);
};

export default Analytics;
