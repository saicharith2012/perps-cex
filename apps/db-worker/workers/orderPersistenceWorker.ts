import { toEngineStreamKey } from "../utils/env";

export async function createNewOrder() {
  let firstIteration = true;
  for (;;) {
    if (firstIteration) {
      console.log(
        `listening to the '${toEngineStreamKey}' stream for new orders...`,
      );
      firstIteration = false;

      await new Promise((resolve) => setTimeout(resolve, 10000))
    }
  }
}
