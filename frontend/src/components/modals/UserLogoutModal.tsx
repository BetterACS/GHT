import ModalBase from './ModalBase';
import { Dispatch, SetStateAction } from 'react';
// import Input from '../../components/Input';
import { Button } from '@material-tailwind/react';
interface UserDeleteModalProps {
	showModal: boolean;
	setShowModal: Dispatch<SetStateAction<boolean>>;
	onLogout: () => void;
}

class UserDeleteModal extends ModalBase {
	public static render({ showModal, setShowModal, onLogout }: UserDeleteModalProps) {
		return (
			<UserDeleteModal.Modal
				showModal={showModal}
				setShowModal={setShowModal}
				setItemName={() => {}}
				setItemDescription={() => {}}
			>
				<div className="flex flex-col w-full items-start gap-y-4 pb-4">
					<h1 className="text-gray-800 text-3xl font-bold">Confirm logout</h1>
					<p className="text-gray-800 text-lg font-normal">
						Are you sure you want to logout? You will be redirected to the login page.
					</p>
					<div className="flex flex-row mt-2" style={{ width: '100%', justifyContent: 'space-between' }}>
						<Button onClick={() => setShowModal(false)}>Cancel</Button>
						<Button
							// className="ml-40"
							color="red"
							onClick={() => {
								setShowModal(false);
								onLogout();
							}}
						>
							Logout
						</Button>
					</div>
				</div>
			</UserDeleteModal.Modal>
		);
	}
}

export default UserDeleteModal;
