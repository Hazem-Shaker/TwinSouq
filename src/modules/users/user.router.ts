import { UserContoller } from './user.controller';
import { UserService } from './user.service';
import { Router } from 'express';
import { UserAuthMiddleware } from '../../shared/middlewares/auth';
import {
  upload,
  processImagesMiddleware,
} from '../../shared/middlewares/upload';

export class UserRouter {
  private userController: UserContoller;
  private userService: UserService;
  userAuthMiddleware: UserAuthMiddleware;

  constructor(userService: UserService) {
    this.userService = userService;
    console.log(this.userService.register);
    this.userAuthMiddleware = new UserAuthMiddleware();
    this.userController = new UserContoller(this.userService);
  }

  createRouter() {
    const router = Router();

    /**
     * @openapi
     * /api/users/register:
     *   post:
     *     tags: [Users]
     *     summary: Register a new user
     *     description: Endpoint to register a new user in the system using email, name, password, and phone.
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             required:
     *               - name
     *               - email
     *               - password
     *               - phone
     *             properties:
     *               name:
     *                 type: string
     *                 example: John Doe
     *               email:
     *                 type: string
     *                 format: email
     *                 example: john@example.com
     *               password:
     *                 type: string
     *                 format: password
     *                 example: StrongP@ssw0rd
     *               phone:
     *                 type: string
     *                 example: "+1234567890"
     *     responses:
     *       200:
     *         description: Successfully created the user, please verify OTP
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 userId:
     *                   type: string
     *                   example: "user_64f1b3e8c9d2a"
     *                 message:
     *                   type: string
     *                   example: User registered, please verify email.
     *       400:
     *         $ref: '#/components/responses/BadRequest'
     *       500:
     *         $ref: '#/components/responses/InternalServerError'
     */
    router.post(
      '/register',
      upload.any(),
      this.userController.createUser.bind(this.userController),
    );

    /**
     * @openapi
     * /api/users/verify:
     *   post:
     *     tags: [Users]
     *     summary: Verify User
     *     description: Verify an account via OTP.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - otp
     *               - userId
     *             properties:
     *               userId:
     *                 type: string
     *                 example: 64f1b3e8c9d2a...
     *               otp:
     *                 type: string
     *                 example: "1234"
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             required:
     *               - otp
     *               - userId
     *             properties:
     *               userId:
     *                 type: string
     *                 example: 64f1b3e8c9d2a...
     *               otp:
     *                 type: string
     *                 example: "1234"
     *     responses:
     *       200:
     *         description: Verification Successful
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: User successfully verified
     *                 token:
     *                   type: string
     *                   description: Login token is returned after successful verification
     *                   example: eyJhbGciOiJIUzI1...
     *       400:
     *         $ref: '#/components/responses/BadRequest'
     *       404:
     *         $ref: '#/components/responses/NotFound'
     *       500:
     *         $ref: '#/components/responses/InternalServerError'
     */
    router.post(
      '/verify',
      upload.any(),
      this.userController.verifyUser.bind(this.userController),
    );

    /**
     * @openapi
     * /api/users/resend-otp:
     *   post:
     *     tags: [Users]
     *     summary: POST /resend-otp
     *     responses:
     *       200:
     *         description: Success
     */
    router.post(
      '/resend-otp',
      upload.any(),
      this.userController.resendOtp.bind(this.userController),
    );

    /**
     * @openapi
     * /api/users/login:
     *   post:
     *     tags: [Users]
     *     summary: User login
     *     description: Authenticate a user by email and password and return a JWT.
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             required:
     *               - email
     *               - password
     *             properties:
     *               email:
     *                 type: string
     *                 format: email
     *                 example: john@example.com
     *               password:
     *                 type: string
     *                 format: password
     *                 example: StrongP@ssw0rd
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - email
     *               - password
     *             properties:
     *               email:
     *                 type: string
     *                 format: email
     *                 example: john@example.com
     *               password:
     *                 type: string
     *                 format: password
     *                 example: StrongP@ssw0rd
     *     responses:
     *       200:
     *         description: Login successful
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 token:
     *                   type: string
     *                   example: eyJhbGciOiJIUzI1...
     *                 user:
     *                   type: object
     *                   properties:
     *                     id:
     *                       type: string
     *                       example: 603d2b...
     *                     email:
     *                       type: string
     *                       example: john@example.com
     *       400:
     *         $ref: '#/components/responses/BadRequest'
     *       401:
     *         $ref: '#/components/responses/Unauthorized'
     *       404:
     *         $ref: '#/components/responses/NotFound'
     *       500:
     *         $ref: '#/components/responses/InternalServerError'
     */
    router.post(
      '/login',
      upload.any(),
      this.userController.login.bind(this.userController),
    );

    /**
     * @openapi
     * /api/users/update-password:
     *   post:
     *     tags: [Users]
     *     summary: POST /update-password
     *     responses:
     *       200:
     *         description: Success
     */
    router.post(
      '/update-password',
      upload.any(),
      this.userAuthMiddleware.authenticate.bind(this.userAuthMiddleware),
      this.userController.updatePassword.bind(this.userController),
    );

    /**
     * @openapi
     * /api/users/request-password-reset:
     *   post:
     *     tags: [Users]
     *     summary: POST /request-password-reset
     *     responses:
     *       200:
     *         description: Success
     */
    router.post(
      '/request-password-reset',
      upload.any(),
      this.userController.requestPasswordReset.bind(this.userController),
    );

    /**
     * @openapi
     * /api/users/verify-reset-password-otp:
     *   post:
     *     tags: [Users]
     *     summary: POST /verify-reset-password-otp
     *     responses:
     *       200:
     *         description: Success
     */
    router.post(
      '/verify-reset-password-otp',
      upload.any(),
      this.userController.verifyResetPasswordOtp.bind(this.userController),
    );

    /**
     * @openapi
     * /api/users/reset-password:
     *   post:
     *     tags: [Users]
     *     summary: POST /reset-password
     *     responses:
     *       200:
     *         description: Success
     */
    router.post(
      '/reset-password',
      upload.any(),
      this.userController.resetPassword.bind(this.userController),
    );

    /**
     * @openapi
     * /api/users/be-provider:
     *   put:
     *     tags: [Users]
     *     summary: PUT /be-provider
     *     responses:
     *       200:
     *         description: Success
     */
    router.put(
      '/be-provider',
      upload.any(),
      this.userAuthMiddleware.authenticate.bind(this.userAuthMiddleware),
      this.userController.beProvider.bind(this.userController),
    );

    /**
     * @openapi
     * /api/users:
     *   put:
     *     tags: [Users]
     *     security:
     *       - bearerAuth: []
     *     summary: Update User
     *     description: Modifies user data (name, phone) and optionally updates the profile photo. Requires user authentication token.
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *                 example: Jane Doe
     *               phone:
     *                 type: string
     *                 example: "+9876543210"
     *               photo:
     *                 type: string
     *                 format: binary
     *                 description: User profile picture (image file)
     *     responses:
     *       200:
     *         description: Profile updated
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: User profile updated successfully
     *                 user:
     *                   type: object
     *                   properties:
     *                     id:
     *                       type: string
     *                       example: 603d2b...
     *                     name:
     *                       type: string
     *                       example: Jane Doe
     *                     photo:
     *                       type: string
     *                       example: "https://bucket.s3.region.amazonaws.com/xyz.jpg"
     *       400:
     *         $ref: '#/components/responses/BadRequest'
     *       401:
     *         $ref: '#/components/responses/Unauthorized'
     *       500:
     *         $ref: '#/components/responses/InternalServerError'
     */
    router.put(
      '/',
      this.userAuthMiddleware.authenticate.bind(this.userAuthMiddleware),
      upload.fields([
        {
          name: 'photo',
          maxCount: 1,
        },
      ]),
      processImagesMiddleware(['photo']),
      this.userController.updateUserData.bind(this.userController),
    );

    /**
     * @openapi
     * /api/users:
     *   delete:
     *     tags: [Users]
     *     summary: DELETE /
     *     responses:
     *       200:
     *         description: Success
     */
    router.delete(
      '/',
      this.userAuthMiddleware.authenticate.bind(this.userAuthMiddleware),
      this.userController.deleteUser.bind(this.userController),
    );

    return router;
  }
}
