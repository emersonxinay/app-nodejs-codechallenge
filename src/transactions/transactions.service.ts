import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction, TransactionStatus } from './transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Kafka } from 'kafkajs';

@Injectable()
export class TransactionsService {
  private kafka = new Kafka({
    clientId: 'transaction-service',
    brokers: ['kafka:9092'],
  });

  private producer = this.kafka.producer();

  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
  ) {}

  async create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    const transaction =
      this.transactionsRepository.create(createTransactionDto);
    transaction.transactionStatus = TransactionStatus.PENDING;

    await this.transactionsRepository.save(transaction);

    await this.producer.connect();
    await this.producer.send({
      topic: 'transaction-validate',
      messages: [{ value: JSON.stringify(transaction) }],
    });

    return transaction;
  }

  async updateStatus(id: string, status: TransactionStatus): Promise<void> {
    await this.transactionsRepository.update(id, { transactionStatus: status });
  }

  async findOne(id: string): Promise<Transaction> {
    return this.transactionsRepository.findOne({
      where: { transactionExternalId: id },
    });
  }
}
