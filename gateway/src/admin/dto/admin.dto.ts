import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsObject, IsArray , IsDateString } from 'class-validator';

export class PostApprovalDto {
  @ApiProperty({ description: 'New order status', example: 'cancelled' })
  @IsString()
  orderStatus: string;
}

export class VerifyWalkerDto {
  @ApiProperty({ description: 'WalkerID for the walker', example: 1 })
  @IsNumber()
  walkerId: Number;
}