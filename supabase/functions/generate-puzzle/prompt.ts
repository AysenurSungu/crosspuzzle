// ============================================================================
// PROMPT — Claude'a "bu PDF'ten çapraz bulmaca kelimeleri üret" dediğimiz yer.
// Bu dosya bilinçli olarak yoğun yorumlu: prompt mühendisliğini öğrenmek için.
//
// TASARIM MANTIĞI (neyi neden yapıyoruz):
//
// 1) FORMAT'I PROMPT'TA DİLENMİYORUZ.
//    Çıktının şeklini `WORDS_TOOL` (tool schema) zorluyor. Model bu aracı
//    çağırmak ZORUNDA (index.ts'te tool_choice ile). Böylece "JSON döndür,
//    şuna dikkat et" gibi format cümleleri gereksiz; prompt tamamen KALİTEYE
//    odaklanıyor. (Structured output'un en büyük faydası bu.)
//
// 2) KURALLARI NET ve OLUMLU yazıyoruz.
//    Sonnet 5 talimatı BİREBİR uygular; "CRITICAL: MUST" gibi agresif dil ters
//    teper. Olumlu, somut örnek > "şunu yapma".
//
// 3) ZEMİN (grounding): "kaynakta geçen terimleri kullan, uydurma" → halüsinasyon
//    ipuçlarını kırar. review ekranı yine de insan denetimi sağlıyor (güvenlik ağı).
//
// 4) FEW-SHOT: 1-2 iyi örnek, biçim ve üslubu ciddi oturtur.
//
// 5) ÇAPRAZ BULMACAYA UYGUNLUK: tek kelime + çeşitli uzunluk → engine'in kesişim
//    bulması kolaylaşır. (Grid'i AI değil, deterministik engine kuruyor.)
//
// İyileştirme döngüsü: gerçek bir PDF'te çalıştır → çıktıya bak → zayıf noktaya
// tek bir kural ekle → tekrar dene. Prompt'u zamanla bu döngüyle sağlamlaştırırız.
// ============================================================================

/** Tool şeması — çıktının şeklini GARANTİ eder (index.ts tool_choice ile zorlar). */
export const WORDS_TOOL = {
  name: "emit_crossword_words",
  description: "Üretilen çapraz bulmaca kelime ve ipuçlarını yapılandırılmış döndürür.",
  input_schema: {
    type: "object",
    properties: {
      words: {
        type: "array",
        description: "Kelime–ipucu çiftleri listesi.",
        items: {
          type: "object",
          properties: {
            answer: {
              type: "string",
              description: "Tek kelime, Türkçe BÜYÜK harf, boşluksuz, yalnızca harf.",
            },
            clue: {
              type: "string",
              description: "Cevabı ele vermeyen, kısa ve net Türkçe tanım (tek cümle).",
            },
          },
          required: ["answer", "clue"],
          additionalProperties: false,
        },
      },
    },
    required: ["words"],
    additionalProperties: false,
  },
} as const;

/** Sabit sistem prompt'u — modelin rolü ve değişmez kuralları. */
export const SYSTEM_PROMPT = [
  "Sen, verilen ders notundan (PDF) TEK KELİMELİK çapraz bulmaca soruları üreten",
  "bir asistansın. Amacın: öğrencinin konuyu pekiştireceği, kaynağa sadık",
  "kelime–ipucu çiftleri üretmek.",
  "",
  "Sonucu SADECE emit_crossword_words aracını çağırarak döndür; başka metin yazma.",
  "",
  "KURALLAR",
  "1. Cevap TEK kelime olmalı: boşluk, tire veya birden çok sözcük YOK",
  "   (harf harf ızgaraya girer).",
  "2. Cevap Türkçe ve BÜYÜK harf; yalnızca harf içersin (rakam/sembol yok).",
  "3. Cevap, kaynak metinde geçen gerçek bir terim/kavram olmalı. UYDURMA.",
  "4. İpucu cevabı VEYA kökünü İÇERMESİN, ele vermesin; tanım/betimleme biçiminde",
  "   olsun (ör. cevap SİSTOL ise ipucu 'Kalp kasının kasılma evresi').",
  "5. İpuçları kısa, net, tek cümle ve Türkçe olsun.",
  "6. Aynı cevabı iki kez üretme.",
  "7. Kelime uzunluğu çeşitli olsun (kısa + uzun karışık, tercihen 3–10 harf);",
  "   bu kesişimleri kolaylaştırır.",
  "",
  "ZORLUK",
  "- kolay: yaygın, kısa terimler; ipucu doğrudan.",
  "- orta:  konuya özgü terimler; ipucu biraz dolaylı.",
  "- zor:   daha az bilinen ayrıntılar; ipucu dolaylı.",
  "",
  "ÖRNEK (yalnızca biçim ve üslup için)",
  '- answer: "SİSTOL",  clue: "Kalp kasının kasılma evresi"',
  '- answer: "MİTRAL",  clue: "Sol atriyum ile sol ventrikül arasındaki kapak"',
].join("\n");

/** İsteğe özgü kullanıcı talimatı (konu, zorluk, adet). */
export function buildUserInstruction(opts: {
  topic: string;
  difficulty: string;
  language: string;
  requestCount: number;
}): string {
  const topicLine = opts.topic.length > 0 ? opts.topic : "PDF'in genel içeriği";
  return [
    `Konu/kapsam: ${topicLine}.`,
    `Zorluk: ${opts.difficulty}. Dil: ${opts.language}.`,
    `Bu PDF'ten çapraz bulmacaya uygun ${opts.requestCount} adet kelime–ipucu çifti üret.`,
    "Bazı kelimeler ızgaraya sığmayabileceği için hedeften biraz fazla üretmen iyi olur.",
  ].join("\n");
}
