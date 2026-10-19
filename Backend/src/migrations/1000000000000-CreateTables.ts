import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTables1000000000000 implements MigrationInterface {
  name = 'CreateTables1000000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'usuarios',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'nome',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isUnique: true,
          },
          {
            name: 'senha',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'role',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'ativo',
            type: 'boolean',
            default: true,
          },
          {
            name: 'dataCriacao',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'objetos',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'nome',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'descricao',
            type: 'text',
          },
          {
            name: 'tipo',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'pesoKg',
            type: 'numeric',
            precision: 5,
            scale: 2,
          },
          {
            name: 'ativo',
            type: 'boolean',
            default: true,
          },
          {
            name: 'dataCriacao',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'coletores',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'nome',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'matricula',
            type: 'varchar',
            length: '20',
            isUnique: true,
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'telefone',
            type: 'varchar',
            length: '20',
          },
          {
            name: 'departamento',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'ativo',
            type: 'boolean',
            default: true,
          },
          {
            name: 'dataCriacao',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'descartes',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'status',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'dataDescarte',
            type: 'timestamp',
          },
          {
            name: 'pesoKg',
            type: 'numeric',
            precision: 5,
            scale: 2,
          },
          {
            name: 'tipoResiduo',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'destino',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'observacoes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'dataCriacao',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'usuarioId',
            type: 'uuid',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['usuarioId'],
            referencedTableName: 'usuarios',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('descartes');
    await queryRunner.dropTable('coletores');
    await queryRunner.dropTable('objetos');
    await queryRunner.dropTable('usuarios');
  }
}
