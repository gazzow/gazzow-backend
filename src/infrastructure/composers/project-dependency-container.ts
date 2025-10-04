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

export class ProjectDependencyContainer {
  private readonly _projectRepository: IProjectRepository;
  private readonly _projectMapper: IProjectMapper;

  constructor() {
    this._projectRepository = new ProjectRepository(ProjectModel);
    this._projectMapper = new ProjectMapper();
  }

  private createProjectUseCase(): ICreateProjectUseCase {
    return new CreateProjectUseCase(this._projectRepository, this._projectMapper);
  }

  private createListProjectUseCase(): IListProjectUseCase {
    return new ListProjectUseCase(this._projectRepository, this._projectMapper);
  }

  createProjectController(): ProjectController {
    return new ProjectController(
      this.createProjectUseCase(),
      this.createListProjectUseCase()
    );
  }
}
