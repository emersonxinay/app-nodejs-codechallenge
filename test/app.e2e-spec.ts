import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should create a transaction and validate it', async () => {
    const createTransactionDto = {
      accountExternalIdDebit: 'a123',
      accountExternalIdCredit: 'b456',
      tranferTypeId: 1,
      value: 1500,
    };

    const response = await request(app.getHttpServer())
      .post('/transactions')
      .send(createTransactionDto)
      .expect(201);

    expect(response.body.transactionStatus).toBe('pending');
  });
});
