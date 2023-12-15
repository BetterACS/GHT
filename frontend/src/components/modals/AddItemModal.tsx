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
					<Button onClick={onAddItem}>Add Item</Button>
				</div>
			</AddItemModal.Modal>
		);
	}
}

export default AddItemModal;
