import { Injectable, Logger } from '@nestjs/common';
import {
  RequestGetAttendanceById,
  RequestUpdateAttendanceById,
} from './interfaces';
import { Attendance } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export type AttendanceRepositoryType = {
  getAttendanceById(request: RequestGetAttendanceById): Promise<Attendance>;
  updateAttendanceById(
    request: RequestUpdateAttendanceById,
  ): Promise<Attendance>;
};
@Injectable()
export class AttendanceRepository implements AttendanceRepositoryType {
  logger: Logger;
  constructor(private prisma: PrismaService) {
    this.logger = new Logger(AttendanceRepository.name);
  }

  async getAttendanceById(
    request: RequestGetAttendanceById,
  ): Promise<Attendance> {
    try {
      return this.prisma.attendance.findUnique({
        where: {
          id: request.attendanceId,
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async updateAttendanceById(
    request: RequestUpdateAttendanceById,
  ): Promise<Attendance> {
    try {
      return this.prisma.attendance.update({
        where: {
          id: request.query.attendanceId,
        },
        data: {
          ...request.body,
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}