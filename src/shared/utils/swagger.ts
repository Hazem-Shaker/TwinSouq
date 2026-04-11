import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application, Request, Response } from 'express';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TwinSouq API Documentation',
      version: '1.0.0',
      description: 'API documentation for the TwinSouq E-Commerce backend.',
    },
    servers: [
      {
        url: '/api',
        description: 'Base API URL',
      },
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
        Error: {
          type: 'object',
          properties: {
            statusCode: { type: 'integer', example: 400 },
            message: { type: 'string', example: 'Bad Request' },
          },
        },
        ValidationError: {
          type: 'object',
          properties: {
            statusCode: { type: 'integer', example: 400 },
            message: { type: 'string', example: 'Validation Error' },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string', example: 'email' },
                  message: { type: 'string', example: 'Invalid email format' },
                },
              },
            },
          },
        },
      },
      responses: {
        BadRequest: {
          description: 'Bad Request - Validation Error or Invalid Input',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ValidationError',
              },
            },
          },
        },
        Unauthorized: {
          description: 'Unauthorized - Invalid or missing token',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                statusCode: 401,
                message: 'Unauthorized',
              },
            },
          },
        },
        Forbidden: {
          description: 'Forbidden - Insufficient permissions',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                statusCode: 403,
                message: 'Forbidden area',
              },
            },
          },
        },
        NotFound: {
          description: 'Not Found - The requested resource was not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                statusCode: 404,
                message: 'Resource not found',
              },
            },
          },
        },
        InternalServerError: {
          description: 'Internal Server Error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                statusCode: 500,
                message: 'Internal server error',
              },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Paths to files containing OpenAPI definitions
  apis: ['./src/modules/**/*.ts', './src/app.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Application) => {
  // Serve Swagger UI
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      explorer: true,
    }),
  );

  // Route to get the swagger JSON
  app.get('/api-docs.json', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
};
