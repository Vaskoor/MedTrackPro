"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LabOrdersController = void 0;
const common_1 = require("@nestjs/common");
const lab_orders_service_1 = require("./lab-orders.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let LabOrdersController = class LabOrdersController {
    constructor(service) {
        this.service = service;
    }
    async findAll(req) {
        const patient = await this.service['prisma'].patient.findUnique({ where: { userId: req.user.id } });
        if (!patient)
            throw new Error('Patient not found');
        return this.service.findAll(patient.id);
    }
    async create(req, testName) {
        const patient = await this.service['prisma'].patient.findUnique({ where: { userId: req.user.id } });
        const doctor = await this.service['prisma'].doctor.findFirst();
        if (!patient || !doctor)
            throw new Error('Patient or doctor not found');
        return this.service.create(patient.id, doctor.id, testName);
    }
};
exports.LabOrdersController = LabOrdersController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LabOrdersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)('testName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], LabOrdersController.prototype, "create", null);
exports.LabOrdersController = LabOrdersController = __decorate([
    (0, common_1.Controller)('lab-orders'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [lab_orders_service_1.LabOrdersService])
], LabOrdersController);
//# sourceMappingURL=lab-orders.controller.js.map