import { monsterInterface } from '../utils/interfaces.js';
export default class Deliver {
	private static INSTANCE: Deliver;
	private static currentMonster: monsterInterface;

	private constructor() {}

	public static instance() {
		if (!Deliver.INSTANCE) {
			Deliver.INSTANCE = new Deliver();
		}
		return Deliver.INSTANCE;
	}

	public getCurrentMonster(): monsterInterface {
		return Deliver.currentMonster;
	}

	public setCurrentMonster(monster: monsterInterface) {
		Deliver.currentMonster = monster;
	}
}
