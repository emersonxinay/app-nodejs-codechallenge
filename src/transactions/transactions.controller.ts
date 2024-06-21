import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionDto } from './dto/transaction.dto';
import { Transaction } from './transaction.entity';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  async create(
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    return this.transactionsService.create(createTransactionDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<TransactionDto> {
    const transaction = await this.transactionsService.findOne(id);
    return {
      transactionExternalId: transaction.transactionExternalId,
      transactionType: { name: 'Transfer' },
      transactionStatus: { name: transaction.transactionStatus },
      value: transaction.value,
      createdAt: transaction.createdAt,
    };
  }
}
