import { fromEngineStreamKey } from "../utils/env";

export async function updateEventsOnDB() {
  let firstIteration = true;

  for (;;) {
    if (firstIteration) {
      console.log(
        `listening to the '${fromEngineStreamKey}' stream to update matching engine events in the DB...`,
      );
      firstIteration = false;
    }
  }
}
