import CalendarHeatmap from 'react-calendar-heatmap';
import '../styles/Activity.css';
import SideBar from '../components/SideBar';
import clsx from 'clsx';
import axios from 'axios';
import { SetStateAction, useEffect, useState } from 'react';
import { returnInterface } from '../../../backend/src/utils/interfaces';
import authorization from '../utils/authorization';
import Config from '../../../backend/src/config';

const SimpleQuestContainer = ({ name }: any) => {
	return (
		<div
			className={clsx('m-4 w-full h-full p-4 bg-gray-50 rounded-xl flex flex-col gap-y-4 question-container')}
			style={{ minHeight: '120px', minWidth: '360px' }}
		>
			<div className="flex items-center justify-between min-h-36">
				<div className="flex flex-col gap-y-1">
					<h1 className="text-gray-800 text-xl font-semibold">{name}</h1>
				</div>
			</div>
		</div>
	);
};

const Analytics = () => {
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
		fetchValues();
		console.log(values);
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

			result.data.map(async (item: any) => {
				const id = 'item-' + item.quest_id;
				if (item.status === 'Done') {
					temp.push({ date: item.due_date, count: 1 });
				}
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
			<SideBar.noWorkingTags username={username} header={headers} />
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
							if (value.count > 0 && value.count <= 20) {
								return `color-1`;
							} else if (value.count > 20 && value.count <= 40) {
								return `color-2`;
							} else if (value.count > 40 && value.count <= 60) {
								return `color-3`;
							} else if (value.count > 60 && value.count <= 80) {
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
