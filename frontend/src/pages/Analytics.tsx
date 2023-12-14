import CalendarHeatmap from 'react-calendar-heatmap';
import '../styles/Activity.css';
import SideBar from '../components/SideBar';

const Analytics = () => {
    return (
		<div className="flex flex-row">
            <SideBar tags={[]}/>
            <div className='w-full flex flex-col items-center'>
                <div className="pt-80" style={{width: "1280px"}}>
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
                        // showOutOfRangeDays={true}
                        showMonthLabels
                    />
                </div>
            </div>

		</div>
	);
}

export default Analytics;