import Config from "../config.js";
import Controller from "../routes/deliver.js";
import MonsterModel from "../database/model/monster.js";
import dayjs from "dayjs";
import winston from "winston";
import cron from "node-cron";

export default class Scheduler {
  private static INSTANCE: Scheduler;
  public static logger: winston.Logger;

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
    cron.schedule(
      `*/${Config.RESET_EVERY_N_SECONDS} * * * * *`,
      this.updateRandomMonster
    );
  }

  private async updateRandomMonster() {
    const randomMonster = await MonsterModel.aggregate([
      { $sample: { size: 1 } },
    ]);

    await Controller.instance().setCurrentMonster(randomMonster[0]);
  }
  ///#endregion
}
