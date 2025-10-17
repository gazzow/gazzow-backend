import express from 'express';
import { ProjectDependencyContainer } from '../../infrastructure/composers/project-dependency-container.js';
import { AuthDependencyContainer } from '../../infrastructure/composers/auth-dependency-container.js';

const router = express.Router();

const authContainer = new AuthDependencyContainer();
const tokenMiddleware = authContainer.createTokenMiddleware();

const projectContainer = new ProjectDependencyContainer();
const projectController = projectContainer.createProjectController();

router.get('/',tokenMiddleware.verifyToken, projectController.listAll)
router.post('/',tokenMiddleware.verifyToken, projectController.create)
router.post('/:projectId/apply', tokenMiddleware.verifyToken, projectController.applyProject)


export default router;