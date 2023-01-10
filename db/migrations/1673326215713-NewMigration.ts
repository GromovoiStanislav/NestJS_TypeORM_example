import { MigrationInterface, QueryRunner } from "typeorm";

export class NewMigration1673326215713 implements MigrationInterface {
    name = 'NewMigration1673326215713'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "contact_info" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "phone" varchar, "email" varchar NOT NULL, "employeeId" integer NOT NULL, CONSTRAINT "REL_f188a018423a2cc75535509ff9" UNIQUE ("employeeId"))`);
        await queryRunner.query(`CREATE TABLE "task" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "employeeId" integer)`);
        await queryRunner.query(`CREATE TABLE "meeting" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "zoomUrl" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "employee" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "managerId" integer)`);
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "pet" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "ownerId" integer)`);
        await queryRunner.query(`CREATE TABLE "employee_meetings_meeting" ("employeeId" integer NOT NULL, "meetingId" integer NOT NULL, PRIMARY KEY ("employeeId", "meetingId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_0f0c3a58474a40670f633832aa" ON "employee_meetings_meeting" ("employeeId") `);
        await queryRunner.query(`CREATE INDEX "IDX_10f26ded70438524748ef34cd1" ON "employee_meetings_meeting" ("meetingId") `);
        await queryRunner.query(`CREATE TABLE "temporary_contact_info" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "phone" varchar, "email" varchar NOT NULL, "employeeId" integer NOT NULL, CONSTRAINT "REL_f188a018423a2cc75535509ff9" UNIQUE ("employeeId"), CONSTRAINT "FK_f188a018423a2cc75535509ff97" FOREIGN KEY ("employeeId") REFERENCES "employee" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_contact_info"("id", "phone", "email", "employeeId") SELECT "id", "phone", "email", "employeeId" FROM "contact_info"`);
        await queryRunner.query(`DROP TABLE "contact_info"`);
        await queryRunner.query(`ALTER TABLE "temporary_contact_info" RENAME TO "contact_info"`);
        await queryRunner.query(`CREATE TABLE "temporary_task" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "employeeId" integer, CONSTRAINT "FK_07278e1532a8daa462123fb7bc1" FOREIGN KEY ("employeeId") REFERENCES "employee" ("id") ON DELETE SET NULL ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_task"("id", "name", "employeeId") SELECT "id", "name", "employeeId" FROM "task"`);
        await queryRunner.query(`DROP TABLE "task"`);
        await queryRunner.query(`ALTER TABLE "temporary_task" RENAME TO "task"`);
        await queryRunner.query(`CREATE TABLE "temporary_employee" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "managerId" integer, CONSTRAINT "FK_f4a920dfa304e096fad40e8c4a0" FOREIGN KEY ("managerId") REFERENCES "employee" ("id") ON DELETE SET NULL ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_employee"("id", "name", "managerId") SELECT "id", "name", "managerId" FROM "employee"`);
        await queryRunner.query(`DROP TABLE "employee"`);
        await queryRunner.query(`ALTER TABLE "temporary_employee" RENAME TO "employee"`);
        await queryRunner.query(`CREATE TABLE "temporary_pet" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "ownerId" integer, CONSTRAINT "FK_20acc45f799c122ec3735a3b8b1" FOREIGN KEY ("ownerId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_pet"("id", "name", "ownerId") SELECT "id", "name", "ownerId" FROM "pet"`);
        await queryRunner.query(`DROP TABLE "pet"`);
        await queryRunner.query(`ALTER TABLE "temporary_pet" RENAME TO "pet"`);
        await queryRunner.query(`DROP INDEX "IDX_0f0c3a58474a40670f633832aa"`);
        await queryRunner.query(`DROP INDEX "IDX_10f26ded70438524748ef34cd1"`);
        await queryRunner.query(`CREATE TABLE "temporary_employee_meetings_meeting" ("employeeId" integer NOT NULL, "meetingId" integer NOT NULL, CONSTRAINT "FK_0f0c3a58474a40670f633832aa8" FOREIGN KEY ("employeeId") REFERENCES "employee" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_10f26ded70438524748ef34cd10" FOREIGN KEY ("meetingId") REFERENCES "meeting" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, PRIMARY KEY ("employeeId", "meetingId"))`);
        await queryRunner.query(`INSERT INTO "temporary_employee_meetings_meeting"("employeeId", "meetingId") SELECT "employeeId", "meetingId" FROM "employee_meetings_meeting"`);
        await queryRunner.query(`DROP TABLE "employee_meetings_meeting"`);
        await queryRunner.query(`ALTER TABLE "temporary_employee_meetings_meeting" RENAME TO "employee_meetings_meeting"`);
        await queryRunner.query(`CREATE INDEX "IDX_0f0c3a58474a40670f633832aa" ON "employee_meetings_meeting" ("employeeId") `);
        await queryRunner.query(`CREATE INDEX "IDX_10f26ded70438524748ef34cd1" ON "employee_meetings_meeting" ("meetingId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_10f26ded70438524748ef34cd1"`);
        await queryRunner.query(`DROP INDEX "IDX_0f0c3a58474a40670f633832aa"`);
        await queryRunner.query(`ALTER TABLE "employee_meetings_meeting" RENAME TO "temporary_employee_meetings_meeting"`);
        await queryRunner.query(`CREATE TABLE "employee_meetings_meeting" ("employeeId" integer NOT NULL, "meetingId" integer NOT NULL, PRIMARY KEY ("employeeId", "meetingId"))`);
        await queryRunner.query(`INSERT INTO "employee_meetings_meeting"("employeeId", "meetingId") SELECT "employeeId", "meetingId" FROM "temporary_employee_meetings_meeting"`);
        await queryRunner.query(`DROP TABLE "temporary_employee_meetings_meeting"`);
        await queryRunner.query(`CREATE INDEX "IDX_10f26ded70438524748ef34cd1" ON "employee_meetings_meeting" ("meetingId") `);
        await queryRunner.query(`CREATE INDEX "IDX_0f0c3a58474a40670f633832aa" ON "employee_meetings_meeting" ("employeeId") `);
        await queryRunner.query(`ALTER TABLE "pet" RENAME TO "temporary_pet"`);
        await queryRunner.query(`CREATE TABLE "pet" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "ownerId" integer)`);
        await queryRunner.query(`INSERT INTO "pet"("id", "name", "ownerId") SELECT "id", "name", "ownerId" FROM "temporary_pet"`);
        await queryRunner.query(`DROP TABLE "temporary_pet"`);
        await queryRunner.query(`ALTER TABLE "employee" RENAME TO "temporary_employee"`);
        await queryRunner.query(`CREATE TABLE "employee" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "managerId" integer)`);
        await queryRunner.query(`INSERT INTO "employee"("id", "name", "managerId") SELECT "id", "name", "managerId" FROM "temporary_employee"`);
        await queryRunner.query(`DROP TABLE "temporary_employee"`);
        await queryRunner.query(`ALTER TABLE "task" RENAME TO "temporary_task"`);
        await queryRunner.query(`CREATE TABLE "task" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "employeeId" integer)`);
        await queryRunner.query(`INSERT INTO "task"("id", "name", "employeeId") SELECT "id", "name", "employeeId" FROM "temporary_task"`);
        await queryRunner.query(`DROP TABLE "temporary_task"`);
        await queryRunner.query(`ALTER TABLE "contact_info" RENAME TO "temporary_contact_info"`);
        await queryRunner.query(`CREATE TABLE "contact_info" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "phone" varchar, "email" varchar NOT NULL, "employeeId" integer NOT NULL, CONSTRAINT "REL_f188a018423a2cc75535509ff9" UNIQUE ("employeeId"))`);
        await queryRunner.query(`INSERT INTO "contact_info"("id", "phone", "email", "employeeId") SELECT "id", "phone", "email", "employeeId" FROM "temporary_contact_info"`);
        await queryRunner.query(`DROP TABLE "temporary_contact_info"`);
        await queryRunner.query(`DROP INDEX "IDX_10f26ded70438524748ef34cd1"`);
        await queryRunner.query(`DROP INDEX "IDX_0f0c3a58474a40670f633832aa"`);
        await queryRunner.query(`DROP TABLE "employee_meetings_meeting"`);
        await queryRunner.query(`DROP TABLE "pet"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "employee"`);
        await queryRunner.query(`DROP TABLE "meeting"`);
        await queryRunner.query(`DROP TABLE "task"`);
        await queryRunner.query(`DROP TABLE "contact_info"`);
    }

}
