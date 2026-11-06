import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserAndDatabaseConstraints1000000000003
  implements MigrationInterface
{
  name = 'UserAndDatabaseConstraints1000000000003';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "usuarios_role_enum" AS ENUM ('admin', 'usuario', 'coletor')`,
    );
    await queryRunner.query(
      `CREATE TYPE "descartes_status_enum" AS ENUM ('pendente', 'processado', 'finalizado')`,
    );
    await queryRunner.query(`
      ALTER TABLE "usuarios"
        ALTER COLUMN "role" TYPE "usuarios_role_enum"
        USING "role"::text::"usuarios_role_enum"
    `);
    await queryRunner.query(`
      ALTER TABLE "descartes"
        ALTER COLUMN "status" TYPE "descartes_status_enum"
        USING "status"::text::"descartes_status_enum"
    `);

    await queryRunner.query(`
      ALTER TABLE "usuarios"
        ALTER COLUMN "dataCriacao" SET DEFAULT CURRENT_TIMESTAMP,
        ALTER COLUMN "dataCriacao" SET NOT NULL
    `);
    await queryRunner.query(`
      ALTER TABLE "objetos"
        ALTER COLUMN "dataCriacao" SET DEFAULT CURRENT_TIMESTAMP,
        ALTER COLUMN "dataCriacao" SET NOT NULL
    `);
    await queryRunner.query(`
      ALTER TABLE "coletores"
        ALTER COLUMN "dataCriacao" SET DEFAULT CURRENT_TIMESTAMP,
        ALTER COLUMN "dataCriacao" SET NOT NULL
    `);
    await queryRunner.query(`
      ALTER TABLE "descartes"
        ALTER COLUMN "dataCriacao" SET DEFAULT CURRENT_TIMESTAMP,
        ALTER COLUMN "dataCriacao" SET NOT NULL
    `);
    await queryRunner.query(`
      ALTER TABLE "itens_descarte"
        ADD COLUMN "dataCriacao" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
            FROM pg_constraint
           WHERE conrelid = '"usuarios"'::regclass
             AND contype = 'u'
             AND pg_get_constraintdef(oid) = 'UNIQUE (email)'
        ) THEN
          ALTER TABLE "usuarios"
            ADD CONSTRAINT "UQ_usuarios_email" UNIQUE ("email");
        END IF;
      END
      $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "itens_descarte" DROP COLUMN "dataCriacao"`);
    await queryRunner.query(`
      ALTER TABLE "descartes"
        ALTER COLUMN "status" TYPE varchar(50)
        USING "status"::text
    `);
    await queryRunner.query(`
      ALTER TABLE "usuarios"
        ALTER COLUMN "role" TYPE varchar(50)
        USING "role"::text
    `);
    await queryRunner.query(`DROP TYPE "descartes_status_enum"`);
    await queryRunner.query(`DROP TYPE "usuarios_role_enum"`);
  }
}
