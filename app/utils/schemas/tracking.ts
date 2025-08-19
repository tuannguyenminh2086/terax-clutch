import z from "zod";

export const startTrackingSchema = z.object({
  taskId: z.string(),
  teamId: z.string(),
});