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

// Função para copiar dados de tabela1 (db1) para tabela2 (db2)
const copiarDados = () => {
  // Limpar tabela2 antes de inserir novos dados
  db2.run('DELETE FROM tabela2', (err) => {
    if (err) {
      console.error('Erro ao limpar tabela2:', err);
      return;
    }

    // Copiar dados de tabela1 para tabela2
    db1.all('SELECT * FROM tabela1', (err, rows) => {
      if (err) {
        console.error('Erro ao buscar dados:', err);
        return;
      }

      rows.forEach((row) => {
        db2.run('INSERT INTO tabela2 (id, nome) VALUES (?, ?)', [row.id, row.nome], (err) => {
          if (err) {
            console.error('Erro ao inserir dados:', err);
          } else {
            console.log(`Dados copiados: ${row.id} - ${row.nome}`);
          }
        });
      });
    });
  });
};

// Agendar cron job para rodar a cada minuto
cron.schedule('* * * * *', () => {
  console.log('Executando cron job...');
  copiarDados();
});

// Servidor básico
app.get('/', (req, res) => {
  res.send('Cron job está rodando!');
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
