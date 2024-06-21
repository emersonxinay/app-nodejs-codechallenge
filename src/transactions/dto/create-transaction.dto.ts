import { IsUUID, IsNumber, IsPositive } from 'class-validator';

export class CreateTransactionDto {
  @IsUUID()
  accountExternalIdDebit: string;

  @IsUUID()
  accountExternalIdCredit: string;

  @IsNumber()
  tranferTypeId: number;

  @IsPositive()
  value: number;
}
