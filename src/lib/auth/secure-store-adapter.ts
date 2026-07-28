import * as SecureStore from 'expo-secure-store';

/**
 * Supabase session token'ı (access + refresh + user) tek bir değerde
 * 2 KB'ı aşabilir; expo-secure-store bazı platformlarda ~2048 byte üstünü
 * reddeder (bkz. SDK 57 SecureStore dokümanı). Bu adaptör değeri sabit
 * boyutlu parçalara böler, her parçayı ayrı bir SecureStore anahtarına yazar
 * ve okurken birleştirir. Böylece token'lar SECURITY.md gereği yalnızca
 * expo-secure-store'da kalır — AsyncStorage'a hiç düşmez.
 */
const CHUNK_SIZE = 1800;
const META_SUFFIX = '.chunks';

// SecureStore anahtarları yalnızca [A-Za-z0-9._-] kabul eder; Supabase'in
// ürettiği "sb-<ref>-auth-token" bu kümeye uyar, eklediğimiz sonekler de.
function chunkKey(key: string, index: number): string {
  return `${key}.${index}`;
}

async function readChunkCount(key: string): Promise<number> {
  const raw = await SecureStore.getItemAsync(`${key}${META_SUFFIX}`);
  if (raw === null) return 0;
  const parsed = Number.parseInt(raw, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

async function clearChunks(key: string): Promise<void> {
  const count = await readChunkCount(key);
  const deletions: Promise<void>[] = [];
  for (let i = 0; i < count; i += 1) {
    deletions.push(SecureStore.deleteItemAsync(chunkKey(key, i)));
  }
  deletions.push(SecureStore.deleteItemAsync(`${key}${META_SUFFIX}`));
  await Promise.all(deletions);
}

export const secureStoreAdapter = {
  async getItem(key: string): Promise<string | null> {
    const count = await readChunkCount(key);
    if (count === 0) return null;

    const parts: string[] = [];
    for (let i = 0; i < count; i += 1) {
      const part = await SecureStore.getItemAsync(chunkKey(key, i));
      // Eksik parça → bozuk kayıt; null dönerek Supabase'i yeniden auth'a zorla.
      if (part === null) return null;
      parts.push(part);
    }
    return parts.join('');
  },

  async setItem(key: string, value: string): Promise<void> {
    // Önce eski parçaları temizle ki eski, daha uzun bir değerden artık kalmasın.
    await clearChunks(key);

    const chunkCount = Math.max(1, Math.ceil(value.length / CHUNK_SIZE));
    const writes: Promise<void>[] = [];
    for (let i = 0; i < chunkCount; i += 1) {
      const slice = value.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
      writes.push(SecureStore.setItemAsync(chunkKey(key, i), slice));
    }
    writes.push(SecureStore.setItemAsync(`${key}${META_SUFFIX}`, String(chunkCount)));
    await Promise.all(writes);
  },

  async removeItem(key: string): Promise<void> {
    await clearChunks(key);
  },
};
