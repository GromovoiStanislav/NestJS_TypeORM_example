import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Employee } from "./employee.entity";
import { ContactInfo } from "./contact-info.entity";
import { Task } from "./task.entity";
import { Meeting } from "./meeting.entity";
import { User } from "./user.entity";
import { Pet } from "./pet.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: "db.sqlite",
      //entities: ['dist/**/*.entity.js'],
      autoLoadEntities: true,
      synchronize: true,
      logging: false
    }),
    TypeOrmModule.forFeature([Employee, ContactInfo, Task, Meeting, User, Pet])
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
}
