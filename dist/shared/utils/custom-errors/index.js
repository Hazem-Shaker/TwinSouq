"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnverifiedAccount = exports.InvalidFileTypeError = exports.ValidationError = exports.NoRouteFound = exports.InvalidCredentialsError = exports.GatewayTimeoutError = exports.ServiceUnavailableError = exports.TooManyRequestsError = exports.UnprocessableEntityError = exports.ConflictError = exports.IncompleteUserData = exports.ForbiddenError = exports.InternalServerError = exports.NotFoundError = exports.UnauthorizedError = exports.BadRequestError = void 0;
const BaseError_1 = require("./BaseError");
class BadRequestError extends BaseError_1.BaseError {
    constructor(message = "Bad Request") {
        super(message, 400);
    }
}
exports.BadRequestError = BadRequestError;
class UnauthorizedError extends BaseError_1.BaseError {
    constructor(message = "Unauthorized") {
        super(message, 401);
    }
}
exports.UnauthorizedError = UnauthorizedError;
class NotFoundError extends BaseError_1.BaseError {
    constructor(message = "Not Found") {
        super(message, 404);
    }
}
exports.NotFoundError = NotFoundError;
class InternalServerError extends BaseError_1.BaseError {
    constructor(message = "Internal Server Error") {
        super(message, 500);
    }
}
exports.InternalServerError = InternalServerError;
class ForbiddenError extends BaseError_1.BaseError {
    constructor(message = "Forbidden") {
        super(message, 403);
    }
}
exports.ForbiddenError = ForbiddenError;
class IncompleteUserData extends BaseError_1.BaseError {
    constructor(message = "restireted") {
        super(message, 405);
    }
}
exports.IncompleteUserData = IncompleteUserData;
class ConflictError extends BaseError_1.BaseError {
    constructor(message = "Conflict") {
        super(message, 409);
    }
}
exports.ConflictError = ConflictError;
class UnprocessableEntityError extends BaseError_1.BaseError {
    constructor(message = "Unprocessable Entity") {
        super(message, 422);
    }
}
exports.UnprocessableEntityError = UnprocessableEntityError;
class TooManyRequestsError extends BaseError_1.BaseError {
    constructor(message = "Too Many Requests") {
        super(message, 429);
    }
}
exports.TooManyRequestsError = TooManyRequestsError;
class ServiceUnavailableError extends BaseError_1.BaseError {
    constructor(message = "Service Unavailable") {
        super(message, 503);
    }
}
exports.ServiceUnavailableError = ServiceUnavailableError;
class GatewayTimeoutError extends BaseError_1.BaseError {
    constructor(message = "Gateway Timeout") {
        super(message, 504);
    }
}
exports.GatewayTimeoutError = GatewayTimeoutError;
class InvalidCredentialsError extends BaseError_1.BaseError {
    constructor(message = "Invalid Credentials") {
        super(message, 401);
    }
}
exports.InvalidCredentialsError = InvalidCredentialsError;
class NoRouteFound extends BaseError_1.BaseError {
    constructor(message = "Route not found") {
        super(message, 404);
    }
}
exports.NoRouteFound = NoRouteFound;
class ValidationError extends BaseError_1.BaseError {
    constructor(message) {
        super(message, 422);
    }
}
exports.ValidationError = ValidationError;
class InvalidFileTypeError extends BaseError_1.BaseError {
    constructor(message = "Invalid File Type") {
        super(message, 400);
    }
}
exports.InvalidFileTypeError = InvalidFileTypeError;
class UnverifiedAccount extends BaseError_1.BaseError {
    constructor(message = "Unverified account, the OTP has been sent to your email") {
        super(message, 403);
    }
}
exports.UnverifiedAccount = UnverifiedAccount;
__exportStar(require("./BaseError"), exports);
