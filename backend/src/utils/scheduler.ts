/**
 * @fileoverview Scheduler class to handle all the scheduled tasks.
 * @description This class is a singleton and should be accessed through the instance() method.
 * @schedule startMonsterSchedule - Updates the current monster every 10 seconds.
 */

import Config from "../config.js";
import Controller from "../routes/controller.js";
import MonsterModel from "../database/model/monster.js";
import Database from "../database/database.js";
import dayjs from "dayjs";
import cron from "node-cron";

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
    cron.schedule("*/10 * * * * *", this.updateRandomMonster);
  }

  private async updateRandomMonster() {
    const randomMonster = await MonsterModel.aggregate([
      { $sample: { size: 1 } },
    ]);

    await Controller.instance().setCurrentMonster(randomMonster[0]);
  }
  ///#endregion

  public getCurrentTime() {
    let currentHours: number = dayjs().hour();
    let nHours: number = Math.floor(currentHours / Config.RESET_EVERY_N_HOURS);

    let nextTime = dayjs()
      .set("hour", (nHours + 1) * Config.RESET_EVERY_N_HOURS)
      .set("minute", 0)
      .set("second", 0);

    console.log(nextTime, dayjs());

    let differenceSeconds: number = nextTime.diff(dayjs(), "second");
    return differenceSeconds;
  }
}
