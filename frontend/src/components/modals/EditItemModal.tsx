import ModalBase from './ModalBase';
import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';
import { Dispatch, SetStateAction } from 'react';
import { UniqueIdentifier } from '@dnd-kit/core';
import { TagType, DNDType } from '../../utils/types';
import TagDisplay from '../Tag';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { render } from 'react-dom';

interface EditItemModalProps {
	showModal: boolean;
	setShowModal: Dispatch<SetStateAction<boolean>>;
	itemName: string;
	setItemName: Dispatch<SetStateAction<string>>;
	itemDescription: string;
	setItemDescription: Dispatch<SetStateAction<string>>;
	containers: DNDType[];
	tags: TagType[];
	currentContainerId: UniqueIdentifier | undefined;
	currentItemId: UniqueIdentifier | undefined;
	onEditItem: (error: any) => Promise<void>;
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
		currentContainerId,
		currentItemId,
		onEditItem,
	}: EditItemModalProps) {
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
						{containers.map((container) => {
							if (container.id === currentContainerId) {
								return container.items.map((item) => {
									if (item.id === currentItemId) {
										return (
											<TagDisplay.tagsEditor
												tags={tags}
												currentTags={[]}
												setCurrentTags={(tags) => {
													console.log(tags);
												}}
												onAddTag={(tagName) => {
													console.log(tagName);
												}}
												onRemoveTag={() => {
													console.log(item);
												}}
												onSelectTag={() => {}}
											/>
										);
									}
								});
							}
						})}
					</div>
					<Button onClick={onEditItem}>Edit Item</Button>
				</div>
			</EditItemModal.Modal>
		);
	}
}

export default EditItemModal;
