import type {
  IListContributorProposalsRequestDTO,
  IListContributorProposalsResponseDTO,
} from "../../../dtos/contributor.js";

export interface IListContributorProposalsUseCase {
  execute(
    dto: IListContributorProposalsRequestDTO
  ): Promise<IListContributorProposalsResponseDTO>;
}
