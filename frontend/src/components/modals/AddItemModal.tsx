import ModalBase from './ModalBase';
import { Dispatch, SetStateAction } from 'react';
// import Input from '../../components/Input';
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
import { format } from 'date-fns';
import { Input, Textarea } from '@material-tailwind/react';
import DatePickerDialog from '../Date';

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
				<div className="flex flex-col w-full items-start gap-y-4 pb-4">
					<h1 className="text-gray-800 text-3xl font-bold">Add Item</h1>
					<Input
						// type="text"
						label="Item Title"
						crossOrigin="anonymous"
						// placeholder="Item Title"
						name="itemname"
						value={itemName}
						onChange={(e) => setItemName(e.target.value)}
					/>
					<Textarea
						// type="text"
						label="Item Description"
						// placeholder="Item Description"
						name="itemDescription"
						value={itemDescription}
						onChange={(e) => setItemDescription(e.target.value)}
					/>
					{/* <input type="date" value={date} onChange={(e) => setDate(e.target.value)} /> */}
					{/* <DateMenu /> */}
					<DatePickerDialog onChangeDate={setDate} />
				</div>
				<Button onClick={() => onAddItem(date)}>Add Item</Button>
			</AddItemModal.Modal>
		);
	}
}

export default AddItemModal;
