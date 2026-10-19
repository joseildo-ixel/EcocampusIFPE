import { MigrationInterface, QueryRunner } from 'typeorm';

export class PreserveDisposalHistory1000000000002
  implements MigrationInterface
{
  name = 'PreserveDisposalHistory1000000000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      DECLARE foreign_key_name text;
      BEGIN
        SELECT constraint_row.conname
          INTO foreign_key_name
          FROM pg_constraint AS constraint_row
         WHERE constraint_row.contype = 'f'
           AND constraint_row.conrelid = '"descartes"'::regclass
           AND constraint_row.confrelid = '"usuarios"'::regclass;

        IF foreign_key_name IS NOT NULL THEN
          EXECUTE format(
            'ALTER TABLE "descartes" DROP CONSTRAINT %I',
            foreign_key_name
          );
        END IF;

        ALTER TABLE "descartes"
          ADD CONSTRAINT "FK_descartes_usuario"
          FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id")
          ON DELETE RESTRICT;
      END
      $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "descartes"
        DROP CONSTRAINT "FK_descartes_usuario",
        ADD CONSTRAINT "FK_descartes_usuario_legacy"
        FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id")
        ON DELETE CASCADE
    `);
  }
}
