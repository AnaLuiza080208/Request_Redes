import fetch from "node-fetch"; // Se não estiver usando ES Module, use: const fetch = require("node-fetch");

const JUDGE0_URL = "http://judge.darlon.com.br";

// Código Python
const source_code = `
val_a = int(input())
val_b = int(input())
val_soma = val_a + val_b
print(val_soma)
`;

// Entradas (stdin)
const stdin = `3
5`;

// Saída esperada
const expected_output = `8`;

// Converte para Base64
const encoded_source = Buffer.from(source_code, "utf-8").toString("base64");
const encoded_stdin  = Buffer.from(stdin, "utf-8").toString("base64");

// Payload para Judge0
const payload = {
    source_code: encoded_source,
    language_id: 71, // Python 3.x
    stdin: encoded_stdin,
    base64_encoded: true,
    wait: true
};

const url = `${JUDGE0_URL}/submissions?base64_encoded=true&wait=true`;

async function submitCode() {
    console.log("Enviando submissão para o Judge0...");

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }

        const result = await response.json();

        // Decodifica stdout e stderr
        const stdout = Buffer.from(result.stdout || "", "base64").toString("utf-8").trim();
        const stderr = Buffer.from(result.stderr || "", "base64").toString("utf-8").trim();

        console.log("\nStatus:", result.status?.description || "Desconhecido");
        console.log("\nSaída do programa:", stdout || "Nenhuma");
        if (stderr) console.log("\nErros:", stderr);

        // Comparação automática
        checkOutput(stdout, expected_output.trim(), stdin);

    } catch (error) {
        console.error("❌ Erro ao fazer a requisição:", error);
    }
}

// Função que compara saída e calcula porcentagem de acerto
function checkOutput(actual, expected, stdin) {
    // Mostra valores de entrada
    const inputs = stdin.split("\n").map(s => s.trim()).join(", ");
    console.log("\nEntrada:", inputs);

    if (actual === expected) {
        console.log("✅ Saída correta! 100% de acerto.");
    } else {
        console.log("❌ Saída incorreta.");

        // Calcula porcentagem de acerto caractere a caractere
        const minLength = Math.min(actual.length, expected.length);
        let correctChars = 0;
        for (let i = 0; i < minLength; i++) {
            if (actual[i] === expected[i]) correctChars++;
        }

        const accuracy = ((correctChars / expected.length) * 100).toFixed(2);
        console.log(`Porcentagem de acerto: ${accuracy}%`);
        console.log(`Saída esperada: "${expected}"`);
        console.log(`Saída obtida:  "${actual}"`);
    }
}

// Executa
submitCode();
