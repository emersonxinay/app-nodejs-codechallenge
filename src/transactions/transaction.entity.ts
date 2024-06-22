import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

export enum TransactionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  transactionExternalId: string;

  @Column()
  value: number;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  transactionStatus: TransactionStatus;

  @CreateDateColumn()
  createdAt: Date;
}
