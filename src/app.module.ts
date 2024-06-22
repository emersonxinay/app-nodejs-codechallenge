import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsModule } from './transactions/transactions.module';
import { Transaction } from './transactions/transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost', // o el nombre de tu servicio Docker si estás usando docker-compose
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'yapeame',
      entities: [Transaction],
      synchronize: true, // Esto crea las tablas automáticamente en la base de datos
    }),
    TransactionsModule,
  ],
})
export class AppModule {}
