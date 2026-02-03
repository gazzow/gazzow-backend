import type {
  IRegisterUserRequestDTO,
  IRegisterUserResponseDTO,
} from "../../../../dtos/user/user.js";

export interface IRegisterUserUseCase {
  execute(dto: IRegisterUserRequestDTO): Promise<IRegisterUserResponseDTO>;
}
