document.getElementById("analyzeBtn").addEventListener("click", async () => {
  const conversation = document.getElementById("conversation").value.trim();
  const resultDiv = document.getElementById("result");

  if (!conversation) {
    alert("Por favor, pega la conversación del asesor.");
    return;
  }

  resultDiv.innerHTML = "⏳ Analizando conversación, por favor espera...";

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer TU_API_KEY_AQUI`
      },
      body: JSON.stringify({
        model: "gpt-5",
        messages: [
          {
            role: "system",
            content:
              "Eres un coach experto en cobranzas. Evalúa al asesor según los 9 criterios del checklist de cobranza y genera un reporte con observaciones, sugerencias y frases de mejora. Al final, genera un correo formal para los líderes con los resultados."
          },
          {
            role: "user",
            content: conversation
          }
        ]
      })
    });

    const data = await response.json();
    const output = data.choices?.[0]?.message?.content || "No se pudo generar el análisis.";
    resultDiv.textContent = output;
  } catch (error) {
    console.error(error);
    resultDiv.textContent = "❌ Error al analizar la conversación.";
  }
});
