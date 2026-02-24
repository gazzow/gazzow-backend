import z from "zod/v3";
import { ProjectStatus } from "../../../domain/enums/project.js";

export const updateProjectStatusSchema = z.object({
  status: z.enum(
    [ProjectStatus.OPEN, ProjectStatus.IN_PROGRESS, ProjectStatus.COMPLETED],
    {
      message: "Invalid Project status",
    },
  ),
});
