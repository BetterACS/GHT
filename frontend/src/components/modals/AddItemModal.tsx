import ModalBase from './ModalBase';
import { Dispatch, SetStateAction } from 'react';
import Input from '../../components/Input';
import Button from '../../components/Button';

interface AddItemModalProps {
	showModal: boolean;
	setShowModal: Dispatch<SetStateAction<boolean>>;
	itemName: string;
	setItemName: Dispatch<SetStateAction<string>>;
	itemDescription: string;
	setItemDescription: Dispatch<SetStateAction<string>>;
	onAddItem: (error: any) => Promise<void>;
}
import React from 'react';
import {
	//   Input,
	Popover,
	PopoverHandler,
	PopoverContent,
} from '@material-tailwind/react';
import { format } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';

function Example() {
	return <div className="p-24 z-80"></div>;
}
class AddItemModal extends ModalBase {
	public static render({
		showModal,
		setShowModal,
		itemName,
		setItemName,
		itemDescription,
		setItemDescription,
		onAddItem,
	}: AddItemModalProps) {
		const [date, setDate] = React.useState(format(new Date(), 'dd-MM-yyyy'));
		return (
			<AddItemModal.Modal
				showModal={showModal}
				setShowModal={setShowModal}
				setItemName={setItemName}
				setItemDescription={setItemDescription}
			>
				<div className="flex flex-col w-full items-start gap-y-4">
					<h1 className="text-gray-800 text-3xl font-bold">Add Item</h1>
					<Input
						type="text"
						placeholder="Item Title"
						name="itemname"
						value={itemName}
						onChange={(e) => setItemName(e.target.value)}
					/>
					<Input
						type="text"
						placeholder="Item Description"
						name="itemDescription"
						value={itemDescription}
						onChange={(e) => setItemDescription(e.target.value)}
					/>
					<input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
					<Button
						onClick={() => {
							onAddItem(date);
						}}
					>
						Add Item
					</Button>
				</div>
			</AddItemModal.Modal>
		);
	}
}

export default AddItemModal;
