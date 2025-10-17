import type { IUpdateProfileRequestDTO, IUpdateProfileResponseDTO } from "../../../../dtos/user/user.js";

export interface IUpdateUserProfileUseCase{
  execute(userId: string, data: IUpdateProfileRequestDTO): Promise<IUpdateProfileResponseDTO>
}
