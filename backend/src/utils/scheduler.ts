/**
 * @fileoverview Scheduler class. Used to schedule tasks and provide code for time-based events.
 */
import cron from 'node-cron';
import Controller from './deliver.js';
import Logger from './logger.js';

export default class Scheduler {
	private static INSTANCE: Scheduler;

	private constructor() {
		this.startMonsterSchedule();
	}

	public static instance() {
		if (!Scheduler.INSTANCE) {
			Scheduler.INSTANCE = new Scheduler();
		}

		return Scheduler.INSTANCE;
	}

	///#region Monster Schedule
	public startMonsterSchedule() {
		const logger = Logger.instance().logger();
		this.updateRandomMonster();
		logger.info('[scheduler]:startMonsterSchedule - Updating random monster');
		cron.schedule(`*/4 * * * * *`, this.updateRandomMonster);
	}

	public async updateRandomMonster() {
		const seed = Math.floor(Math.random() * 1000000);

		await Controller.instance().setCurrentMonster(seed);
	}
	///#endregion
}
