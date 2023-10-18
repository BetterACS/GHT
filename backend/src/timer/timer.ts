import { Config } from "../config.js";
import dayjs from "dayjs";

export class ServerTimer {
  private static INSTANCE: ServerTimer;

  private constructor() {}

  public static instance() {
    if (!ServerTimer.INSTANCE) {
      ServerTimer.INSTANCE = new ServerTimer();
    }

    return ServerTimer.INSTANCE;
  }

  public getCurrentTime() {
    let currentHours = dayjs().hour();
    let nHours = Math.floor(currentHours / Config.RESET_EVERY_N_HOURS);

    let nextTime = dayjs()
      .set("hour", (nHours + 1) * Config.RESET_EVERY_N_HOURS)
      .set("minute", 0)
      .set("second", 0);

    console.log(nextTime, dayjs());

    let differenceSeconds = nextTime.diff(dayjs(), "second");
    return differenceSeconds;
  }
}
