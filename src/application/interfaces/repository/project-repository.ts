import type { IProjectDocument } from "../../../infrastructure/db/models/project-model.js";
import type { IBaseRepository } from "./base-repository.js";

export interface IProjectRepository extends IBaseRepository<IProjectDocument>{
    findByCreator(creatorId: string): Promise<IProjectDocument[] | null>
}