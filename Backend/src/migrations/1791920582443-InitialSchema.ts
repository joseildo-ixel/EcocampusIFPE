import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1791920582443 implements MigrationInterface {
    name = 'InitialSchema1791920582443'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "usuarios" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nome" character varying(100) NOT NULL, "email" character varying NOT NULL, "senhaHash" character varying NOT NULL, "ativo" boolean NOT NULL DEFAULT true, "criadoEm" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_446adfc18b35418aac32ae0b7b5" UNIQUE ("email"), CONSTRAINT "PK_d7281c63c176e152e4c531594a8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "descartes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tipoResiduo" character varying(100) NOT NULL, "quantidade" double precision NOT NULL, "localColeta" character varying, "criadoEm" TIMESTAMP NOT NULL DEFAULT now(), "usuario_id" uuid, "coletor_id" uuid, CONSTRAINT "PK_6b30c17fbaf8d5631e13fba1a95" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "coletores" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "localizacao" character varying(150) NOT NULL, "capacidadeMaxima" double precision NOT NULL, "volumeAtual" double precision NOT NULL DEFAULT '0', CONSTRAINT "PK_fac1990cd121446e57b00afe151" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "coletas" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "data" TIMESTAMP NOT NULL DEFAULT now(), "quantidade" double precision NOT NULL, "coletor_id" uuid, CONSTRAINT "PK_03c49dc94fef7c07534db841661" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "objeto" ("id" SERIAL NOT NULL, "nome" character varying NOT NULL, "descricao" character varying, "quantidade" integer NOT NULL, CONSTRAINT "PK_964b7bdaecc55326449f08fd294" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "descartes" ADD CONSTRAINT "FK_90544aa6da1416ed62572c3cd4d" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "descartes" ADD CONSTRAINT "FK_83675b440fbf389abf3f17f844c" FOREIGN KEY ("coletor_id") REFERENCES "coletores"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "coletas" ADD CONSTRAINT "FK_d0041a5fc7d9e0b91c5a9ce379d" FOREIGN KEY ("coletor_id") REFERENCES "coletores"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coletas" DROP CONSTRAINT "FK_d0041a5fc7d9e0b91c5a9ce379d"`);
        await queryRunner.query(`ALTER TABLE "descartes" DROP CONSTRAINT "FK_83675b440fbf389abf3f17f844c"`);
        await queryRunner.query(`ALTER TABLE "descartes" DROP CONSTRAINT "FK_90544aa6da1416ed62572c3cd4d"`);
        await queryRunner.query(`DROP TABLE "objeto"`);
        await queryRunner.query(`DROP TABLE "coletas"`);
        await queryRunner.query(`DROP TABLE "coletores"`);
        await queryRunner.query(`DROP TABLE "descartes"`);
        await queryRunner.query(`DROP TABLE "usuarios"`);
    }

}
