import { PlanDuration } from "../../domain/enums/plan.js";

export function CalculateEndDate(startDate: Date, duration: PlanDuration) {
  const end = new Date(startDate);

  if (duration === PlanDuration.MONTHLY) {
    end.setMonth(end.getMonth() + 1);
  }

  if (duration === PlanDuration.YEARLY) {
    end.setMonth(end.getFullYear() + 1);
  }

  return end;
}
