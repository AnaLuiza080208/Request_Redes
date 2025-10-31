const JUDGE0_URL = "http://judge.darlon.com.br";

const source_code = `
print(input())
`;

const stdin = `Olá, Turma!`;

// Converte para Base64
const encoded_source = Buffer.from(source_code, "utf-8").toString("base64");
const encoded_stdin  = Buffer.from(stdin, "utf-8").toString("base64");

const payload = {
    source_code: encoded_source,
    language_id: 71, // 71 = Python 3.x
    stdin: encoded_stdin,
    base64_encoded: true,
    wait: true // Espera a execução ser concluída
};

const url = `${JUDGE0_URL}/submissions?base64_encoded=true&wait=true`;

async function submitCode() {
    console.log("Enviando submissão para o Judge0...");
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload) 
        });

        if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }

        const result = await response.json();

        // Decodifica a saída (stdout) e o erro (stderr) de Base64
        const stdout = Buffer.from(result.stdout || "", "base64").toString("utf-8");
        const stderr = Buffer.from(result.stderr || "", "base64").toString("utf-8");

        console.log("Status:", result.status?.description);
        console.log("Saída padrão:", stdout);
        console.log("Erros:", stderr);

    } catch (error) {
        console.error("Erro ao fazer a requisição:", error);
    }
}

submitCode();