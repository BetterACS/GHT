import { Config } from "../config.js";
import { Controller } from "../routes/controller.js";
import MonsterModel from "../database/model/monster.js";
import { Database } from "../database/database.js";
import dayjs from "dayjs";
import cron from "node-cron";

export class Scheduler {
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

  public startMonsterSchedule() {
    cron.schedule("*/10 * * * * *", async function () {
      let database: any = await Database.instance().mongoDB();

      let randomMonster: any = await MonsterModel.aggregate([
        { $sample: { size: 1 } },
      ]);
      await Controller.instance().setCurrentMonster(randomMonster[0]);
    });
  }
}
