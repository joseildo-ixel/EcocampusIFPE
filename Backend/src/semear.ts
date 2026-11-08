import { fakerPT_BR as faker } from '@faker-js/faker';
import { AppDataSource } from './data-source'; // Verifique se o caminho do seu data-source.ts está correto
import { Coletor } from './coletor/entities/coletor.entity';
import { Objeto } from './objetos/entities/objeto.entity';

async function semear() {
  await AppDataSource.initialize();
  console.log('Conectado ao banco. Populando dados do EcoCampusIFPE...');

  faker.seed(42);

  // 1. Criar Coletores (Lixeiras CINFRA)
  const repoColetores = AppDataSource.getRepository(Coletor);
  const coletores = await repoColetores.save(
    Array.from({ length: 10 }, () => ({
      localizacao: `Bloco ${faker.string.alpha({ casing: 'upper' })} - ${faker.location.buildingNumber()}`,
      capacidadeMaxima: faker.number.float({ min: 50, max: 200, fractionDigits: 2 }),
      volumeAtual: faker.number.float({ min: 0, max: 40, fractionDigits: 2 }),
      ativo: true,
    }))
  );
  console.log(`✅ ${coletores.length} coletores criados.`);

  // 2. Criar Objetos
  const repoObjetos = AppDataSource.getRepository(Objeto);
  const tiposObjeto = ['metal', 'plástico', 'vidro', 'papel', 'eletrônico'];
  
  const objetos = await repoObjetos.save(
    Array.from({ length: 50 }, () => ({
      nome: faker.commerce.productName(),
      descricao: faker.commerce.productDescription(),
      tipo: faker.helpers.arrayElement(tiposObjeto),
      pesoKg: faker.number.float({ min: 0.1, max: 25, fractionDigits: 2 }),
      ativo: true,
      pertencePatrimonio: faker.datatype.boolean(0.2), // 20% de chance de ser patrimônio
    }))
  );
  console.log(`✅ ${objetos.length} objetos criados.`);

  console.log('🌱 Semeadura concluída com sucesso!');
  await AppDataSource.destroy();
}

semear().catch((erro) => {
  console.error('Falhou ao semear:', erro);
  process.exit(1);
});