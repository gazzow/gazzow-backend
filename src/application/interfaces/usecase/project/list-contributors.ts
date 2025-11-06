import type { IListContributorsRequestDTO, IListContributorsResponseDTO } from "../../../dtos/project.js";

export interface IListContributorsUseCase {
  execute(dto: IListContributorsRequestDTO): Promise<IListContributorsResponseDTO>;
}
