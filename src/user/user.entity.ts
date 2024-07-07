import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

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
