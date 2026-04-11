import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application, Request, Response } from 'express';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TwinSouq API Documentation',
      version: '1.0.0',
      description:
        'API documentation for the TwinSouq E-Commerce backend. Success responses use `{ success, message, data, statusCode }`. Errors from `BaseError` and Zod validation use `{ success: false, message, statusCode }`. Multer file-limit errors use `{ success: false, error, statusCode }`. Use **Bearer JWT** where a route documents `security: bearerAuth`. Public routes explicitly set `security: []`.',
    },
    servers: [
      {
        url: '/',
        description: 'API root (paths are absolute, e.g. /api/users/login)',
      },
    ],
    tags: [
      { name: 'General', description: 'Health and misc' },
      { name: 'Users', description: 'User auth and profile' },
      { name: 'Admins', description: 'Admin auth and management' },
      { name: 'Providers', description: 'Provider onboarding and dashboard' },
      { name: 'Categories', description: 'Product categories' },
      { name: 'Options', description: 'Product options (admin + public)' },
      { name: 'Products', description: 'Catalog and provider products' },
      { name: 'Carts', description: 'Shopping cart' },
      { name: 'Reviews', description: 'Product reviews' },
      { name: 'Addresses', description: 'User and provider addresses' },
      { name: 'Orders', description: 'Orders and installments' },
      { name: 'Favorites', description: 'User favorites' },
      { name: 'Notifications', description: 'Push tokens' },
      { name: 'Earnings', description: 'Wallet and payouts' },
      { name: 'Settings', description: 'Site settings' },
      { name: 'Files', description: 'Uploads and file cleanup' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        SuccessEnvelope: {
          type: 'object',
          required: ['success', 'message', 'statusCode'],
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Operation completed' },
            data: { description: 'Payload; may be null or omitted for void responses' },
            statusCode: { type: 'integer', example: 200 },
          },
        },
        ApiError: {
          type: 'object',
          required: ['success', 'message', 'statusCode'],
          properties: {
            success: { type: 'boolean', example: false },
            message: {
              type: 'string',
              description: 'Translated error key or message from i18n',
              example: 'Unauthorized',
            },
            statusCode: { type: 'integer', example: 401 },
          },
        },
        MulterFileError: {
          type: 'object',
          required: ['success', 'error', 'statusCode'],
          properties: {
            success: { type: 'boolean', example: false },
            error: { type: 'string', example: 'File size limit exceeded' },
            statusCode: { type: 'integer', example: 400 },
          },
        },
        PaginationQuery: {
          type: 'object',
          properties: {
            page: { type: 'integer', minimum: 1, default: 1, example: 1 },
            limit: { type: 'integer', minimum: 1, default: 10, example: 10 },
          },
        },
      },
      responses: {
        BadRequest: {
          description:
            'Bad request — invalid input, wrong file type, or business rule (maps to `BadRequestError`, `InvalidFileTypeError`, etc.)',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiError' },
              examples: {
                badRequest: {
                  summary: 'Generic 400',
                  value: {
                    success: false,
                    message: 'Bad Request',
                    statusCode: 400,
                  },
                },
                invalidFile: {
                  summary: 'Invalid file type (upload middleware)',
                  value: {
                    success: false,
                    message: 'Only images, videos, and PDFs are allowed!',
                    statusCode: 400,
                  },
                },
              },
            },
          },
        },
        MulterBadRequest: {
          description: 'Multipart limit or unexpected field (Multer)',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/MulterFileError' },
              example: {
                success: false,
                error: 'File size limit exceeded',
                statusCode: 400,
              },
            },
          },
        },
        Unauthorized: {
          description: 'Missing or invalid JWT, or invalid credentials (`UnauthorizedError`, `InvalidCredentialsError`)',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiError' },
              examples: {
                noToken: {
                  summary: 'No token',
                  value: {
                    success: false,
                    message: 'No token provided',
                    statusCode: 401,
                  },
                },
                invalidToken: {
                  summary: 'Invalid token',
                  value: {
                    success: false,
                    message: 'Invalid token',
                    statusCode: 401,
                  },
                },
              },
            },
          },
        },
        Forbidden: {
          description: 'Authenticated but not allowed (`ForbiddenError`, `UnverifiedAccount`)',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiError' },
              example: {
                success: false,
                message: 'Forbidden area',
                statusCode: 403,
              },
            },
          },
        },
        NotFound: {
          description: 'Resource not found (`NotFoundError`, `NoRouteFound`)',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiError' },
              example: {
                success: false,
                message: 'Resource not found',
                statusCode: 404,
              },
            },
          },
        },
        Conflict: {
          description: 'Conflict — duplicate title, limits, etc. (`ConflictError`)',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiError' },
              example: {
                success: false,
                message: 'title_of_the_address_exits',
                statusCode: 409,
              },
            },
          },
        },
        UnprocessableEntity: {
          description:
            'Validation failed — Zod parse errors or `ValidationError` / `UnprocessableEntityError` (status 422)',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiError' },
              examples: {
                zod: {
                  summary: 'Zod (first issue message, translated)',
                  value: {
                    success: false,
                    message: 'Invalid email format',
                    statusCode: 422,
                  },
                },
                businessValidation: {
                  summary: 'Domain validation',
                  value: {
                    success: false,
                    message: 'sale_price_higher_than_price',
                    statusCode: 422,
                  },
                },
              },
            },
          },
        },
        InternalServerError: {
          description: 'Unexpected server error',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiError' },
              example: {
                success: false,
                message: 'Something went wrong',
                statusCode: 500,
              },
            },
          },
        },
      },
    },
  },
  apis: ['./src/modules/**/*.ts', './src/app.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Application) => {
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      explorer: true,
    }),
  );

  app.get('/api-docs.json', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
};
