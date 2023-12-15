import CalendarHeatmap from 'react-calendar-heatmap';
import '../styles/Activity.css';
import SideBar from '../components/SideBar';
import clsx from 'clsx';
import { Tooltip } from '@material-tailwind/react';

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
	return (
		<div className="flex flex-row">
			<SideBar tags={[]} />
			<div className="w-full flex flex-col items-center">
				<div className="pt-80 w-full flex flex-row px-40">
					<SimpleQuestContainer name={'Early'} />
					<SimpleQuestContainer name={'No update'} />
				</div>
				<div className="pt-24 w-full px-28">
					<CalendarHeatmap
						showWeekdayLabels
						startDate={new Date('2024-01-01')}
						endDate={new Date('2024-12-31')}
						values={[
							{ date: '2023-12-01', count: 10 },
							{ date: '2023-12-22', count: 20 },
							{ date: '2023-12-26', count: 43 },
							{ date: '2023-12-14', count: 20 },
							{ date: '2024-01-05', count: 30 },
							// ...and so on
						]}
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
