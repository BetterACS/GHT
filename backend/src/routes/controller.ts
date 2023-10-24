/**
 * @fileoverview Controller class.
 * @description This class is a singleton and should be accessed through the instance() method.
 *  This class is used to store all the data that is used via the routes.
 */
export default class Controller {
  private static INSTANCE: Controller;
  public static currentMonster: unknown = null;

  private constructor() {}

  public static instance() {
    if (!Controller.INSTANCE) {
      Controller.INSTANCE = new Controller();
    }

    return Controller.INSTANCE;
  }

  // Getters and Setters.
  public getCurrentMonster() {
    return Controller.currentMonster;
  }

  public setCurrentMonster(monster: unknown) {
    Controller.currentMonster = monster;
  }
}
