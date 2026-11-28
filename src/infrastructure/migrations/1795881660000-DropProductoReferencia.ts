import { MigrationInterface, QueryRunner } from "typeorm";

export class DropProductoReferencia1795881660000 implements MigrationInterface {
  name = "DropProductoReferencia1795881660000";

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "aqua_nova"."productos" DROP COLUMN IF EXISTS "prod_referencia"',
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "aqua_nova"."productos" ADD COLUMN IF NOT EXISTS "prod_referencia" numeric',
    );
  }
}
