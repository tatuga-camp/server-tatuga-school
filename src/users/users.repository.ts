import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Provider, User, UserRole } from '@prisma/client';

interface CreateUserModel {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role?: string;
  provider?: Provider;
}

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}
  async findByEmail(email: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
  async updateResetToken(
    email: string,
    token: string,
    expiration: Date,
  ): Promise<void> {
    await this.prisma.user.update({
      where: { email },
      data: {
        resetPasswordToken: token,
        resetPasswordTokenExpiresAt: expiration,
      },
    });
  }

  async createUser(
    data: CreateUserModel,
    token: string,
    expiration: Date,
    password: string,
  ): Promise<User> {
    const value = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      password: password,
      role: UserRole.USER,
      photo: '',
      lastActiveAt: new Date(),
      provider: data.provider,
      verifyEmailToken: token,
      verifyEmailTokenExpiresAt: expiration,
    };
    return this.prisma.user.create({
      data: value,
    });
  }

  async findByVerifyToken(token: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: {
        verifyEmailToken: token,
      },
    });
  }

  async updateVerified(email: string): Promise<void> {
    await this.prisma.user.update({
      where: { email },
      data: {
        isVerifyEmail: true,
      },
    });
  }

  async findByResetToken(token: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: {
        resetPasswordToken: token,
      },
    });
  }
  async updatePassword(email: string, password: string): Promise<void> {
    await this.prisma.user.update({
      where: { email },
      data: {
        password: password,
      },
    });
  }
  async updateLastActiveAt(email: string): Promise<void> {
    await this.prisma.user.update({
      where: { email },
      data: {
        lastActiveAt: new Date(),
      },
    });
  }
}