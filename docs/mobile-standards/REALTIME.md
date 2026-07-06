# Mobile Standartları — Realtime (Faz 4)

> Çok oyunculu oda senkronu yazarken okunur. v1'de aktif değil — Faz 4.

---

## İlke

Oda senkronu Supabase Realtime ile yapılır. **Truth her zaman server'da** (Postgres). Client salt-okuma; kritik state (skor, tamamlama, kazanan) client'tan yazılmaz — Edge Function doğrular (bkz. SUPABASE-RLS.md).

---

## Kanal Yapısı

```typescript
// features/room/hooks/use-room-channel.ts
const channel = supabase
  .channel(`room:${roomId}`)
  .on("postgres_changes",
    { event: "*", schema: "public", table: "room_players", filter: `room_id=eq.${roomId}` },
    (payload) => { /* oyuncu ready/progress güncelle */ })
  .on("postgres_changes",
    { event: "UPDATE", schema: "public", table: "rooms", filter: `id=eq.${roomId}` },
    (payload) => { /* status: lobby → playing → finished */ })
  .subscribe();
```

---

## Kurallar

| Kural | Açıklama |
|---|---|
| Truth server'da | Client optimistic gösterebilir ama otorite Postgres |
| Skor/kazanan Edge Function | Client yalnız kendi `room_players.progress` update eder |
| Unsubscribe zorunlu | Ekran unmount'ta `channel.unsubscribe()` — leak/çift dinleme |
| Reconnect | Bağlantı koparsa son server state'ten devam (progress jsonb) |
| Rate limit | Progress broadcast'i throttle et (her tuşta değil) |
| Oda katılımı | Realtime değil — Edge Function (kod doğrulama orada) |
