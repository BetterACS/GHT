import ModalBase from './ModalBase';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { UniqueIdentifier } from '@dnd-kit/core';
import { TagType, DNDType, Item } from '../../utils/types';
import TagDisplay from '../Tag';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { format } from 'date-fns';
import DatePickerDialog from '../Date';

interface EditItemModalProps {
	showModal: boolean;
	setShowModal: Dispatch<SetStateAction<boolean>>;
	itemName: string;
	setItemName: Dispatch<SetStateAction<string>>;
	itemDescription: string;
	setItemDescription: Dispatch<SetStateAction<string>>;
	containers: DNDType[];
	tags: TagType[];
	setTags: Dispatch<SetStateAction<TagType[]>>;
	currentContainerId: UniqueIdentifier | undefined;
	currentItemId: UniqueIdentifier | undefined;
	onEditItem: (error: any) => Promise<void>;
	onAddTag: (tagName: string) => void;
	onSelectTag: (item: Item, tag: TagType) => Promise<void>;
	onRemoveTag: (item: Item, tag: TagType) => Promise<void>;
	onDeleteTag: (item: Item, tag: TagType) => Promise<void>;
	currentDueDate: string;
}
class EditItemModal extends ModalBase {
	public static render({
		showModal,
		setShowModal,
		itemName,
		setItemName,
		itemDescription,
		setItemDescription,
		containers,
		tags,
		setTags,
		currentContainerId,
		currentItemId,
		onEditItem,
		onAddTag,
		onSelectTag,
		onRemoveTag,
		onDeleteTag,
		currentDueDate,
	}: EditItemModalProps) {
		const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
		useEffect(() => {
			if (currentDueDate != '' && currentDueDate != undefined) {
				setDate(format(new Date(currentDueDate), 'yyyy-MM-dd'));
			}
		}, [currentDueDate]);

		return (
			<EditItemModal.Modal
				showModal={showModal}
				setShowModal={setShowModal}
				setItemName={setItemName}
				setItemDescription={setItemDescription}
			>
				<div className="overlay flex flex-col w-full items-start gap-y-4">
					<h1 className="text-gray-800 text-3xl font-bold">Edit Item</h1>
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
					<div className="flex flex-warp">
						{/* {containers.map((container) => {
							return <div key={container.id}></div>;
						})} */}
						{containers.map((container) => {
							if (container.id === currentContainerId) {
								return container.items.map((item) => {
									if (item.id === currentItemId) {
										return (
											<TagDisplay.tagsEditor
												key={item.id}
												tags={tags}
												currentTags={item.tags}
												setCurrentTags={(tags) => {
													console.log('setCurrent', tags);
												}}
												onAddTag={onAddTag}
												onRemoveTag={(tag) => {
													onRemoveTag(item, tag);
												}}
												onSelectTag={(tag) => {
													onSelectTag(item, tag);
												}}
												onDeleteTag={(tag) => {
													onDeleteTag(item, tag);
												}}
											/>
										);
									}
								});
							}
						})}
					</div>
					{/* <input type="date" value={date} onChange={(e) => setDate(e.target.value)} /> */}
					<DatePickerDialog currentDate={currentDueDate} onChangeDate={setDate} />
					<Button
						onClick={() => {
							onEditItem(date);
						}}
					>
						Edit Item
					</Button>
				</div>
			</EditItemModal.Modal>
		);
	}
}

export default EditItemModal;
