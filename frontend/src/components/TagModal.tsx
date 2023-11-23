'use client';

import { useCallback, useEffect, useRef } from 'react';
import FocusTrap from 'focus-trap-react';
import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';
import { Dispatch, SetStateAction } from 'react';
import { TagType } from './Tag';

// Types
interface ModalProps {
	children: React.ReactNode;
	showModal: boolean;
	setShowModal: Dispatch<SetStateAction<boolean>>;
	setPreviewTags: Dispatch<SetStateAction<TagType[]>>;
	setTagName: Dispatch<SetStateAction<string>>;
	onAddTag: Function;
	value: string;
	containerClasses?: string;
}

export default function TagModal({
	children,
	showModal,
	setShowModal,
	setPreviewTags,
	setTagName,
	onAddTag,
	value,
	containerClasses,
}: ModalProps) {
	const desktopModalRef = useRef(null);

	const onKeyExit = useCallback(
		(e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				setTagName('');
				setShowModal(false);
				setPreviewTags([]);
			}
		},
		[setShowModal, setTagName]
	);

	const onAddTagCallback = useCallback(
		(e: KeyboardEvent) => {
			if (e.key === 'Enter' && value != '') {
				setTagName('');
				onAddTag(value);
			}
		},
		[onAddTag, value, setTagName]
	);

	useEffect(() => {
		document.addEventListener('keydown', onKeyExit);
		document.addEventListener('keydown', onAddTagCallback);
		return () => {
			document.removeEventListener('keydown', onKeyExit);
			document.removeEventListener('keydown', onAddTagCallback);
		};
	}, [onKeyExit, onAddTagCallback]);

	return (
		<AnimatePresence>
			{showModal && (
				<>
					<FocusTrap focusTrapOptions={{ initialFocus: false }}>
						<motion.div
							ref={desktopModalRef}
							key="desktop-modal"
							className="fixed inset-0 z-40 hidden min-h-screen items-center justify-center md:flex"
							initial={{ scale: 0.95, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.95, opacity: 0 }}
							onMouseDown={(e) => {
								if (desktopModalRef.current === e.target) {
									setTagName('');
									setShowModal(false);
									setPreviewTags([]);
								}
							}}
						>
							<div
								className={clsx(
									`overflow relative w max-w-lg transform rounded-xl border border-gray-200 bg-white p-6 text-left shadow-2xl transition-all`,
									containerClasses
								)}
							>
								{children}
							</div>
						</motion.div>
					</FocusTrap>
					<motion.div
						key="desktop-backdrop"
						className="fixed inset-0 z-30 bg-gray-100 bg-opacity-10 backdrop-blur"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={() => setShowModal(false)}
					/>
				</>
			)}
		</AnimatePresence>
	);
}
