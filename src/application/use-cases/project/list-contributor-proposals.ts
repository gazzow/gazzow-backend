import type {
  IListContributorProposalsRequestDTO,
  IListContributorProposalsResponseDTO,
} from "../../dtos/contributor.js";
import type { IApplicationRepository } from "../../interfaces/repository/application-repository.js";
import type { IListContributorProposalsUseCase } from "../../interfaces/usecase/project/list-contributor-proposals.js";
import type { IApplicationMapper } from "../../mappers/application.js";

export class ListContributorProposalUseCase
  implements IListContributorProposalsUseCase
{
  constructor(
    private _applicationRepository: IApplicationRepository,
    private _applicationMapper: IApplicationMapper
  ) {}

  async execute(
    dto: IListContributorProposalsRequestDTO
  ): Promise<IListContributorProposalsResponseDTO> {
    const { applications, total } =
      await this._applicationRepository.findApplicationsWithPopulatedProject(
        dto
      );

    const data = applications.map((docs) =>
      this._applicationMapper.toResponseWithProjectDTO(docs)
    );

    return {
      data,
      pagination: {
        total,
        skip: dto.skip,
        limit: dto.limit,
      },
    };
  }
}
