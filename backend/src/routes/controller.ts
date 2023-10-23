export class Controller {
  private static INSTANCE: Controller;
  public static currentMonster: unknown = null;

  private constructor() {}

  public static instance() {
    if (!Controller.INSTANCE) {
      Controller.INSTANCE = new Controller();
    }

    return Controller.INSTANCE;
  }

  public getCurrentMonster() {
    return Controller.currentMonster;
  }

  public setCurrentMonster(monster: unknown) {
    Controller.currentMonster = monster;
  }
}
