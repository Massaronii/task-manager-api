import { fileURLToPath } from 'node:url';
import { parse } from 'csv-parse';
import fs from 'node:fs';
import fetch from 'node-fetch';

// Função para importar o CSV e fazer o POST para a API
async function importCSV(filePath) {
    const fileStream = fs.createReadStream(filePath);
    const parser = fileStream.pipe(parse({
        columns: true,
        skip_empty_lines: true
    }));

    for await (const row of parser) {
        try {
            const { title, description } = row;

            const response = await fetch("http://localhost:3333/tasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title,
                    description
                })
            });

            if (response.ok) {
                console.log(`Task "${title}" importada com sucesso.`);
            } else {
                console.error(`Erro ao importar task "${title}":`, response.statusText);
            }
        } catch (error) {
            console.error('Erro durante a importação:', error.message);
        }
    }
}

// Resolva a URL e converta para caminho de arquivo
const csvPath = new URL("../../tasks.csv", import.meta.url);
const csvFilePath = fileURLToPath(csvPath);  // Converte URL para caminho de arquivo

// Inicia a importação do CSV
await importCSV(csvFilePath);
