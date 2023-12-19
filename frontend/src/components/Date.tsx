import { useEffect, useState } from 'react';
import { FaCalendar } from 'react-icons/fa';
import { IconButton } from '@material-tailwind/react';
import { format } from 'date-fns';
import { Input, Textarea } from '@material-tailwind/react';
import { DayPicker } from 'react-day-picker';
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';

import { ChangeEventHandler, useRef } from 'react';

import { isValid, parse } from 'date-fns';
import FocusTrap from 'focus-trap-react';
import { SelectSingleEventHandler } from 'react-day-picker';
import { usePopper } from 'react-popper';

function DatePickerDialog({ currentDate, onChangeDate }: any) {
	const [selected, setSelected] = useState<Date | undefined>(
		new Date(currentDate ? currentDate : format(new Date(), 'y-MM-dd'))
	);
	const [inputValue, setInputValue] = useState<string>('');
	const [isPopperOpen, setIsPopperOpen] = useState(false);

	const popperRef = useRef<HTMLDivElement>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);
	const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null);

	const popper = usePopper(popperRef.current, popperElement, {
		placement: 'top',
	});

	const closePopper = () => {
		setIsPopperOpen(false);
		buttonRef?.current?.focus();
	};

	const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
		setInputValue(e.currentTarget.value);
		const date = parse(e.currentTarget.value, 'y-MM-dd', new Date());
		if (isValid(date)) {
			setSelected(date);
		} else {
			setSelected(undefined);
		}
	};

	const handleButtonClick = () => {
		setIsPopperOpen(true);
	};

	const handleDaySelect: SelectSingleEventHandler = (date) => {
		setSelected(date);

		if (date) {
			setInputValue(format(date, 'y-MM-dd'));
			onChangeDate(format(date, 'y-MM-dd'));
			closePopper();
		} else {
			setInputValue('');
		}
	};

	useEffect(() => {
		if (selected) onChangeDate(format(selected, 'y-MM-dd'));
	}, []);

	return (
		<div>
			<div className="flex flex-row gap-2" ref={popperRef}>
				{/* <button ref={buttonRef} type="button" aria-label="Pick a date" onClick={handleButtonClick}>
					Pick a date
				</button> */}

				<Input
					label="Select a due date"
					crossOrigin={'anonymous'}
					placeholder={format(new Date(), 'y-MM-dd')}
					value={selected ? format(selected, 'y-MM-dd') : inputValue}
					onChange={(e) => handleInputChange(e)}
				/>
				<IconButton placeholder="" ref={buttonRef} aria-label="Pick a date" onClick={handleButtonClick}>
					<FaCalendar size={16} />
				</IconButton>
			</div>
			{isPopperOpen && (
				<FocusTrap
					active
					focusTrapOptions={{
						initialFocus: false,
						allowOutsideClick: true,
						clickOutsideDeactivates: true,
						onDeactivate: closePopper,
						fallbackFocus: buttonRef.current || undefined,
					}}
				>
					<div
						tabIndex={-1}
						style={popper.styles.popper}
						className="dialog-sheet bg-white p-4 rounded-xl shadow-lg z-50"
						{...popper.attributes.popper}
						ref={setPopperElement}
						role="dialog"
						aria-label="DayPicker calendar"
					>
						<DayPicker
							mode="single"
							selected={selected}
							onSelect={handleDaySelect}
							showOutsideDays
							className="border-0 z-50"
							defaultMonth={new Date()}
							classNames={{
								caption: 'flex justify-center py-2 mb-4 relative items-center',
								caption_label: 'text-sm font-medium text-gray-900',
								nav: 'flex items-center',
								nav_button:
									'h-6 w-6 bg-transparent hover:bg-blue-gray-50 p-1 rounded-md transition-colors duration-300',
								nav_button_previous: 'absolute left-1.5',
								nav_button_next: 'absolute right-1.5',
								table: 'w-full border-collapse',
								head_row: 'flex font-medium text-gray-900',
								head_cell: 'm-0.5 w-9 font-normal text-sm',
								row: 'flex w-full mt-2',
								cell: 'text-gray-600 rounded-md h-9 w-9 text-center text-sm p-0 m-0.5 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-gray-900/20 [&:has([aria-selected].day-outside)]:text-white [&:has([aria-selected])]:bg-gray-900/50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
								day: 'h-9 w-9 p-0 font-normal ',
								day_range_end: 'day-range-end',
								day_selected:
									'rounded-md bg-red-400 outline-none text-white hover:bg-gray-900 hover:text-white focus:bg-gray-900 focus:text-white focus:outline-none',
								day_today: 'rounded-md bg-gray-400 text-gray-900',
								day_outside:
									'day-outside text-gray-500 opacity-50 aria-selected:bg-gray-500 aria-selected:text-gray-900 aria-selected:bg-opacity-10',
								day_disabled: 'text-gray-500 opacity-50',
								day_hidden: 'invisible',
							}}
							components={{
								IconLeft: ({ ...props }) => <ChevronLeftIcon {...props} className="h-4 w-4 stroke-2" />,
								IconRight: ({ ...props }) => (
									<ChevronRightIcon {...props} className="h-4 w-4 stroke-2" />
								),
							}}
						></DayPicker>
					</div>
				</FocusTrap>
			)}
		</div>
	);
}

export default DatePickerDialog;
