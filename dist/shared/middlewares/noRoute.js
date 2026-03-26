"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noRoute = void 0;
const custom_errors_1 = require("../utils/custom-errors");
const noRoute = (req, res, next) => {
    console.log(req.language);
    const message = req.t("errors.noRoute");
    console.log(message);
    next(new custom_errors_1.NoRouteFound(req.t("errors.noRoute")));
};
exports.noRoute = noRoute;
