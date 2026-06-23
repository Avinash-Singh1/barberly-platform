"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = exports.logout = exports.refresh = exports.login = exports.register = void 0;
const error_middleware_1 = require("../../middleware/error.middleware");
const auth_service_1 = require("./auth.service");
const auth_validation_1 = require("./auth.validation");
const authService = new auth_service_1.AuthService();
exports.register = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const data = auth_validation_1.registerSchema.parse(req.body);
    const result = await authService.register(data);
    res.status(201).json({
        success: true,
        message: 'Registration successful',
        data: result,
    });
});
exports.login = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const data = auth_validation_1.loginSchema.parse(req.body);
    const result = await authService.login(data);
    res.json({
        success: true,
        message: 'Login successful',
        data: result,
    });
});
exports.refresh = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const { refreshToken } = auth_validation_1.refreshTokenSchema.parse(req.body);
    const tokens = await authService.refreshToken(refreshToken);
    res.json({
        success: true,
        message: 'Token refreshed',
        data: tokens,
    });
});
exports.logout = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const { refreshToken } = auth_validation_1.refreshTokenSchema.parse(req.body);
    await authService.logout(refreshToken);
    res.json({
        success: true,
        message: 'Logout successful',
    });
});
exports.getProfile = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const user = await authService.getProfile(req.user.id);
    res.json({
        success: true,
        data: user,
    });
});
//# sourceMappingURL=auth.controller.js.map