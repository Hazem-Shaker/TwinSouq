import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';

import { UserModule } from './modules/users';
import { AdminModule } from './modules/admins';
import { FileModule } from './modules/File';
import { SettingModule } from './modules/settings';
import { ProviderModule } from './modules/providers';
import { CategoryModule } from './modules/categories';
import { ProductModule } from './modules/products';
import { OptionModule } from './modules/options';
import { ReviewModule } from './modules/reviews';
import { CartModule } from './modules/carts';
import { AddressModule } from './modules/addresses';
import { OrderModule } from './modules/orders';
import { PaymentModule } from './modules/payment';
import { FavoriteModule } from './modules/favorites';
import { NotificationModule } from './modules/notifications';
import { EarningModule } from './modules/earnings';

import { connectDatabase } from './shared/database/connect';
import { errorHandler } from './shared/middlewares/errorHandler';
import { noRoute } from './shared/middlewares/noRoute';
import { successMiddleware } from './shared/middlewares/successResponse';
import { MailerService } from './shared/utils/email-system/mailer';
import { languageMiddleware } from './shared/middlewares/languageCheck';
import { i18nMiddleware } from './shared/middlewares/i18n';

import { initScheduler } from './shared/scheduler';

import {
  UserAuthMiddleware,
  AdminAuthMiddleware,
} from './shared/middlewares/auth';

import logger from './shared/utils/logger'; // Logger

// Factory function to create an Express app
const appFactory = () => {
  const app: Application = express();

  // Middleware to parse JSON
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(morgan('dev'));

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or Postman)
        if (!origin) return callback(null, true);
        return callback(null, true); // Allow all origins
      },
      credentials: true, // Allow credentials (cookies)
    }),
  );

  app.use('/uploads', express.static('uploads'));

  // Middleware to send success responses
  app.use(successMiddleware);

  // Language middleware
  app.use(languageMiddleware);
  app.use(i18nMiddleware);

  // Health check route
  app.post('/api/health', (req, res) => {
    res.sendSuccess('Server is running', req.body, 200);
  });
  // Database connection (with error handling)
  connectDatabase()
    .then(() => {
      logger.info('Database connected successfully');
    })
    .catch((error) => {
      logger.error(`Database connection failed: ${error.message}`);
      process.exit(1); // Exit process if DB connection fails
    });

  const mailerService = new MailerService();
  const adminAuthMiddleware = new AdminAuthMiddleware();

  const fileModule = new FileModule();
  app.use('/api/files', fileModule.routerFactory());

  const userModule = new UserModule(mailerService);
  app.use('/api/users', userModule.routerFactory());

  const adminModule = new AdminModule(adminAuthMiddleware);
  app.use('/api/admins', adminModule.routerFactory());

  const providerModule = new ProviderModule(fileModule.fileService);
  app.use('/api/providers', providerModule.routerFactory());

  const settingModule = new SettingModule();
  app.use('/api/settings', settingModule.routerFactory());

  const categoryModule = new CategoryModule();
  app.use('/api/categories', categoryModule.routerFactory());

  const optionModule = new OptionModule(categoryModule.categoryService);
  app.use('/api/options', optionModule.routerFactory());

  const productModule = new ProductModule(
    categoryModule.categoryService,
    optionModule.optionService,
    providerModule.providerService,
  );
  app.use('/api/products', productModule.routerFactory());

  const cartModule = new CartModule(productModule.productService);
  app.use('/api/carts', cartModule.routerFactory());

  const reviewModule = new ReviewModule(productModule.productService);
  app.use('/api/reviews', reviewModule.routerFactory());

  const paymentModule = new PaymentModule();
  app.use('/api/payment', paymentModule.routerFactory());

  const addressModule = new AddressModule();
  app.use('/api/addresses', addressModule.routerFactory());

  const earningModule = new EarningModule();
  app.use('/api/earnings', earningModule.routerFactory());

  const orderModule = new OrderModule(
    productModule.productService,
    cartModule.cartService,
    paymentModule.paymentService,
    addressModule.addressService,
    earningModule.earningService,
  );
  app.use('/api/orders', orderModule.routerFactory());

  const favoriteModule = new FavoriteModule();
  app.use('/api/favorites', favoriteModule.routerFactory());

  const notificationModule = new NotificationModule();
  app.use('/api/notifications', notificationModule.routerFactory());

  app.use('*', noRoute);

  app.use(errorHandler);

  (async () => {
    await initScheduler();
  })();

  return app;
};

export default appFactory;
