import type { IApplicationRepository } from "../../application/interfaces/repository/application-repository.js";
import type { IProjectRepository } from "../../application/interfaces/repository/project-repository.js";
import type { ITaskRepository } from "../../application/interfaces/repository/task-repository.js";
import type { IListCompletedContributionsUseCase } from "../../application/interfaces/usecase/project/list-completed-contributions.js";
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
import {
  TaskMapper,
  type ITaskMapper,
} from "../../application/mappers/task.js";
import { ListCompletedContributionsUseCase } from "../../application/use-cases/project/list-completed-contributions.js";
import { ListContributorProjectsUseCase } from "../../application/use-cases/project/list-contributor-projects.js";
import { ListContributorProposalUseCase } from "../../application/use-cases/project/list-contributor-proposals.js";
import { ContributorController } from "../../presentation/controllers/contribution.controller.js";
import { ApplicationModel } from "../db/models/application-model.js";
import { ProjectModel } from "../db/models/project-model.js";
import { TaskModel } from "../db/models/task-model.js";
import { ApplicationRepository } from "../repositories/application-repository.js";
import { ProjectRepository } from "../repositories/project-repository.js";
import { TaskRepository } from "../repositories/task-repository.js";

export class ContributorDependencyContainer {
  private readonly _projectRepository: IProjectRepository;
  private readonly _applicationRepository: IApplicationRepository;
  private readonly _projectMapper: IProjectMapper;
  private readonly _applicationMapper: IApplicationMapper;
  private readonly _taskRepository: ITaskRepository;
  private readonly _taskMapper: ITaskMapper;

  constructor() {
    this._projectRepository = new ProjectRepository(ProjectModel);
    this._applicationRepository = new ApplicationRepository(ApplicationModel);
    this._taskRepository = new TaskRepository(TaskModel);
    this._projectMapper = new ProjectMapper();
    this._applicationMapper = new ApplicationMapper();
    this._taskMapper = new TaskMapper();
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

  private createListCompletedContributionsUseCase(): IListCompletedContributionsUseCase {
    return new ListCompletedContributionsUseCase(
      this._projectRepository,
      this._taskRepository,
      this._projectMapper,
      this._taskMapper
    );
  }

  // Contributor Controller
  public createContributorController() {
    return new ContributorController(
      this.createListContributorProjectsUseCase(),
      this.createListContributorProposalsUseCase(),
      this.createListCompletedContributionsUseCase()
    );
  }
}
