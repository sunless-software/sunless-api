import { Router } from "express";
import skillsController from "../controllers/skillsController";
import addUserSkillValidation from "../validations/addUserSkill";
import ownershipMiddleware from "../middlewares/ownershipMiddleware";
import { GLOBAL_PERMISSIONS } from "../constants/globalPermissions";
import removeUserSkillValidation from "../validations/removeUserSkill";

const skillsRouter = Router();

skillsRouter.post(
  "/add",
  ownershipMiddleware(
    "body",
    GLOBAL_PERMISSIONS.addOwnSkills,
    GLOBAL_PERMISSIONS.addSkills
  ),
  addUserSkillValidation,
  skillsController.addSkill
);

// Verificar si el id del usuario es el mismo que se recibe por query userID
// Si es el mismo o userID es null verificar ownPermissions, inyectar en query
// Si no es el mismo verificar otherPermissions
skillsRouter.delete(
  "/remove/:id",
  ownershipMiddleware(
    "query",
    GLOBAL_PERMISSIONS.removeOwnSkills,
    GLOBAL_PERMISSIONS.removeSkills
  ),
  removeUserSkillValidation,
  skillsController.removeSkill
);

export default skillsRouter;
