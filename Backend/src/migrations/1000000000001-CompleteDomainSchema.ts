import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CompleteDomainSchema1000000000001
  implements MigrationInterface
{
  name = 'CompleteDomainSchema1000000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "coletores"
        ALTER COLUMN "nome" DROP NOT NULL,
        ALTER COLUMN "matricula" DROP NOT NULL,
        ALTER COLUMN "email" DROP NOT NULL,
        ALTER COLUMN "telefone" DROP NOT NULL,
        ALTER COLUMN "departamento" DROP NOT NULL,
        ADD COLUMN "localizacao" character varying(255) NOT NULL DEFAULT 'Não informado',
        ADD COLUMN "capacidadeMaxima" numeric(10,2) NOT NULL DEFAULT 100,
        ADD COLUMN "volumeAtual" numeric(10,2) NOT NULL DEFAULT 0
    `);

    await queryRunner.query(`
      ALTER TABLE "descartes"
        ADD COLUMN "coletorId" uuid NULL
    `);
    await queryRunner.query(`
      ALTER TABLE "descartes"
        ADD CONSTRAINT "FK_descartes_coletor"
        FOREIGN KEY ("coletorId") REFERENCES "coletores"("id")
        ON DELETE SET NULL
    `);

    await queryRunner.createTable(
      new Table({
        name: 'itens_descarte',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          { name: 'descarteId', type: 'uuid' },
          { name: 'objetoId', type: 'uuid' },
          { name: 'quantidade', type: 'integer' },
        ],
        foreignKeys: [
          {
            name: 'FK_itens_descarte_descarte',
            columnNames: ['descarteId'],
            referencedTableName: 'descartes',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            name: 'FK_itens_descarte_objeto',
            columnNames: ['objetoId'],
            referencedTableName: 'objetos',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
        ],
        uniques: [
          {
            name: 'UQ_itens_descarte_objeto',
            columnNames: ['descarteId', 'objetoId'],
          },
        ],
        checks: [
          {
            name: 'CHK_itens_descarte_quantidade',
            expression: '"quantidade" > 0',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('itens_descarte', true);
    await queryRunner.query(`
      ALTER TABLE "descartes"
        DROP CONSTRAINT "FK_descartes_coletor",
        DROP COLUMN "coletorId"
    `);
    await queryRunner.query(`
      ALTER TABLE "coletores"
        DROP COLUMN "volumeAtual",
        DROP COLUMN "capacidadeMaxima",
        DROP COLUMN "localizacao"
    `);
  }
}
