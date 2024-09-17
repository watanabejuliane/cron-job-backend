const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cron = require('node-cron');
const app = express();

// Configurar o banco de dados SQLite
const db1 = new sqlite3.Database('./db1.sqlite');
const db2 = new sqlite3.Database('./db2.sqlite');

// tabelas exemplo no banco de dados 1 e 2
db1.run('CREATE TABLE IF NOT EXISTS tabela1 (id INTEGER PRIMARY KEY, nome TEXT)');
db2.run('CREATE TABLE IF NOT EXISTS tabela2 (id INTEGER PRIMARY KEY, nome TEXT)');

const copiarDados = (nomeTabela1, nomeTabela2) => {
  // Obter todas as colunas de tabela1
  // o comando pragma table_info permite descobrir as colunas dinamicamente sem codificar seus nomes no sql
  db1.all(`PRAGMA table_info(${nomeTabela1})`, (err, columns) => {
    if (err) {
      console.error('Erro ao obter informações da tabela:', err);
      return;
    }

    const colunas = columns.map(col => col.name).join(', ');  // juntar os nomes das colunas
    const placeholders = columns.map(() => '?').join(', ');  // criar placeholders "?" para as colunas
    const updatePlaceholders = columns.map(col => `${col.name} = excluded.${col.name}`).join(', ');  // criar update para cada coluna, upsert

    // Buscar dados da tabela1
    db1.all(`SELECT * FROM ${nomeTabela1}`, (err, rows) => {
      if (err) {
        console.error('Erro ao buscar dados:', err);
        return;
      }

      rows.forEach((row) => {
        const values = columns.map(col => row[col.name]);  // Obter valores dinamicamente

        // Inserir ou atualizar dados na tabela2
        db2.run(
          `INSERT INTO ${nomeTabela2} (${colunas}) VALUES (${placeholders}) ON CONFLICT(id) DO UPDATE SET ${updatePlaceholders}`,
          values,
          (err) => { //, array contendo os valores da linha atual svai preencher os placeholders
            if (err) {
              console.error('Erro ao inserir ou atualizar dados:', err);
            } else {
              console.log(`Dados copiados: ${row.id}`);
            }
          }
        );
      });
    });
  });
};


// Agendar cron job para rodar a cada minuto
cron.schedule('* * * * *', () => {
  console.log('Executando cron job...');
  copiarDados('tabela1', 'tabela2');
});

// Servidor básico
app.get('/', (req, res) => {
  res.send('Cron job está rodando!');
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
