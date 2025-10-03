import express from 'express';
import { ProjectDependencyContainer } from '../../infrastructure/composers/project-dependency-container.js';

const router = express.Router();

const projectContainer = new ProjectDependencyContainer();
const projectController = projectContainer.createProjectController();

router.get('/', projectController.listAll)
router.post('/', projectController.create)


export default router;