import * as DocumentPicker from 'expo-document-picker';

// PDF, Word (docx/doc) and plain-text notes — matches the "PDF, DOCX veya
// notunu yükle" card. The file is NOT read yet; we only keep its name for
// display and drive generation from the bundled sample data.
const ACCEPTED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'text/plain',
];

export interface PickedSource {
  name: string;
}

/** Open the system file picker. Resolves to the picked file, or null if cancelled. */
export async function pickSource(): Promise<PickedSource | null> {
  const result = await DocumentPicker.getDocumentAsync({
    type: ACCEPTED_TYPES,
    copyToCacheDirectory: false,
    multiple: false,
  });

  if (result.canceled) return null;
  const asset = result.assets[0];
  if (!asset) return null;
  return { name: asset.name };
}
