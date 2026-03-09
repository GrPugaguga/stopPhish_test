import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1773072245291 implements MigrationInterface {
    name = 'Init1773072245291'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_13e8b2a21988bec6fdcbb1fa74" ON "categories" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_829532ff766505ad7c71592c6a" ON "notes" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_337c70c841b6064e5797e974c3" ON "notes" ("categoryId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_337c70c841b6064e5797e974c3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_829532ff766505ad7c71592c6a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_13e8b2a21988bec6fdcbb1fa74"`);
    }

}
