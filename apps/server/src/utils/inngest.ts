import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "label-peak-server",
  eventKey: process.env.INNGEST_EVENT_KEY as string
});
