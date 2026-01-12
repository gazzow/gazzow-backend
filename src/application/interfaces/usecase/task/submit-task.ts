import type {
  ISubmitTaskRequestDTO,
} from "../../../dtos/task.js";

export interface ISubmitTaskUseCase {
  execute(dto: ISubmitTaskRequestDTO): Promise<void>;
}
