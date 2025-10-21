import React, { useState } from "react";

export default function App() {
  const [conversation, setConversation] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [name, setName] = useState("");

  async function handleAnalyze() {
    setError(null);
    setResult(null);
    const text = conversation.trim();
    if (!text) return setError("Pega la conversación en el cuadro de texto antes de analizar.");
    setLoading(true);
    try {
      const resp = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversation: text, clientName: name }),
      });
      if (!resp.ok) {
        const errText = await resp.text();
        throw new Error(errText || "Error en el servidor");
      }
      const data = await resp.json();
      setResult(data);
    } catch (e) {
      setError(String(e.message || e));
    } finally {
      setLoading(false);
    }
  }

  function sample() {
    setConversation(`Asesor\tHola señor Richard Cómo estás\nCliente\tHola, buenas tardes. Estoy bien, gracias. ¿Me podrías decir de qué se trata la llamada, por favor?\nAsesor\tBuenas tardes con el señor Richard Emerson García Pérez es correcto señor\n...`);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow p-6">
        <h1 className="text-2xl font-bold mb-2">Analizador de Conversaciones - Cobranza</h1>
        <p className="text-sm text-gray-600 mb-4">Pega la conversación (formato: "Asesor\tMensaje\nCliente\tMensaje") y genera un reporte listo para enviar a líderes.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-700">Conversación</label>
            <textarea
              value={conversation}
              onChange={(e) => setConversation(e.target.value)}
              rows={12}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-opacity-50 p-3"
              placeholder={`Pega la conversación aquí...`}
            />
            <div className="flex gap-2 mt-2">
              <button onClick={sample} className="px-3 py-1 bg-gray-200 rounded">Cargar ejemplo</button>
              <button onClick={() => setConversation("")} className="px-3 py-1 bg-red-100 rounded">Limpiar</button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700">Nombre del cliente (opcional)</label>
            <input value={name} onChange={(e)=>setName(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 p-2" placeholder="Richard Emerson" />

            <div className="mt-4">
              <button onClick={handleAnalyze} disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-60">
                {loading ? 'Analizando...' : 'Analizar conversación'}
              </button>
            </div>

            {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
          </div>
        </div>

        <div className="mt-6">
          {result ? (
            <div className="prose max-w-none">
              <h2>Resumen generado</h2>
              <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap">{result.report}</pre>
              <h3 className="mt-4">Checklist</h3>
              <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(result.checklist, null, 2)}</pre>
              <h3 className="mt-4">Frases sugeridas</h3>
              <pre className="bg-gray-100 p-4 rounded">{Array.isArray(result.suggested_phrases) ? result.suggested_phrases.join('\\n') : result.suggested_phrases}</pre>
            </div>
          ) : (
            <div className="text-gray-500">Aquí aparecerá el reporte después del análisis.</div>
          )}
        </div>

      </div>

      <div className="text-xs text-gray-500 mt-3">Frontend demo — necesitas un backend con clave OpenAI para generar análisis automáticos.</div>
    </div>
  );
}
