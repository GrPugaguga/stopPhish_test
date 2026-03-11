import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1773160398456 implements MigrationInterface {
  name = 'Migration1773160398456';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "notes" DROP CONSTRAINT "FK_337c70c841b6064e5797e974c32"`);
    await queryRunner.query(
      `ALTER TABLE "notes" ADD CONSTRAINT "FK_337c70c841b6064e5797e974c32" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "notes" DROP CONSTRAINT "FK_337c70c841b6064e5797e974c32"`);
    await queryRunner.query(
      `ALTER TABLE "notes" ADD CONSTRAINT "FK_337c70c841b6064e5797e974c32" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }
}
