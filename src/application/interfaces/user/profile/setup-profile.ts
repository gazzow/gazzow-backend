import type { IUpdateProfileRequestDTO, IUpdateProfileResponseDTO } from "../../../../domain/dtos/user.js";

export interface ISetupUserProfileUseCase{
  execute(userId: string, data: IUpdateProfileRequestDTO): Promise<IUpdateProfileResponseDTO>
}
