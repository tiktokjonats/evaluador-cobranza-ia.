# Simulador-Analizador-Cobranza

Estructura:
- backend/: servidor Express que llama a OpenAI
- frontend/: app React (Vite) para pegar conversaciones y mostrar reportes

## Pasos para ejecutar localmente

1. Clonar o crear la carpeta con la estructura indicada.

2. Backend:
   - Ir a `backend/`
   - Copiar `.env.example` a `.env` y pegar `OPENAI_API_KEY=sk-...`
   - Instalar dependencias: `npm install`
   - Levantar server: `npm run start` (o `npm run dev` para nodemon)
   - El backend escuchará por defecto en `http://localhost:3001`

3. Frontend:
   - Ir a `frontend/`
   - Instalar dependencias: `npm install`
   - Levantar dev server: `npm run dev`
   - Abrir `http://localhost:5173` (Vite) — la UI hace proxy a `/api` hacia `http://localhost:3001`

4. Uso:
   - Pegar la conversación en la UI y hacer clic en "Analizar conversación".
   - El backend llamará a OpenAI y devolverá un JSON con `report`, `checklist` y `suggested_phrases`.

## Notas de seguridad
- NO subas `.env` a GitHub.
- Controla la cantidad de peticiones a OpenAI para no consumir créditos innecesarios.

## Mejoras sugeridas
- Agregar autenticación (roles líderes/asesores).
- Exportar reporte a PDF o Word.
- Guardar historial en base de datos.
