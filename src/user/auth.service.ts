import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { scrypt as _scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async signup(email: string, password: string) {
    const users = await this.userService.find(email);
    if (users.length) {
      throw new BadRequestException('Email already exists');
    }

    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const hashedPassword = salt + '.' + hash.toString('hex');

    const user = await this.userService.create(email, hashedPassword);
    return user;
  }

  async signin(email: string, password: string) {
    if (!email || typeof email !== 'string') {
      throw new BadRequestException('Invalid email format');
    }
    const [user] = await this.userService.find(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const [salt, hashedPassword] = user.password.split('.');
    const computedHash = (await scrypt(password, salt, 32)) as Buffer;
    if (hashedPassword !== computedHash.toString('hex')) {
      throw new BadRequestException('Invalid password');
    }
    return user;
  }
}
