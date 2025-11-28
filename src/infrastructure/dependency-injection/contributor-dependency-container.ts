import type { IApplicationRepository } from "../../application/interfaces/repository/application-repository.js";
import type { IProjectRepository } from "../../application/interfaces/repository/project-repository.js";
import type { IListContributorProjectsUseCase } from "../../application/interfaces/usecase/project/list-contributor-projects.js";
import type { IListContributorProposalsUseCase } from "../../application/interfaces/usecase/project/list-contributor-proposals.js";
import {
  ApplicationMapper,
  type IApplicationMapper,
} from "../../application/mappers/application.js";
import {
  ProjectMapper,
  type IProjectMapper,
} from "../../application/mappers/project.js";
import { ListContributorProjectsUseCase } from "../../application/use-cases/project/list-contributor-projects.js";
import { ListContributorProposalUseCase } from "../../application/use-cases/project/list-contributor-proposals.js";
import { ContributorController } from "../../presentation/controllers/contribution-controller.js";
import { ApplicationModel } from "../db/models/application-model.js";
import { ProjectModel } from "../db/models/project-model.js";
import { ApplicationRepository } from "../repositories/application-repository.js";
import { ProjectRepository } from "../repositories/project-repository.js";

export class ContributorDependencyContainer {
  private readonly _projectRepository: IProjectRepository;
  private readonly _applicationRepository: IApplicationRepository;
  private readonly _projectMapper: IProjectMapper;
  private readonly _applicationMapper: IApplicationMapper;

  constructor() {
    this._projectRepository = new ProjectRepository(ProjectModel);
    this._applicationRepository = new ApplicationRepository(ApplicationModel);
    this._projectMapper = new ProjectMapper();
    this._applicationMapper = new ApplicationMapper();
  }

  private createListContributorProjectsUseCase(): IListContributorProjectsUseCase {
    return new ListContributorProjectsUseCase(
      this._projectRepository,
      this._projectMapper
    );
  }

  private createListContributorProposalsUseCase(): IListContributorProposalsUseCase {
    return new ListContributorProposalUseCase(
      this._applicationRepository,
      this._applicationMapper
    );
  }

  // Contributor Controller
  public createContributorController() {
    return new ContributorController(
      this.createListContributorProjectsUseCase(),
      this.createListContributorProposalsUseCase()
    );
  }
}
