## Descrição

Este projeto é uma aplicação backend simples desenvolvida com Node.js, Express e SQLite. A aplicação foi criada para demonstrar o uso de cron jobs para realizar tarefas automáticas de cópia de dados entre tabelas em bancos de dados diferentes. 

É configurado para executar automaticamente em intervalos regulares, sincronizando os dados conforme necessário.

O cron job realiza as seguintes operações:
1. **Limpeza de Tabela**: Remove todos os registros da tabela `tabela2` no banco de dados `db2`.
2. **Cópia de Dados**: Busca todos os registros da tabela `tabela1` no banco de dados `db1` e os insere na tabela `tabela2` no banco de dados `db2`.


Tecnologias Utilizadas:
- Node.js
- Express
- SQLite
- node-cron
