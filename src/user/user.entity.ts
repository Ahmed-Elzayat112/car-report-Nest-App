import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';

import { Report } from 'src/reports/reports.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  @AfterInsert()
  logInsert() {
    console.log(`User with email ${this.email} has been created.`);
  }

  @AfterRemove()
  logRemove() {
    console.log(`User with email ${this.email} has been removed.`);
  }

  @AfterUpdate()
  logUpdate() {
    console.log(`User with email ${this.email} has been updated.`);
  }
}
