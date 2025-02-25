import { flag } from "flags/next";
import { env } from "./env";

export const editFlag = flag({
  key: "edit",
  decide: () => env.EDIT_MODE === true,
});

export const newFlag = flag({
  key: "new",
  decide: () => env.NEW_MODE === true,
});
