import { Request, Response, NextFunction, Router } from "express";
import ownershipMiddleware from "../middlewares/ownershipMiddleware";
import { GLOBAL_PERMISSIONS } from "../constants/globalPermissions";
import addUserTechnologyValidation from "../validations/addUserTechnology";
import technologiesController from "../controllers/technologiesController";
import removeUserTechnologyValidation from "../validations/removeUserTechnology";
import getTechnologiesValidation from "../validations/getTechnologies";
import projectRoleMiddleware from "../middlewares/projectRoleMiddleware";
import { PROJECT_PERMISSIONS } from "../constants/projectPermissions";
import addProjectTechnologyValidation from "../validations/addProjectTechnology";
import removeProjectTechnologyValidation from "../validations/removeProjectTechnology";

const technologiesRouter = Router();

technologiesRouter.get(
  "/",
  getTechnologiesValidation,
  technologiesController.getTechnologies
);

technologiesRouter.post(
  "/add/user",
  ownershipMiddleware(
    "body",
    GLOBAL_PERMISSIONS.addOwnTechnologies,
    GLOBAL_PERMISSIONS.addTechnologies
  ),
  addUserTechnologyValidation,
  technologiesController.addUserTechnology
);

technologiesRouter.post(
  "/add/project",
  async (req: Request, res: Response, next: NextFunction) => {
    const { projectID } = req.body;
    projectRoleMiddleware(
      GLOBAL_PERMISSIONS.updateProjects,
      PROJECT_PERMISSIONS.addTechnologiesProject,
      projectID
    )(req, res, next);
  },
  addProjectTechnologyValidation,
  technologiesController.addProjectTechnology
);

technologiesRouter.delete(
  "/remove/user/:id",
  ownershipMiddleware(
    "query",
    GLOBAL_PERMISSIONS.removeOwnTechnologies,
    GLOBAL_PERMISSIONS.removeTechnologies
  ),
  removeUserTechnologyValidation,
  technologiesController.removeUserTechnology
);

technologiesRouter.delete(
  "/remove/project/:id",
  (req: Request, res: Response, next: NextFunction) => {
    let projectID = parseInt(req.params.id);

    projectRoleMiddleware(
      GLOBAL_PERMISSIONS.updateProjects,
      PROJECT_PERMISSIONS.removeTechnologiesProject,
      projectID || 0
    )(req, res, next);
  },
  removeProjectTechnologyValidation,
  technologiesController.removeProjectTechnology
);

export default technologiesRouter;
