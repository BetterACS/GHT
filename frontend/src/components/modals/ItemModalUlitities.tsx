import Input from '../Input';
import { Dispatch, SetStateAction } from 'react';

interface ItemModalProps {
	itemName: string;
	itemDescription: string;
	setItemName: Dispatch<SetStateAction<string>>;
	setItemDescription: Dispatch<SetStateAction<string>>;
}

class ItemModalUlitities {
	public static input({ itemName, setItemName, itemDescription, setItemDescription }: ItemModalProps) {
		return (
			<>
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
			</>
		);
	}
}

export { ItemModalUlitities };
