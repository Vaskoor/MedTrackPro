import { AiService } from './ai.service';
export declare class AiController {
    private readonly service;
    constructor(service: AiService);
    getInsights(req: any): Promise<{
        message: string;
        riskLevel: string;
    }>;
}
