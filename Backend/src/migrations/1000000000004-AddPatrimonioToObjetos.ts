import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPatrimonioToObjetos1000000000004
  implements MigrationInterface
{
  name = 'AddPatrimonioToObjetos1000000000004';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "objetos"
      ADD COLUMN IF NOT EXISTS "pertencePatrimonio" boolean NOT NULL DEFAULT false
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "objetos"
      DROP COLUMN IF EXISTS "pertencePatrimonio"
    `);
  }
}
