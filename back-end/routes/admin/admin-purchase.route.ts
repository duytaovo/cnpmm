import { Router } from 'express'
import helpersMiddleware from '../../middleware/helpers.middleware'
import authMiddleware from '../../middleware/auth.middleware'
import { wrapAsync } from '../../utils/response'
import adminPurchaseController from '../../controllers/admin/purchase.controller'

const adminPurchaseRouter = Router()
adminPurchaseRouter.get(
  '',
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  helpersMiddleware.entityValidator,
  wrapAsync(adminPurchaseController.getPurchases)
)
adminPurchaseRouter.get(
  '/detail/:_id',
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  helpersMiddleware.idValidator,
  wrapAsync(adminPurchaseController.getPurchaseDetail)
)

adminPurchaseRouter.put(
  '/updateGetting/:_id',
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  helpersMiddleware.idValidator,
  helpersMiddleware.entityValidator,
  wrapAsync(adminPurchaseController.updateGetting)
)
adminPurchaseRouter.put(
  '/updateProgress/:_id',
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  helpersMiddleware.idValidator,
  helpersMiddleware.entityValidator,
  wrapAsync(adminPurchaseController.updateProgress)
)
adminPurchaseRouter.put(
  '/updateDelivered/:_id',
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  helpersMiddleware.idValidator,
  helpersMiddleware.entityValidator,
  wrapAsync(adminPurchaseController.updateDelivered)
)

adminPurchaseRouter.put(
  '/updateCancel/:_id',
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  helpersMiddleware.idValidator,
  helpersMiddleware.entityValidator,
  wrapAsync(adminPurchaseController.updateCancel)
)

adminPurchaseRouter.delete(
  '/delete/:_id',
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  helpersMiddleware.idValidator,
  wrapAsync(adminPurchaseController.deletePurchases)
)

export default adminPurchaseRouter
