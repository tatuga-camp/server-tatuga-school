import { Module } from '@nestjs/common';
import { ClassService } from './class.service';
import { ClassController } from './class.controller';
import { ClassRepository } from './class.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { MemberOnSchoolService } from 'src/member-on-school/member-on-school.service';

@Module({
  imports: [PrismaModule],
  providers: [ClassService, ClassRepository, MemberOnSchoolService],
  controllers: [ClassController],
})
export class ClassModule {}
