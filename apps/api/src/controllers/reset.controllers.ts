import type { RequestHandler } from "express";
import { sendToEngine } from "../utils/engine-client";
import { EngineCommandType } from "@repo/common/engineTypes";

export const resetEngine: RequestHandler = async (req, res) => {
  try {
    const response = await sendToEngine({
      type: EngineCommandType.RESET_ENGINE,
      payload: {},
    });

    res
      .status(response.ok ? 200 : 400)
      .json(
        response.ok
          ? { message: response.data?.message }
          : { error: response.error },
      );
  } catch (error) {
    console.log(
      error instanceof Error
        ? error.message
        : "Internal server error: Couldn't reset the engine",
    );
    res
      .status(500)
      .json(
        error instanceof Error
          ? error.message
          : "Internal server error: Couldn't reset the engine",
      );
  }
};
