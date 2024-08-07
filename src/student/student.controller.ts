import {
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Body,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { GetUser } from 'src/auth/decorators';
import { User } from '@prisma/client';
import {
  CreateStudentDto,
  CreateManyStudentsDto,
} from './dto/create-student.dto';
import { GetAllStudentsDto, GetStudentDto } from './dto/get-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { DeleteStudentDto } from './dto/delete-student.dto';
import { UserGuard } from '../auth/guard';

@UseGuards(UserGuard)
@Controller('v1/students')
export class StudentController {
  constructor(private studentService: StudentService) {}

  @Get('schoolId/:schoolId/class/:classId')
  async getAllStudentsInClass(
    @GetUser() user: User,
    @Param() dto: GetAllStudentsDto,
  ) {
    return this.studentService.getAllStudents(dto, user);
  }

  @Get(':studentId')
  async getStudentById(@GetUser() user: User, @Param() dto: GetStudentDto) {
    return this.studentService.getStudentById(dto, user.id);
  }

  @Post()
  async createStudent(
    @GetUser() user: User,
    @Body() createStudentDto: CreateStudentDto,
  ) {
    return this.studentService.createStudent(createStudentDto, user);
  }

  @Post('create-many')
  async createManyStudents(
    @GetUser() user: User,
    @Body() createManyStudentsDto: CreateManyStudentsDto,
  ) {
    return this.studentService.createManyStudents(createManyStudentsDto, user);
  }

  @Patch(':studentId')
  async updateStudent(
    @GetUser() user: User,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    return this.studentService.updateStudent(updateStudentDto, user);
  }

  @Delete(':studentId')
  async deleteStudent(@Param() dto: DeleteStudentDto, @GetUser() user: User) {
    return this.studentService.deleteStudent(dto, user);
  }
}
