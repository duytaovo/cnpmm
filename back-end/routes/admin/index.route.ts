import adminUserRouter from './admin-user.route'
import adminCategoryRouter from './admin-category.route'
import adminProductRouter from './admin-product.route'
import adminPurchaseRouterRouter from './admin-purchase.route'

const adminRoutes = {
  prefix: '/admin/',
  routes: [
    {
      path: 'users',
      route: adminUserRouter,
    },
    {
      path: 'purchases',
      route: adminPurchaseRouterRouter,
    },
    {
      path: 'products',
      route: adminProductRouter,
    },
    {
      path: 'categories',
      route: adminCategoryRouter,
    },
  ],
}

export default adminRoutes
