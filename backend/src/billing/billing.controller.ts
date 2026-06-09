import { Controller, Get, Post, Param, Request, UseGuards } from '@nestjs/common';
import { BillingService } from './billing.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('billing')
@UseGuards(JwtAuthGuard)
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get()
  findAll(@Request() req: any) { return this.billingService.findAll(req.user.id); }

  @Post(':id/pay')
  pay(@Param('id') id: string) { return this.billingService.pay(id, 'stripe'); }
}
