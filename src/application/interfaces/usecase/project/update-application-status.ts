import type { IUpdateApplicationStatusRequestDTO } from "../../../dtos/application.js";

export interface IUpdateApplicationStatusUseCase {
  execute(dto: IUpdateApplicationStatusRequestDTO): Promise<void>;
}
