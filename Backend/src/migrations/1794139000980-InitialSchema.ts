import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1794139000980 implements MigrationInterface {
    name = 'InitialSchema1794139000980'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."usuarios_role_enum" AS ENUM('admin', 'usuario', 'coletor')`);
        await queryRunner.query(`CREATE TABLE "usuarios" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nome" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "senha" character varying(255) NOT NULL, "role" "public"."usuarios_role_enum" NOT NULL, "ativo" boolean NOT NULL DEFAULT true, "dataCriacao" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_446adfc18b35418aac32ae0b7b5" UNIQUE ("email"), CONSTRAINT "PK_d7281c63c176e152e4c531594a8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "coletores" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "localizacao" character varying(255) NOT NULL, "capacidadeMaxima" numeric(5,2) NOT NULL, "volumeAtual" numeric(5,2) NOT NULL DEFAULT '0', "ativo" boolean NOT NULL DEFAULT true, "dataCriacao" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_fac1990cd121446e57b00afe151" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "objetos" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nome" character varying(255) NOT NULL, "descricao" text NOT NULL, "tipo" character varying(50) NOT NULL, "pesoKg" numeric(5,2) NOT NULL, "ativo" boolean NOT NULL DEFAULT true, "dataCriacao" TIMESTAMP NOT NULL DEFAULT now(), "pertencePatrimonio" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_5f2898ccbd673819ed827b32a91" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "itens_descarte" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "descarteId" uuid NOT NULL, "objetoId" uuid NOT NULL, "quantidade" integer NOT NULL, "dataCriacao" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9f2c4423016442b7a49f520e744" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."descartes_status_enum" AS ENUM('pendente', 'processado', 'finalizado')`);
        await queryRunner.query(`CREATE TABLE "descartes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" "public"."descartes_status_enum" NOT NULL, "dataDescarte" TIMESTAMP NOT NULL, "pesoKg" numeric(5,2) NOT NULL, "tipoResiduo" character varying(50) NOT NULL, "destino" character varying(100) NOT NULL, "observacoes" text, "dataCriacao" TIMESTAMP NOT NULL DEFAULT now(), "usuarioId" uuid NOT NULL, "coletorId" uuid, CONSTRAINT "PK_6b30c17fbaf8d5631e13fba1a95" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "itens_descarte" ADD CONSTRAINT "FK_49f07177bf67843e4ec07556c66" FOREIGN KEY ("descarteId") REFERENCES "descartes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "itens_descarte" ADD CONSTRAINT "FK_efc2ebe53c3d1ea9ee156cea704" FOREIGN KEY ("objetoId") REFERENCES "objetos"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "descartes" ADD CONSTRAINT "FK_c67d0b8e0d856b79edab1f2be7f" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "descartes" ADD CONSTRAINT "FK_d939e8cce3f783abacb2287aeed" FOREIGN KEY ("coletorId") REFERENCES "coletores"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "descartes" DROP CONSTRAINT "FK_d939e8cce3f783abacb2287aeed"`);
        await queryRunner.query(`ALTER TABLE "descartes" DROP CONSTRAINT "FK_c67d0b8e0d856b79edab1f2be7f"`);
        await queryRunner.query(`ALTER TABLE "itens_descarte" DROP CONSTRAINT "FK_efc2ebe53c3d1ea9ee156cea704"`);
        await queryRunner.query(`ALTER TABLE "itens_descarte" DROP CONSTRAINT "FK_49f07177bf67843e4ec07556c66"`);
        await queryRunner.query(`DROP TABLE "descartes"`);
        await queryRunner.query(`DROP TYPE "public"."descartes_status_enum"`);
        await queryRunner.query(`DROP TABLE "itens_descarte"`);
        await queryRunner.query(`DROP TABLE "objetos"`);
        await queryRunner.query(`DROP TABLE "coletores"`);
        await queryRunner.query(`DROP TABLE "usuarios"`);
        await queryRunner.query(`DROP TYPE "public"."usuarios_role_enum"`);
    }

}
