// server.js - Backend Express que llama a OpenAI
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
app.use(bodyParser.json());

const OPENAI_KEY = process.env.OPENAI_API_KEY;
const PORT = process.env.PORT || 3001;

if (!OPENAI_KEY) {
  console.warn('⚠️  OPENAI_API_KEY no está definida en .env. El endpoint /api/analyze fallará sin ella.');
}

app.post('/api/analyze', async (req, res) => {
  try {
    const { conversation = '', clientName = '' } = req.body;
    if (!conversation) return res.status(400).json({ error: 'Missing conversation' });

    // Prompt base — ajusta según tu checklist
    const prompt = `Eres un coach experto en cobranza. Analiza la siguiente conversación entre un asesor y un cliente. 
Devuelve un JSON con las llaves: 
- report: texto profesional, listo para copiar en un correo a líderes (spanish).
- checklist: objeto con secciones: Saludo, Identificación, Información producto, Indagación, Propuesta, Urgencia, Cierre. 
  Cada sección debe tener: { cumple: true/false, observacion: "...", sugerencia: "..." }.
- suggested_phrases: array de frases recomendadas (strings).

Conversación:
${conversation}

ClienteNombre: ${clientName}
`;

    // Llamada a OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
        max_tokens: 1200
      })
    });

    if (!response.ok) {
      const txt = await response.text();
      return res.status(500).json({ error: 'OpenAI error', detail: txt });
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content ?? '';

    // Intentamos parsear JSON devuelto por el modelo; si no, lo devolvemos como report de texto.
    try {
      const parsed = JSON.parse(text);
      return res.json(parsed);
    } catch (e) {
      // Si el modelo devolvió texto libre, lo colocamos en report y devolvemos checklist vacío
      return res.json({ report: text, checklist: {}, suggested_phrases: [] });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend corriendo en http://localhost:${PORT}`);
});
