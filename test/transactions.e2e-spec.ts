import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TransactionsService } from '../src/transactions/transactions.service';
import { TransactionStatus } from '../src/transactions/transaction.entity';

describe('TransactionsController (e2e)', () => {
  let app: INestApplication;
  let transactionsService: Partial<TransactionsService>;

  beforeAll(async () => {
    transactionsService = {
      findOne: jest.fn().mockResolvedValue({
        transactionExternalId: '1',
        transactionType: { name: 'Transfer' },
        transactionStatus: { name: TransactionStatus.APPROVED },
        value: 1500,
        createdAt: new Date(),
      }),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(TransactionsService)
      .useValue(transactionsService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/transactions/:id (GET)', async () => {
    const transaction = {
      transactionExternalId: '1',
      transactionType: { name: 'Transfer' },
      transactionStatus: { name: TransactionStatus.APPROVED },
      value: 1500,
      createdAt: new Date(),
    };

    const response = await request(app.getHttpServer())
      .get('/transactions/1')
      .expect(200);

    expect(response.body).toEqual(transaction);
  });
});
