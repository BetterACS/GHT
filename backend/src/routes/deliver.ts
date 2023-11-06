export default class Deliver {
	private static INSTANCE: Deliver;
	private static currentMonster: unknown = null;

	private constructor() {}

	public static instance() {
		if (!Deliver.INSTANCE) {
			Deliver.INSTANCE = new Deliver();
		}
		return Deliver.INSTANCE;
	}

	public getCurrentMonster() {
		return Deliver.currentMonster;
	}

	public setCurrentMonster(monster: unknown) {
		Deliver.currentMonster = monster;
	}
}
