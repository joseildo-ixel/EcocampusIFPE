import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddObjectAssetFlag1000000000004
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'objetos',
      new TableColumn({
        name: 'pertencePatrimonio',
        type: 'boolean',
        default: false,
        isNullable: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('objetos', 'pertencePatrimonio');
  }
}