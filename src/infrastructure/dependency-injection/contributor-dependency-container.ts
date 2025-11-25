import type { IProjectRepository } from "../../application/interfaces/repository/project-repository.js";
import type { IListContributorProjectsUseCase } from "../../application/interfaces/usecase/project/list-contributor-projects.js";
import {
  ProjectMapper,
  type IProjectMapper,
} from "../../application/mappers/project.js";
import { ListContributorProjectsUseCase } from "../../application/use-cases/project/list-contributor-projects.js";
import { ContributorController } from "../../presentation/controllers/contribution-controller.js";
import { ProjectModel } from "../db/models/project-model.js";
import { ProjectRepository } from "../repositories/project-repository.js";

export class ContributorDependencyContainer {
  private readonly _projectRepository: IProjectRepository;
  private readonly _projectMapper: IProjectMapper;

  constructor() {
    this._projectRepository = new ProjectRepository(ProjectModel);
    this._projectMapper = new ProjectMapper();
  }

  private createListContributorProjectsUseCase(): IListContributorProjectsUseCase {
    return new ListContributorProjectsUseCase(
      this._projectRepository,
      this._projectMapper
    );
  }

  // Contributor Controller
  public createContributorController() {
    return new ContributorController(
      this.createListContributorProjectsUseCase()
    );
  }
}
