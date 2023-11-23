import { TagType } from '../utils/types';
import clsx from 'clsx';
const Tag = ({ id, name, color }: TagType) => {
	return (
		<div
			id={id.toString()}
			className={clsx('text-xs px-2 py-1 w-fit shadow-md rounded-xl border border-transparent', color)}
		>
			{name}
		</div>
	);
};

export default Tag;
export type { TagType };
