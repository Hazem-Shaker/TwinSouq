"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const users_1 = require("./modules/users");
const admins_1 = require("./modules/admins");
const File_1 = require("./modules/File");
const settings_1 = require("./modules/settings");
const providers_1 = require("./modules/providers");
const categories_1 = require("./modules/categories");
const products_1 = require("./modules/products");
const options_1 = require("./modules/options");
const reviews_1 = require("./modules/reviews");
const carts_1 = require("./modules/carts");
const addresses_1 = require("./modules/addresses");
const orders_1 = require("./modules/orders");
const payment_1 = require("./modules/payment");
const favorites_1 = require("./modules/favorites");
const notifications_1 = require("./modules/notifications");
const earnings_1 = require("./modules/earnings");
const connect_1 = require("./shared/database/connect");
const errorHandler_1 = require("./shared/middlewares/errorHandler");
const noRoute_1 = require("./shared/middlewares/noRoute");
const successResponse_1 = require("./shared/middlewares/successResponse");
const mailer_1 = require("./shared/utils/email-system/mailer");
const languageCheck_1 = require("./shared/middlewares/languageCheck");
const i18n_1 = require("./shared/middlewares/i18n");
const scheduler_1 = require("./shared/scheduler");
const auth_1 = require("./shared/middlewares/auth");
const logger_1 = __importDefault(require("./shared/utils/logger")); // Logger
// Factory function to create an Express app
const appFactory = () => {
    const app = (0, express_1.default)();
    // Middleware to parse JSON
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use(express_1.default.json());
    app.use((0, morgan_1.default)('dev'));
    app.use((0, cors_1.default)({
        origin: (origin, callback) => {
            // Allow requests with no origin (like mobile apps or Postman)
            if (!origin)
                return callback(null, true);
            return callback(null, true); // Allow all origins
        },
        credentials: true, // Allow credentials (cookies)
    }));
    app.use('/uploads', express_1.default.static('uploads'));
    // Middleware to send success responses
    app.use(successResponse_1.successMiddleware);
    // Language middleware
    app.use(languageCheck_1.languageMiddleware);
    app.use(i18n_1.i18nMiddleware);
    // Health check route
    app.post('/api/health', (req, res) => {
        res.sendSuccess('Server is running', req.body, 200);
    });
    // Database connection (with error handling)
    (0, connect_1.connectDatabase)()
        .then(() => {
        logger_1.default.info('Database connected successfully');
    })
        .catch((error) => {
        logger_1.default.error(`Database connection failed: ${error.message}`);
        process.exit(1); // Exit process if DB connection fails
    });
    const mailerService = new mailer_1.MailerService();
    const adminAuthMiddleware = new auth_1.AdminAuthMiddleware();
    const fileModule = new File_1.FileModule();
    app.use('/api/files', fileModule.routerFactory());
    const userModule = new users_1.UserModule(mailerService);
    app.use('/api/users', userModule.routerFactory());
    const adminModule = new admins_1.AdminModule(adminAuthMiddleware);
    app.use('/api/admins', adminModule.routerFactory());
    const providerModule = new providers_1.ProviderModule(fileModule.fileService);
    app.use('/api/providers', providerModule.routerFactory());
    const settingModule = new settings_1.SettingModule();
    app.use('/api/settings', settingModule.routerFactory());
    const categoryModule = new categories_1.CategoryModule();
    app.use('/api/categories', categoryModule.routerFactory());
    const optionModule = new options_1.OptionModule(categoryModule.categoryService);
    app.use('/api/options', optionModule.routerFactory());
    const productModule = new products_1.ProductModule(categoryModule.categoryService, optionModule.optionService, providerModule.providerService);
    app.use('/api/products', productModule.routerFactory());
    const cartModule = new carts_1.CartModule(productModule.productService);
    app.use('/api/carts', cartModule.routerFactory());
    const reviewModule = new reviews_1.ReviewModule(productModule.productService);
    app.use('/api/reviews', reviewModule.routerFactory());
    const paymentModule = new payment_1.PaymentModule();
    app.use('/api/payment', paymentModule.routerFactory());
    const addressModule = new addresses_1.AddressModule();
    app.use('/api/addresses', addressModule.routerFactory());
    const earningModule = new earnings_1.EarningModule();
    app.use('/api/earnings', earningModule.routerFactory());
    const orderModule = new orders_1.OrderModule(productModule.productService, cartModule.cartService, paymentModule.paymentService, addressModule.addressService, earningModule.earningService);
    app.use('/api/orders', orderModule.routerFactory());
    const favoriteModule = new favorites_1.FavoriteModule();
    app.use('/api/favorites', favoriteModule.routerFactory());
    const notificationModule = new notifications_1.NotificationModule();
    app.use('/api/notifications', notificationModule.routerFactory());
    app.use('*', noRoute_1.noRoute);
    app.use(errorHandler_1.errorHandler);
    (async () => {
        await (0, scheduler_1.initScheduler)();
    })();
    return app;
};
exports.default = appFactory;
