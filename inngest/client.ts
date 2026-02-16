import { Inngest } from "inngest";

export const inngest = new Inngest({
    id: "reviewyai",
    name: "ReviewyAI",
    eventKey: process.env.INNGEST_EVENT_KEY
})