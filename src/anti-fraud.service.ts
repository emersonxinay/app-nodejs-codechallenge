import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka, EachMessagePayload } from 'kafkajs';
import { TransactionsService } from './transactions/transactions.service';
import { TransactionStatus } from './transactions/transaction.entity';

@Injectable()
export class AntiFraudService implements OnModuleInit {
  private kafka = new Kafka({
    clientId: 'anti-fraud-service',
    brokers: ['kafka:9092'],
  });

  private consumer = this.kafka.consumer({ groupId: 'anti-fraud-group' });

  constructor(private readonly transactionsService: TransactionsService) {}

  async onModuleInit() {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: 'transaction-validate' });

    await this.consumer.run({
      eachMessage: async ({ message }: EachMessagePayload) => {
        const transaction = JSON.parse(message.value.toString());
        const status =
          transaction.value > 1000
            ? TransactionStatus.REJECTED
            : TransactionStatus.APPROVED;
        await this.transactionsService.updateStatus(
          transaction.transactionExternalId,
          status,
        );

        const producer = this.kafka.producer();
        await producer.connect();
        await producer.send({
          topic: 'transaction-update',
          messages: [
            {
              value: JSON.stringify({
                transactionExternalId: transaction.transactionExternalId,
                status,
              }),
            },
          ],
        });
      },
    });
  }
}
