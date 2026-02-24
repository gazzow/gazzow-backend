import type {
  IRemoveAssigneeRequestDTO,
  IRemoveAssigneeResponseDTO,
} from "../../../dtos/task.js";

export interface IRemoveAssigneeUseCase {
  execute(dto: IRemoveAssigneeRequestDTO): Promise<IRemoveAssigneeResponseDTO>;
}
