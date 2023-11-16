const init_quest = {
	quests: {
		'quest-1': {
			id: 'quest-1',
			title: 'Quest 1',
			description: 'This is the first quest',
			tasks: ['task-1', 'task-2'],
		},

		'quest-2': {
			id: 'quest-2',
			title: 'Quest 2',
			description: 'This is the second quest',
			tasks: ['task-3', 'task-4'],
		},

		'quest-3': {
			id: 'quest-3',
			title: 'Quest 3',
			description: 'This is the third quest',
			tasks: ['task-5', 'task-6'],
		},
	},
	columns: {
		'column-1': {
			id: 'column-1',
			title: 'To do',
			questIds: ['quest-1', 'quest-2', 'quest-3'],
		},
		'column-2': {
			id: 'column-2',
			title: 'In progress',
			questIds: [],
		},
	},
	columnOrder: ['column-1', 'column-2'],
};

export default init_quest;
