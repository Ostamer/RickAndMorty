import pg from "pg";
import fetch from 'node-fetch';

const databaseConfig = {
  user: 'candidate',
  host: 'rc1b-r21uoagjy1t7k77h.mdb.yandexcloud.net',
  database: 'db1',
  password: '62I8anq3cFq5GYh2u4Lh',
  port: 6432,
  ssl: {
    rejectUnauthorized: false,
  },
};

const client = new pg.Client(databaseConfig);

async function createTable() {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS characters (
        id SERIAL PRIMARY KEY,
        name TEXT,
        data JSONB
      )
    `;
    await client.query(createTableQuery);
    console.log('Таблица создана');
  } catch (error) {
    console.error('Таблица не создана:', error);
  }
}

async function insertData() {
  try {
    const response = await fetch('https://rickandmortyapi.com/api/character/');
    const data = await response.json();
    console.log(data);
    for (const character of data.results) {
      const query = `
        INSERT INTO characters (name, data)
        VALUES ($1, $2)
      `;
      const values = [character.name, character];
      console.log(values);
      await client.query(query, values);
    }

    console.log('Данные загружены в базу данных');
  } catch (error) {
    console.error('Произошла ошибка:', error);
  }
}

async function fetchDataAndInsertIntoDb() {
  await client.connect();
  await createTable();
  await insertData(); 
  await client.end();  
}

fetchDataAndInsertIntoDb();
