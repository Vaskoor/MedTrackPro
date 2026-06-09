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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma/prisma.service");
let AiService = class AiService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getInsights(patientId) {
        const vitals = await this.prisma.vitalSign.findMany({
            where: { patientId },
            orderBy: { recordedAt: 'desc' },
            take: 5,
        });
        const bp = vitals.find(v => v.type === 'BLOOD_PRESSURE')?.value;
        let message = 'Your health metrics are stable. Keep up the good work!';
        if (bp && bp !== '120/80 mmHg') {
            message = 'Your blood pressure is slightly elevated. Consider reducing salt intake.';
        }
        return { message, riskLevel: 'LOW' };
    }
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AiService);
//# sourceMappingURL=ai.service.js.map