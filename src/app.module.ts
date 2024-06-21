import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsModule } from './transactions/transactions.module';
import { Transaction } from './transactions/transaction.entity';
import { AntiFraudService } from './anti-fraud.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'emerson',
      password: 'emerson123',
      database: 'yapeame',
      entities: [Transaction],
      synchronize: true,
    }),
    TransactionsModule,
  ],
  providers: [AntiFraudService],
})
export class AppModule {}
