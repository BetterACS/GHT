import { useEffect, useState } from 'react';

// import HeatMap from '@uiw/react-heat-map';

// const value = [{ date: '2023/12/08', count: 32 }];

// const Activity = () => {
// 	function getStartAndEndOfMonth(): Date[] {
// 		const currentDate = new Date();
// 		const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
// 		const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
// 		return [startOfMonth, endOfMonth];
// 	}

// 	const [startOfMonth, endOfMonth] = getStartAndEndOfMonth();

// 	const [selected, setSelected] = useState('');
// 	return (
// 		<div>
// 			<HeatMap
// 				width={200}
// 				rectSize={20}
// 				legendCellSize={20}
// 				value={value}
// 				startDate={startOfMonth}
// 				style={{ color: '#ffffff', fontSize: 12 }}
// 				// endDate={endOfMonth}
// 				weekLabels={['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']}
// 				monthLabels={[]}
// 				rectRender={(props, data) => {
// 					if (selected !== '') {
// 						props.opacity = data.date === selected ? 1 : 0.45;
// 					}
// 					return (
// 						<rect
// 							{...props}
// 							onClick={() => {
// 								setSelected(data.date === selected ? '' : data.date);
// 							}}
// 						/>
// 					);
// 				}}
// 			/>
// 		</div>
// 	);
// };
import CalendarHeatmap from 'react-calendar-heatmap';
import '../styles/Activity.css';
const Activity = ({ values }: any) => {
	return (
		<div>
			<CalendarHeatmap
				startDate={new Date('2023-08-30')}
				endDate={new Date('2024-08-15')}
				values={
					values
					// [
					// { date: '2023-12-01', count: 10 },
					// { date: '2023-12-22', count: 20 },
					// { date: '2023-12-26', count: 43 },
					// { date: '2023-12-14', count: 20 },
					// { date: '2024-01-05', count: 30 },
					// ]
				}
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
				// showOutOfRangeDays={true}
				// showMonthLabels={false}
			/>
		</div>
	);
};

export default Activity;
