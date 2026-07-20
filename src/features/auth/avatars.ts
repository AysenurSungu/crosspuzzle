import type { ImageSourcePropType } from 'react-native';

export interface AvatarOption {
  id: string;
  source: ImageSourcePropType;
}

// Metro requires static `require()` calls, so each avatar in
// assets/avatar/ must be listed here explicitly. Add new avatars by
// dropping the PNG into assets/avatar/ and appending a line below.
export const AVATARS: readonly AvatarOption[] = [
  { id: 'user', source: require('../../../assets/avatar/user.png') },
  { id: 'man', source: require('../../../assets/avatar/man.png') },
  { id: 'woman', source: require('../../../assets/avatar/woman.png') },
  { id: 'businessman', source: require('../../../assets/avatar/businessman.png') },
  { id: 'ceo', source: require('../../../assets/avatar/ceo.png') },
  { id: 'doctor', source: require('../../../assets/avatar/doctor.png') },
  { id: 'woman-1', source: require('../../../assets/avatar/woman-1.png') },
  { id: 'woman-2', source: require('../../../assets/avatar/woman-2.png') },
  { id: 'woman-3', source: require('../../../assets/avatar/woman-3.png') },
  { id: 'woman-4', source: require('../../../assets/avatar/woman-4.png') },
  { id: 'woman-5', source: require('../../../assets/avatar/woman-5.png') },
  { id: 'woman-6', source: require('../../../assets/avatar/woman-6.png') },
  { id: 'woman-7', source: require('../../../assets/avatar/woman-7.png') },
  { id: 'woman-8', source: require('../../../assets/avatar/woman-8.png') },
  { id: 'woman-9', source: require('../../../assets/avatar/woman-9.png') },
  { id: 'woman-10', source: require('../../../assets/avatar/woman-10.png') },
  { id: 'ceo-1', source: require('../../../assets/avatar/ceo.png') },
];

export function findAvatar(id: string | null): AvatarOption | null {
  if (id === null) return null;
  return AVATARS.find((avatar) => avatar.id === id) ?? null;
}
