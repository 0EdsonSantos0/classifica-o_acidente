const API_URL = "https://classifica-o-acidente.onrender.com/predict";

const form = document.getElementById("uploadForm");
const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const resultDiv = document.getElementById("result");
const probsDiv = document.getElementById("probs");
const contacdiv = document.getElementById("contact");

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

        const sosBtn = document.getElementById('btn-sos');
        const seguroBtn = document.getElementById('btn-seguro');
        sosBtn.style.display = 'none';
        seguroBtn.style.display = 'none';

        const classe = data.classe_original;
        const resultado = data.resultado;
        const probs = data.probabilidades;

        // Resultado principal
        resultDiv.innerText = `Resultado: ${resultado}`;
        resultDiv.className = `result ${classe}`;
        resultDiv.classList.remove("hidden");

        if (resultDiv.className === "result grave") {
            sosBtn.style.display = 'block';
            sosBtn.onclick = () => alert(`🚨 ALERTA DE EMERGÊNCIA ENVIADO!\nLocal: ${lat}, ${lon}\nStatus: Acidente Grave.`);
            contacdiv.classList.remove("hidden");
        } else if (resultDiv.className === "result moderado") {
            seguroBtn.style.display = 'block';
            seguroBtn.onclick = () => window.open('https://www.google.com/search?q=seguradoras+em+Fortaleza', '_blank');
            contacdiv.classList.remove("hidden");
        } else {
            contacdiv.classList.add("hidden");
        }

    } catch (error) {
        probsDiv.innerHTML = "";
        resultDiv.innerText = "❌ Erro ao processar a imagem.";
    }
});
