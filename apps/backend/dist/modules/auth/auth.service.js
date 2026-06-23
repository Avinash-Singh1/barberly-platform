"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const tslib_1 = require("tslib");
const bcryptjs_1 = tslib_1.__importDefault(require("bcryptjs"));
const jsonwebtoken_1 = tslib_1.__importDefault(require("jsonwebtoken"));
const database_1 = require("../../config/database");
const env_1 = require("../../config/env");
const error_middleware_1 = require("../../middleware/error.middleware");
const client_1 = require("@prisma/client");
class AuthService {
    async register(data) {
        const { email, password, firstName, lastName, phone, role = client_1.UserRole.CUSTOMER } = data;
        // Check if user exists
        const existingUser = await database_1.prisma.user.findFirst({
            where: {
                OR: [{ email }, ...(phone ? [{ phone }] : [])],
            },
        });
        if (existingUser) {
            throw new error_middleware_1.AppError(409, 'User with this email or phone already exists');
        }
        // Hash password
        const passwordHash = await bcryptjs_1.default.hash(password, 12);
        // Create user with profile based on role
        const user = await database_1.prisma.user.create({
            data: {
                email,
                passwordHash,
                firstName,
                lastName,
                phone,
                role,
                ...(role === client_1.UserRole.CUSTOMER && {
                    customerProfile: {
                        create: {},
                    },
                }),
                ...(role === client_1.UserRole.BARBER && {
                    barberProfile: {
                        create: {
                            status: 'PENDING', // Requires admin approval
                        },
                    },
                }),
            },
            include: {
                customerProfile: role === client_1.UserRole.CUSTOMER,
                barberProfile: role === client_1.UserRole.BARBER,
            },
        });
        // Generate tokens
        const tokens = await this.generateTokens(user.id, user.email, user.role);
        return {
            user: this.sanitizeUser(user),
            ...tokens,
        };
    }
    async login(data) {
        const { email, password } = data;
        // Find user
        const user = await database_1.prisma.user.findUnique({
            where: { email },
            include: {
                customerProfile: true,
                barberProfile: true,
            },
        });
        if (!user) {
            throw new error_middleware_1.AppError(401, 'Invalid credentials');
        }
        // Check if user is active
        if (!user.isActive) {
            throw new error_middleware_1.AppError(403, 'Account is deactivated');
        }
        // Verify password
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            throw new error_middleware_1.AppError(401, 'Invalid credentials');
        }
        // Check barber approval status
        if (user.role === client_1.UserRole.BARBER && user.barberProfile?.status === 'PENDING') {
            throw new error_middleware_1.AppError(403, 'Your barber account is pending approval');
        }
        if (user.role === client_1.UserRole.BARBER && user.barberProfile?.status === 'SUSPENDED') {
            throw new error_middleware_1.AppError(403, 'Your account has been suspended');
        }
        // Generate tokens
        const tokens = await this.generateTokens(user.id, user.email, user.role);
        return {
            user: this.sanitizeUser(user),
            ...tokens,
        };
    }
    async refreshToken(refreshToken) {
        try {
            // Verify refresh token
            const decoded = jsonwebtoken_1.default.verify(refreshToken, env_1.env.JWT_REFRESH_SECRET);
            // Check if token exists in database
            const storedToken = await database_1.prisma.refreshToken.findUnique({
                where: { token: refreshToken },
            });
            if (!storedToken) {
                throw new error_middleware_1.AppError(401, 'Invalid refresh token');
            }
            // Check if expired
            if (storedToken.expiresAt < new Date()) {
                await database_1.prisma.refreshToken.delete({ where: { token: refreshToken } });
                throw new error_middleware_1.AppError(401, 'Refresh token expired');
            }
            // Generate new tokens
            const tokens = await this.generateTokens(decoded.id, decoded.email, decoded.role);
            // Delete old refresh token
            await database_1.prisma.refreshToken.delete({ where: { token: refreshToken } });
            return tokens;
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                throw new error_middleware_1.AppError(401, 'Invalid refresh token');
            }
            throw error;
        }
    }
    async logout(refreshToken) {
        await database_1.prisma.refreshToken.deleteMany({
            where: { token: refreshToken },
        });
    }
    async getProfile(userId) {
        const user = await database_1.prisma.user.findUnique({
            where: { id: userId },
            include: {
                customerProfile: true,
                barberProfile: {
                    include: {
                        shops: {
                            include: {
                                shop: true,
                            },
                        },
                        gallery: true,
                        availability: true,
                    },
                },
            },
        });
        if (!user) {
            throw new error_middleware_1.AppError(404, 'User not found');
        }
        return this.sanitizeUser(user);
    }
    async generateTokens(id, email, role) {
        // Access token (short-lived)
        const accessToken = jsonwebtoken_1.default.sign({ id, email, role }, env_1.env.JWT_SECRET, {
            expiresIn: env_1.env.JWT_EXPIRES_IN,
        });
        // Refresh token (long-lived)
        const refreshToken = jsonwebtoken_1.default.sign({ id, email, role }, env_1.env.JWT_REFRESH_SECRET, {
            expiresIn: env_1.env.JWT_REFRESH_EXPIRES_IN,
        });
        // Store refresh token in database
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days
        await database_1.prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: id,
                expiresAt,
            },
        });
        return {
            accessToken,
            refreshToken,
            expiresIn: env_1.env.JWT_EXPIRES_IN,
        };
    }
    sanitizeUser(user) {
        const { passwordHash, ...sanitized } = user;
        return sanitized;
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map