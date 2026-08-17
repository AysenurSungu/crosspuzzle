// ============================================================================
// PROMT1 — prompt.ts'in ÇOK KELİMELİ terim DENEME varyantı.
// prompt.ts kaynağa sadık kalır (tek kelime); burada Latince/tıp gibi yerleşik
// çok kelimeli terimlere (ör. "VENA CAVA") izin veren deneysel prompt tutulur.
// Test için index.ts bu dosyadan import eder; kararlı sürüm prompt.ts'tir.
//
// TASARIM MANTIĞI:
// 1) FORMAT'I PROMPT'TA DİLENMİYORUZ — çıktının şeklini WORDS_TOOL (tool schema)
//    zorluyor (index.ts'te tool_choice ile). Prompt tamamen KALİTEYE odaklı.
// 2) KURALLAR net + OLUMLU (Sonnet 5 talimatı birebir uygular; agresif dil ters teper).
// 3) ZEMİN (grounding): "kaynakta geçeni kullan, uydurma" → halüsinasyonu kırar.
// 4) DİL: cevap+ipucu KAYNAK BELGE ile aynı dilde (İngilizce PDF → İngilizce,
//    Türkçe PDF → Türkçe). Modele belgenin dilini algılatıp `language` alanına
//    yazdırıyoruz; index.ts bunu Puzzle.language olarak kullanıyor.
// 5) FEW-SHOT: iki dilde birer örnek → "dili kaynaktan al" mesajını pekiştirir.
//
// İyileştirme döngüsü: gerçek PDF'te çalıştır → çıktıya bak → zayıf noktaya
// tek kural ekle → tekrar dene.
// ============================================================================

/** Tool şeması — çıktının şeklini GARANTİ eder (index.ts tool_choice ile zorlar). */
export const WORDS_TOOL = {
  name: "emit_crossword_words",
  description: "Üretilen çapraz bulmaca kelime ve ipuçlarını yapılandırılmış döndürür.",
  input_schema: {
    type: "object",
    properties: {
      language: {
        type: "string",
        description: 'Üretim dili — KAYNAĞIN diliyle aynı ISO kodu (ör. "tr", "en").',
      },
      words: {
        type: "array",
        description: "Kelime–ipucu çiftleri listesi.",
        items: {
          type: "object",
          properties: {
            answer: {
              type: "string",
              description:
                "Cevap terimi, BÜYÜK harf, yalnızca harf. TERCİHEN tek kelime; " +
                "kaynakta geçen yerleşik ÇOK KELİMELİ terimler (özellikle Latince/tıp, " +
                'ör. "VENA CAVA") en fazla 3 sözcük olabilir, sözcükleri tek boşlukla ayır. ' +
                "Kaynağın dilinde.",
            },
            clue: {
              type: "string",
              description: "Cevabı ele vermeyen, kısa ve net tanım (tek cümle). Kaynağın dilinde.",
            },
          },
          required: ["answer", "clue"],
          additionalProperties: false,
        },
      },
    },
    required: ["language", "words"],
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
  "1. Cevap TERCİHEN tek kelime olsun (harf harf ızgaraya girer, çözmesi kolaydır).",
  "   ANCAK kaynakta geçen yerleşik çok kelimeli terimler — özellikle Latince/tıp",
  '   (ör. "vena cava", "arteria coronaria", "musculus biceps") — 2 (en çok 3) sözcük',
  "   olabilir. Sözcükleri normal boşlukla ayır; ızgarada birleştirmeyi sistem yapar.",
  "   Uydurma bileşik kelime kurma; yalnızca kaynaktaki gerçek terimi yaz.",
  "2. Cevabın her sözcüğü BÜYÜK harf ve yalnızca harf içersin (rakam/sembol/tire yok).",
  "3. DİL: cevaplar ve ipuçları, KAYNAK BELGE hangi dildeyse O dilde olsun",
  "   (İngilizce belge → İngilizce; Türkçe belge → Türkçe). Belgenin dilini algıla",
  '   ve `language` alanına o dilin kodunu yaz (ör. "tr", "en").',
  "4. Cevap, kaynak metinde geçen gerçek bir terim/kavram olmalı. UYDURMA.",
  "5. İpucu cevabı VEYA kökünü İÇERMESİN, ele vermesin; tanım/betimleme biçiminde olsun.",
  "6. İpuçları kısa, net ve tek cümle olsun.",
  "7. Aynı cevabı iki kez üretme.",
  "8. Kelime uzunluğu çeşitli olsun (kısa + uzun karışık, tercihen 3–10 harf);",
  "   bu kesişimleri kolaylaştırır.",
  "",
  "ZORLUK",
  "- kolay: yaygın, kısa terimler; ipucu doğrudan.",
  "- orta:  konuya özgü terimler; ipucu biraz dolaylı.",
  "- zor:   daha az bilinen ayrıntılar; ipucu dolaylı.",
  "",
  "ÖRNEK (yalnızca BİÇİM için — DİLİ kaynaktan al):",
  '- (Türkçe kaynak)    answer: "SİSTOL",   clue: "Kalp kasının kasılma evresi"',
  '- (İngilizce kaynak) answer: "SYSTOLE",  clue: "The contraction phase of the heart muscle"',
  '- (Çok kelimeli)     answer: "VENA CAVA", clue: "Kirli kanı sağ kulakçığa taşıyan büyük toplardamar"',
].join("\n");

/** İsteğe özgü kullanıcı talimatı (konu, zorluk, adet). Dil kaynaktan alınır. */
export function buildUserInstruction(opts: {
  topic: string;
  difficulty: string;
  requestCount: number;
}): string {
  const topicLine = opts.topic.length > 0 ? opts.topic : "PDF'in genel içeriği";
  return [
    `Konu/kapsam: ${topicLine}.`,
    `Zorluk: ${opts.difficulty}.`,
    `Bu PDF'ten çapraz bulmacaya uygun ${opts.requestCount} adet kelime–ipucu çifti üret.`,
    "Cevap ve ipuçlarını KAYNAĞIN DİLİNDE yaz ve `language` alanına o dili belirt.",
    "Bazı kelimeler ızgaraya sığmayabileceği için hedeften biraz fazla üretmen iyi olur.",
  ].join("\n");
}
