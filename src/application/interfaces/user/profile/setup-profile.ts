import type { IUpdateProfileRequestDTO, IUpdateProfileResponseDTO } from "../../../../domain/dtos/user.js";

export interface IUpdateUserProfileUseCase{
  execute(userId: string, data: IUpdateProfileRequestDTO): Promise<IUpdateProfileResponseDTO>
}
