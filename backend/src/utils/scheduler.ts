import Config from "../config.js";
import Controller from "../routes/deliver.js";
import { monsterModel } from "../database/models.js";
import cron from "node-cron";
import Logger from "./logger.js";

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
    logger.info("[scheduler]:startMonsterSchedule - Updating random monster");
    cron.schedule(
      `*/${Config.RESET_EVERY_N_SECONDS} * * * * *`,
      this.updateRandomMonster
    );
  }

  private async updateRandomMonster() {
    const randomMonster = await monsterModel.aggregate([
      { $sample: { size: 1 } },
    ]);

    await Controller.instance().setCurrentMonster(randomMonster[0]);
  }
  ///#endregion
}
