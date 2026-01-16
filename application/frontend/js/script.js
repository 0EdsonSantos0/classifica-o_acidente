const API_URL = "http://127.0.0.1:5000/predict";

const form = document.getElementById("uploadForm");
const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const resultDiv = document.getElementById("result");
const probsDiv = document.getElementById("probs");

// Preview da imagem
imageInput.addEventListener("change", () => {
    preview.innerHTML = "";
    preview.classList.remove("hidden");

    const file = imageInput.files[0];
    if (!file) return;

    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    preview.appendChild(img);
});

// Envio para o backend
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const file = imageInput.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    resultDiv.className = "result";
    resultDiv.innerText = "⏳ Processando imagem...";
    resultDiv.classList.remove("hidden");

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        const classe = data.classe_original;
        const resultado = data.resultado;
        const probs = data.probabilidades;

        // Resultado principal
        resultDiv.innerText = `Resultado: ${resultado}`;
        resultDiv.className = `result ${classe}`;
        resultDiv.classList.remove("hidden");

        // Probabilidades
        probsDiv.innerHTML = "";
        probsDiv.classList.remove("hidden");

        for (const [classe, value] of Object.entries(probs)) {
            const item = document.createElement("div");
            item.className = "prob-item";
            let label = "";
            if (classe === "grave") {
                label = "Grave";
            } else if (classe === "moderado") {
                label = "Moderado";
            } else {
                label = "Nenhum acidente";
            }
            item.innerHTML = `
                <strong>${label}</strong> — ${value}%
                <div class="bar">
                    <div class="bar-fill ${classe}" style="width: ${value}%"></div>
                </div>
            `;

            probsDiv.appendChild(item);
        }

    } catch (error) {
        resultDiv.innerText = "❌ Erro ao processar a imagem.";
    }
});
