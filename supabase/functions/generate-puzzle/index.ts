// Edge Function: generate-puzzle
//
// Akış: PDF (base64) al → Claude Sonnet 5 ile {answer, clue}[] üret (yapılandırılmış)
//       → engine ile kesişimli grid kur → client'ın Puzzle sözleşmesini döndür.
//
// Güvenlik: ANTHROPIC_API_KEY yalnızca burada (Deno.env) okunur, client'a asla
// gitmez. Deploy'da Supabase JWT doğrulaması (config verify_jwt) endpoint'i korur.
//
// NOT: Bu MVP'de sonuç DB'ye YAZILMAZ (Faz 3). EF sadece üretip döndürür.

import { buildLayout, LayoutError } from "./crossword/grid-builder.ts";
import { displayLetters } from "./crossword/letters.ts";
import type { GeneratedWord } from "./crossword/types.ts";
import { buildUserInstruction, SYSTEM_PROMPT, WORDS_TOOL } from "./prompt.ts";

const CORS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

class HttpError extends Error {
  constructor(readonly status: number, message: string) {
    super(message);
  }
}

interface RequestBody {
  pdfBase64?: string;
  topic?: string;
  wordCount?: number;
  difficulty?: string;
  language?: string;
  sourceName?: string;
}

const ALLOWED_DIFFICULTY = new Set(["kolay", "orta", "zor"]);

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, "content-type": "application/json" },
  });
}

function clampInt(value: unknown, lo: number, hi: number): number {
  const n = Math.round(Number(value));
  if (Number.isNaN(n)) return lo;
  return Math.max(lo, Math.min(hi, n));
}

async function generateWords(args: {
  apiKey: string;
  pdfBase64: string;
  topic: string;
  difficulty: string;
  language: string;
  requestCount: number;
}): Promise<GeneratedWord[]> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": args.apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-5",
      max_tokens: 8192,
      system: SYSTEM_PROMPT,
      tools: [WORDS_TOOL],
      // Modeli aracı çağırmaya ZORLA → çıktı garanti WORDS_TOOL şeklinde gelir.
      tool_choice: { type: "tool", name: WORDS_TOOL.name },
      messages: [
        {
          role: "user",
          content: [
            // Document bloğu metinden ÖNCE gelmeli (Anthropic önerisi).
            {
              type: "document",
              source: { type: "base64", media_type: "application/pdf", data: args.pdfBase64 },
            },
            {
              type: "text",
              text: buildUserInstruction({
                topic: args.topic,
                difficulty: args.difficulty,
                language: args.language,
                requestCount: args.requestCount,
              }),
            },
          ],
        },
      ],
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    // Sık karşılaşılan: PDF sayfa limiti (Claude en fazla 600 sayfa).
    if (/pages may be provided|PDF pages/i.test(detail)) {
      throw new HttpError(413, "PDF çok uzun (en fazla 600 sayfa). Kitabın tamamını değil, ilgili bölümü/ders notunu yükle.");
    }
    throw new HttpError(502, `Claude API hatası (${res.status}): ${detail.slice(0, 300)}`);
  }

  const data = await res.json();
  const content: unknown = data?.content;
  const toolUse = Array.isArray(content)
    ? content.find((block) => block?.type === "tool_use")
    : undefined;
  const words = toolUse?.input?.words;
  if (!Array.isArray(words)) {
    throw new HttpError(502, "Claude beklenen yapıda çıktı vermedi.");
  }
  return words.filter(
    (w): w is GeneratedWord =>
      w && typeof w.answer === "string" && typeof w.clue === "string",
  );
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "Yalnızca POST destekleniyor." }, 405);

  try {
    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) throw new HttpError(500, "ANTHROPIC_API_KEY tanımlı değil.");

    const body = (await req.json()) as RequestBody;

    const pdfBase64 = body.pdfBase64?.trim();
    if (!pdfBase64) throw new HttpError(400, "pdfBase64 alanı zorunlu.");
    // Anthropic istek sınırı ~32MB. Devasa dosyayı Claude'a hiç göndermeden,
    // hızlıca ve dostça reddet. (base64 uzunluğu ≈ dosya boyutu × 1.33)
    if (pdfBase64.length > 30_000_000) {
      throw new HttpError(413, "PDF çok büyük. Tüm kitabı değil, ilgili bölümü/ders notunu yükle.");
    }

    const wordCount = clampInt(body.wordCount ?? 20, 5, 30);
    const rawDifficulty = (body.difficulty ?? "").trim().toLowerCase();
    const difficulty = ALLOWED_DIFFICULTY.has(rawDifficulty) ? rawDifficulty : "orta";
    const language = (body.language ?? "tr").trim() || "tr";
    const topic = (body.topic ?? "").trim();
    const sourceName = (body.sourceName ?? "").trim() || "Yüklenen PDF";

    // Engine bazı kelimeleri eleyeceği için hedeften ~%40 fazla iste (üst sınır 40).
    const requestCount = Math.min(40, Math.round(wordCount * 1.4));

    // 1) Claude → kelime + ipucu
    const words = await generateWords({ apiKey, pdfBase64, topic, difficulty, language, requestCount });

    // 2) Engine → kesişimli grid (client'ın render edebileceği layout)
    const { layout, dropped } = buildLayout(words, wordCount);

    // 3) Client Puzzle sözleşmesini kur (src/features/puzzle/types.ts ile uyumlu)
    const note = dropped.length > 0
      ? `${dropped.length} kelime yeterli kesişim bulunamadığı için çıkarıldı.`
      : undefined;

    const puzzleWords = layout.placed.map((p, i) => ({
      id: i + 1,
      answer: p.answer,
      length: displayLetters(p.answer).length,
      clue: p.clue,
    }));

    const puzzle = {
      puzzleId: crypto.randomUUID(),
      source: sourceName,
      topic: topic.length > 0 ? topic : "PDF içeriği",
      language,
      difficulty,
      note,
      words: puzzleWords,
      // Ada "sample" legacy; client bu alanı okuyor. Faz 2'de adı sadeleştirebiliriz.
      sampleLayout: layout,
    };

    return json(puzzle, 200);
  } catch (err) {
    if (err instanceof HttpError) return json({ error: err.message }, err.status);
    if (err instanceof LayoutError) return json({ error: err.message }, 422);
    console.error("generate-puzzle beklenmeyen hata:", err);
    return json({ error: "Bulmaca üretilemedi." }, 500);
  }
});
