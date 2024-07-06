import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Team } from '@prisma/client';
import {
  RequestCreateTeam,
  RequestUpdateTeam,
  RequestDeleteTeam,
  RequestGetTeam,
  RequestGetTeamsBySchoolId,
  TeamRepositoryType,
} from './team.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { Pagination } from 'src/interfaces';

@Injectable()
export class TeamRepository implements TeamRepositoryType {
  logger: Logger = new Logger('TeamRepository');
  constructor(private prisma: PrismaService) {}

  async create(request: RequestCreateTeam): Promise<Team> {
    try {
      return await this.prisma.team.create({
        data: request.data,
      });
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(request: RequestUpdateTeam): Promise<Team> {
    try {
      return await this.prisma.team.update({
        where: { id: request.teamId },
        data: request.data,
      });
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async delete(request: RequestDeleteTeam): Promise<Team> {
    try {
      return await this.prisma.team.delete({
        where: { id: request.teamId },
      });
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async findById(request: RequestGetTeam): Promise<Team | null> {
    try {
      return await this.prisma.team.findUnique({
        where: { id: request.teamId },
      });
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async findBySchoolId(
    request: RequestGetTeamsBySchoolId,
  ): Promise<Pagination<Team>> {
    try {
      const { schoolId, page, limit } = request;
      const count = await this.prisma.team.count({
        where: { schoolId },
      });
      const data = await this.prisma.team.findMany({
        where: { schoolId },
        skip: (page - 1) * limit,
        take: limit,
      });
      const total = Math.ceil(count / limit);
      if (page > total) {
        return {
          data: [],
          meta: {
            total: 1,
            lastPage: 1,
            currentPage: 1,
            prev: 1,
            next: 1,
          },
        };
      }

      return {
        data,
        meta: {
          total: total,
          lastPage: total,
          currentPage: page,
          prev: page - 1 < 0 ? page : page - 1,
          next: page + 1 > total ? page : page + 1,
        },
      };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error.message);
    }
  }
}
