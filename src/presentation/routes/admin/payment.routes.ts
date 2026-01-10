import { Router } from "express";
import { AdminDependencyContainer } from "../../../infrastructure/dependency-injection/admin-dependency-container.js";
import { AdminPaymentContainer } from "../../../infrastructure/dependency-injection/admin/payment.container.js";

const router = Router();

const adminContainer = new AdminDependencyContainer();
const verifyMiddleware = adminContainer.createVerifyAdminMiddleware();

const adminPaymentContainer = new AdminPaymentContainer();
const paymentController = adminPaymentContainer.createPaymentController();

router.get(
  "/",
  verifyMiddleware.isAdmin,
  paymentController.listPayments
);

export default router;
