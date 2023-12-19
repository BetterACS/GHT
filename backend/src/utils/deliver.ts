export default class Deliver {
	private static INSTANCE: Deliver;
	private static currentMonster: number;

	private constructor() {}

	public static instance() {
		if (!Deliver.INSTANCE) {
			Deliver.INSTANCE = new Deliver();
		}
		return Deliver.INSTANCE;
	}

	public getCurrentMonster(): number {
		return Deliver.currentMonster;
	}

	public setCurrentMonster(seed: number) {
		Deliver.currentMonster = seed;
	}
}
