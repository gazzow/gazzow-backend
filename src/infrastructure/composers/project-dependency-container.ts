import type { IApplicationRepository } from "../../application/interfaces/repository/application-repository.js";
import { ApplicationRepository } from "../repositories/application-repository.js";

import type { IUserRepository } from "../../application/interfaces/repository/user-repository.js";
import { UserRepository } from "../repositories/user-repository.js";

import type { IProjectRepository } from "../../application/interfaces/repository/project-repository.js";
import { ProjectRepository } from "../repositories/project-repository.js";

import type { ICreateProjectUseCase } from "../../application/interfaces/usecase/project/create-project.js";
import { CreateProjectUseCase } from "../../application/use-cases/project/create-project.js";

import type { IListProjectUseCase } from "../../application/interfaces/usecase/project/list-projects.js";
import { ListProjectUseCase } from "../../application/use-cases/project/list-projects.js";

import type { ICreateApplicationUseCase } from "../../application/interfaces/usecase/project/create-application.js";
import { ApplyProjectUseCase } from "../../application/use-cases/project/create-application.js";

import type { IListApplicationsUseCase } from "../../application/interfaces/usecase/project/list-applications.js";
import { ListApplicationsUseCase } from "../../application/use-cases/project/list-applications.js";

import type { IProjectMapper } from "../../application/mappers/project.js";
import { ProjectMapper } from "../../application/mappers/project.js";

import type { IApplicationMapper } from "../../application/mappers/application.js";
import { ApplicationMapper } from "../../application/mappers/application.js";

import { ProjectController } from "../../presentation/controllers/project-controller.js";

import { ApplicationModel } from "../db/models/application-model.js";
import { ProjectModel } from "../db/models/project-model.js";
import { UserModel } from "../db/models/user-model.js";
import type { IListMyProjectsUsecase } from "../../application/interfaces/usecase/project/list-my-projects.js";
import { ListMyProjectsUseCase } from "../../application/use-cases/project/list-my-projects.js";
import type { IGetProjectUseCase } from "../../application/interfaces/usecase/project/get-project.js";
import { GetProjectUseCase } from "../../application/use-cases/project/get-project.js";
import type { IUpdateApplicationStatusUseCase } from "../../application/interfaces/usecase/project/update-application-status.js";
import { UpdateApplicationStatusUseCase } from "../../application/use-cases/project/update-application-status.js";

export class ProjectDependencyContainer {
  private readonly _userRepository: IUserRepository;
  private readonly _projectRepository: IProjectRepository;
  private readonly _applicationRepository: IApplicationRepository;
  private readonly _projectMapper: IProjectMapper;
  private readonly _applicationMapper: IApplicationMapper;

  constructor() {
    this._userRepository = new UserRepository(UserModel);
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

  private createGetProjectUseCase(): IGetProjectUseCase {
    return new GetProjectUseCase(this._projectRepository, this._projectMapper);
  }

  private createListProjectUseCase(): IListProjectUseCase {
    return new ListProjectUseCase(this._projectRepository, this._projectMapper);
  }

  private createApplyProjectUseCase(): ICreateApplicationUseCase {
    return new ApplyProjectUseCase(
      this._projectRepository,
      this._applicationRepository,
      this._applicationMapper
    );
  }

  private createListApplicationsUseCase(): IListApplicationsUseCase {
    return new ListApplicationsUseCase(
      this._applicationRepository,
      this._projectRepository,
      this._applicationMapper
    );
  }

  private createListMyProjectUseCase(): IListMyProjectsUsecase {
    return new ListMyProjectsUseCase(
      this._userRepository,
      this._projectRepository,
      this._projectMapper
    );
  }

  private createUpdateApplicationStatus(): IUpdateApplicationStatusUseCase {
    return new UpdateApplicationStatusUseCase(
      this._projectRepository,
      this._applicationRepository,
    );
  }

  createProjectController(): ProjectController {
    return new ProjectController(
      this.createProjectUseCase(),
      this.createGetProjectUseCase(),
      this.createListProjectUseCase(),
      this.createApplyProjectUseCase(),
      this.createListApplicationsUseCase(),
      this.createListMyProjectUseCase(),
      this.createUpdateApplicationStatus()
    );
  }
}
