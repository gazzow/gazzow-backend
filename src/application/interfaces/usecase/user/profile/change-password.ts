import type { IChangePasswordRequestDTO } from "../../../../dtos/user/user.js";

export interface IChangePasswordUseCase{
    execute(dto: IChangePasswordRequestDTO): Promise<void>
}