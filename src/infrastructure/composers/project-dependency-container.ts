import type { ICreateProjectUseCase } from "../../application/interfaces/usecase/project/create-project.js";
import { CreateProjectUseCase } from "../../application/use-cases/project/create-project.js";

import type { IProjectMapper } from "../../application/mappers/project.js";
import { ProjectMapper } from "../../application/mappers/project.js";

import type { IProjectRepository } from "../../application/interfaces/repository/project-repository.js";
import { ProjectRepository } from "../repositories/project-repository.js";

import type { IListProjectUseCase } from "../../application/interfaces/usecase/project/list-projects.js";
import { ListProjectUseCase } from "../../application/use-cases/project/list-projects.js";

import { ProjectController } from "../../presentation/controllers/project-controller.js";
import { ProjectModel } from "../db/models/project-model.js";
import type { IApplyProjectUseCase } from "../../application/interfaces/usecase/project/apply-project.js";
import { ApplyProjectUseCase } from "../../application/use-cases/project/apply-project.js";
import type { IApplicationRepository } from "../../application/interfaces/repository/application-repository.js";
import {
  ApplicationMapper,
  type IApplicationMapper,
} from "../../application/mappers/application.js";
import { ApplicationRepository } from "../repositories/application-repository.js";
import { ApplicationModel } from "../db/models/application-model.js";

export class ProjectDependencyContainer {
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

  private createProjectUseCase(): ICreateProjectUseCase {
    return new CreateProjectUseCase(
      this._projectRepository,
      this._projectMapper
    );
  }

  private createListProjectUseCase(): IListProjectUseCase {
    return new ListProjectUseCase(this._projectRepository, this._projectMapper);
  }

  private createApplyProjectUseCase(): IApplyProjectUseCase {
    return new ApplyProjectUseCase(
      this._projectRepository,
      this._applicationRepository,
      this._applicationMapper
    );
  }

  createProjectController(): ProjectController {
    return new ProjectController(
      this.createProjectUseCase(),
      this.createListProjectUseCase(),
      this.createApplyProjectUseCase(),
    );
  }
}
