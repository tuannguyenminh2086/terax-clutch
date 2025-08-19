import z from "zod";

export const updateProjectSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  members: z.array(z.string()).optional(),
});

export type UpdateProjectSchema = z.infer<typeof updateProjectSchema>;