import { Injectable, NotFoundException } from '@nestjs/common';
import { Employee } from './employee.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactInfo } from './contact-info.entity';
import { Task } from './task.entity';
import { Meeting } from './meeting.entity';
import { User } from './user.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    @InjectRepository(ContactInfo)
    private contactInfoRepository: Repository<ContactInfo>,
    @InjectRepository(Task) private taskRepository: Repository<Task>,
    @InjectRepository(Meeting) private meetingRepository: Repository<Meeting>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  /////////////////////// CRUD ////////////////////////////////////

  getAllUsers_v1(): Promise<User[]> {
    return this.userRepository.find({ relations: ['pets'] });
  }

  getAllUsers_v2(): Promise<any> {
    return this.userRepository
      .createQueryBuilder('User')
      .leftJoinAndSelect('user.pets', 'pets')
      .getMany();
  }

  getOneUserById_v1(id: number): Promise<User> {
    try {
      return this.userRepository.findOneOrFail({
        where: { id },
        relations: ['pets'],
      });
    } catch (err) {
      throw new NotFoundException();
    }
  }

  getOneUserById_v2(id: number): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  getOneUserById_v3(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id }, relations: ['pets'] });
  }

  getOneUserById_v4(id: number): Promise<any> {
    return this.userRepository
      .createQueryBuilder('User')
      .leftJoinAndSelect('user.pets', 'pets')
      .where('user.id = :userId', { userId: id })
      .getOne();
  }

  createUser_v1(name: string): Promise<User> {
    const newUser = this.userRepository.create({ name });
    return this.userRepository.save(newUser);
  }

  createUser_v2(name: string): Promise<any> {
    const newUser = this.userRepository.create({ name });
    return this.userRepository.insert(newUser); // -> {raw:[], affected:1}
    //return this.userRepository.insert({ name });
  }

  async updateUser_v1(id: number, name: string): Promise<User> {
    const user = await this.getOneUserById_v2(id);
    user.name = name;
    return this.userRepository.save(user);
  }

  updateUser_v2(id: number, name: string): Promise<any> {
    return this.userRepository.update(id, { name }); // -> {raw:[], affected:1}
  }

  async deleteUser_v1(id: number): Promise<User> {
    const user = await this.getOneUserById_v2(id);
    await this.userRepository.remove(user);
    return user;
  }

  deleteUser_v2(id: number): Promise<any> {
    return this.userRepository.delete(id); // -> {raw:[], affected:1}
  }

  /////////////////////// relations ////////////////////////////////////

  async seed() {
    const ceo = this.employeeRepository.create({
      name: 'Mr. CEO',
    });
    await this.employeeRepository.save(ceo);

    const ceoContactInfo = this.contactInfoRepository.create({
      email: 'email@email.com',
      //employeeId: ceo.id, // 1 способ
    });
    ceoContactInfo.employee = ceo; // 2 способ
    await this.contactInfoRepository.save(ceoContactInfo);

    const manager = this.employeeRepository.create({
      name: 'Marius',
      manager: ceo, // 3 способ
    });

    const task1 = this.taskRepository.create({ name: 'Here people' });
    await this.taskRepository.save(task1);

    const task2 = this.taskRepository.create({ name: 'Present to CEO' });
    await this.taskRepository.save(task2);

    manager.tasks = [task1, task2]; // !!! Добавит employeeId=manager.id в task1 и task2 после записи manager

    const meeting1 = this.meetingRepository.create({ zoomUrl: 'meeting.com' });
    meeting1.attendees = [ceo]; // создаст запись в employee_meetings_meeting где meetingId=meeting1.id и employeeId=ceo.id
    await this.meetingRepository.save(meeting1);

    manager.meetings = [meeting1]; // создаст запись в employee_meetings_meeting где meetingId=meeting1.id и employeeId=manager.id после записи manager

    await this.employeeRepository.save(manager);
  }

  getEmployeeById(id: number) {
    // return this.employeeRepository.findOne({
    //   where: { id },
    //   //relations: ['manager','directReports','contactInfo','tasks','meetings'],
    //   //relations: { manager: true, directReports: true, contactInfo: true, tasks: true, meetings: true }
    // });

    return this.employeeRepository
      .createQueryBuilder('employee')
      .where('employee.id = :employeeId', { employeeId: id })
      .leftJoinAndSelect('employee.contactInfo', 'contactInfo')
      .leftJoinAndSelect('employee.directReports', 'directReports')
      .leftJoinAndSelect('employee.tasks', 'tasks')
      .leftJoinAndSelect('employee.meetings', 'meetings')
      .leftJoinAndSelect('employee.manager', 'manager')
      .leftJoinAndSelect('manager.contactInfo', 'contactInfoManager')
      .leftJoinAndSelect('manager.tasks', 'tasksManager')
      .leftJoinAndSelect('manager.directReports', 'directReportsManager')
      .getOne();
  }

  deleteEmployeeById(id: number) {
    return this.employeeRepository.delete(id); // -> {raw:[], affected:1}
  }
}
