# Mobile Standartları — Supabase RLS & Client Güvenlik Modeli

> Supabase sorgusu yazarken veya cevap/skor işine dokunurken okunur.
> Şema referansı: `docs/database-schema.md`

---

## Temel İlke

Client **salt-okuma ağırlıklı**. Yazma işlemlerinin çoğu Edge Function (service role) üzerinden geçer. Bu, Fısıltı standartlarında olmayan CrossPuzzle'a özel en kritik güvenlik katmanıdır.

---

## Client'ta ASLA Yapılmaz

| İşlem | Neden | Doğru yol |
|---|---|---|
| `puzzle_words` başka bulmacadan okuma | Cevap sızıntısı | Edge Function clue servis eder, cevabı client görmez |
| `attempts` skor/süre update | Skor manipülasyonu | Edge Function doğrular ve yazar |
| `profiles.xp / level / role` update | Yetki/ilerleme hilesi | Edge Function |
| Oda koduyla katılım (`rooms` insert/join) | Kod tahmini / rate limit | Edge Function |
| `puzzle.visibility` public'e çekme | Moderasyon atlatma | Edge Function (Faz 6 moderasyon) |

---

## Client'ın Yapabildikleri (RLS ile sabit)

| Tablo | Select | Insert / Update |
|---|---|---|
| `profiles` | public olanlar + kendi | Sadece kendi profili; role/xp/level DEĞİŞTİRİLEMEZ |
| `sources` | Sadece sahibi | Sahibi (all) |
| `puzzles` | public + kendi | Insert yalnız `visibility='private'`; update/delete sahibi |
| `puzzle_words` | **Sadece kendi bulmacanın kelimeleri** | Sadece kendi bulmacası (düzenleme ekranı) |
| `attempts` | Kendi denemeleri | Insert yalnız `status='in_progress'`; **update YOK** |
| `rooms` | Host/üye olduğun oda | — (katılım Edge Function) |
| `room_players` | Aynı odadaki oyuncular | Sadece kendi satırını update |

---

## Çözme Akışı (Kritik Pattern)

Başkasının bulmacasını çözerken client **cevabı hiç görmez**:

```
1. Client → GET puzzle (grid_layout + clue'lar)   [puzzles select: public]
   ⚠️ puzzle_words BU AŞAMADA client'a gitmez
2. Client → POST /functions/v1/attempt-start       [Edge Function]
   ← attempt_id (status=in_progress)
3. Client harf girer → POST /functions/v1/check-cell veya check-word
   ← { correct: boolean }  (cevap değil, sadece sonuç)
4. Bitince → POST /functions/v1/attempt-complete
   ← Edge Function: süre/doğru sayısı doğrular, skor+xp yazar
```

Client sadece `attempts` insert (in_progress) yapar; gerisi Edge Function.

---

## Doğru / Yanlış Örnekler

```typescript
// ✅ Doğru — kendi bulmacanı düzenlerken kelimeleri oku
const { data } = await supabase
  .from("puzzle_words")
  .select("*")
  .eq("puzzle_id", myPuzzleId);   // RLS: author_id = auth.uid()

// ❌ Yasak — çözerken başkasının cevaplarını çekme
const { data } = await supabase
  .from("puzzle_words")
  .select("answer")
  .eq("puzzle_id", someoneElsesPuzzleId);   // RLS zaten boş döner; deneme bile yapma

// ✅ Doğru — cevap kontrolü Edge Function
const { data } = await apiClient.post("/check-word", { attemptId, number, direction, guess });

// ❌ Yasak — skor client'tan
await supabase.from("attempts").update({ duration_ms: 5000 }).eq("id", attemptId);
```

---

## Kurallar

| Kural | Açıklama |
|---|---|
| Cevap client'a gelmez | `puzzle_words.answer` sadece kendi bulmacanda |
| Skor/xp Edge Function'da | Client insert-only, update yok |
| Oda katılımı Edge Function | Rate limit + kod tahmini koruması |
| RLS'e güven ama deneme yapma | Yasak sorguyu hiç yazma (savunma katmanı, tek başına yeterli sayma) |
| Yeni tablo eklerken | RLS `enable` + policy yaz, aksi halde tablo herkese kapalı/açık kalır |
