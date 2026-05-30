const OPTIMIZED_DIR = '/uploads/optimized';

const IMAGE_BY_UNSPLASH_ID: Record<string, string> = {
  'photo-1507525428034-b723cf961d3e': 'beach-shore',
  'photo-1596040033229-a9821ebd058d': 'mangrove-sanctuary',
  'photo-1631049307264-da0ec9d70304': 'seaside-room',
  'photo-1544551763-46a013bb70d5': 'reef-water',
  'photo-1542744173-8e7e53415bb0': 'corporate-retreat',
  'photo-1554068865-24cecd4e34b8': 'pickleball-courts',
  'photo-1519741497674-611481863552': 'wedding-sea',
  'photo-1511578314322-379afb476865': 'event-hall',
  'photo-1520250497591-112f2f40a3f4': 'grand-room',
  'photo-1530053969600-caed2596d242': 'water-sports',
  'photo-1540541338287-41700207dee6': 'family-room',
  'photo-1578645510447-e20b4311e3ce': 'group-suite',
  'photo-1615880484746-a134be9a6ecf': 'extended-room',
  'photo-1497366811353-6870744d04b2': 'meeting-room',
  'photo-1439130490301-25e322d88054': 'coastal-cabana',
  'photo-1506905925346-21bda4d32df4': 'kayak-coast',
  'photo-1555396273-367ea4eb4db5': 'marketplace-area',
  'photo-1559827260-dc66d52bef19': 'jet-ski',
  'photo-1520390138845-fd2d229dd553': 'paddleboard',
  'photo-1612872087720-bb876e2e67d1': 'beach-volleyball',
  'photo-1583212292454-1fe6229603b7': 'reef-snorkel',
  'photo-1555685812-4b943f1cb0eb': 'davao-city',
  'photo-1474540412665-1cdae210ae6b': 'island-aerial',
  'photo-1470229722913-7c0e2dbbafd3': 'mangrove-pavilion',
  'photo-1519225421980-715cb0215aed': 'wedding-setup',
};

export const resortImages = {
  logo: `${OPTIMIZED_DIR}/almeja-logo.webp`,
  messengerLogo: `${OPTIMIZED_DIR}/messenger-logo.webp`,
  beach: `${OPTIMIZED_DIR}/beach-shore.webp`,
  mangrove: `${OPTIMIZED_DIR}/mangrove-sanctuary.webp`,
  seasideRoom: `${OPTIMIZED_DIR}/seaside-room.webp`,
  reefWater: `${OPTIMIZED_DIR}/reef-water.webp`,
  corporateRetreat: `${OPTIMIZED_DIR}/corporate-retreat.webp`,
  pickleball: `${OPTIMIZED_DIR}/pickleball-courts.webp`,
  weddingSea: `${OPTIMIZED_DIR}/wedding-sea.webp`,
  eventHall: `${OPTIMIZED_DIR}/event-hall.webp`,
  grandRoom: `${OPTIMIZED_DIR}/grand-room.webp`,
  waterSports: `${OPTIMIZED_DIR}/water-sports.webp`,
  familyRoom: `${OPTIMIZED_DIR}/family-room.webp`,
  groupSuite: `${OPTIMIZED_DIR}/group-suite.webp`,
  extendedRoom: `${OPTIMIZED_DIR}/extended-room.webp`,
  meetingRoom: `${OPTIMIZED_DIR}/meeting-room.webp`,
  coastalCabana: `${OPTIMIZED_DIR}/coastal-cabana.webp`,
  kayakCoast: `${OPTIMIZED_DIR}/kayak-coast.webp`,
  marketplace: `${OPTIMIZED_DIR}/marketplace-area.webp`,
  jetSki: `${OPTIMIZED_DIR}/jet-ski.webp`,
  paddleboard: `${OPTIMIZED_DIR}/paddleboard.webp`,
  beachVolleyball: `${OPTIMIZED_DIR}/beach-volleyball.webp`,
  reefSnorkel: `${OPTIMIZED_DIR}/reef-snorkel.webp`,
  davaoCity: `${OPTIMIZED_DIR}/davao-city.webp`,
  islandAerial: `${OPTIMIZED_DIR}/island-aerial.webp`,
  mangrovePavilion: `${OPTIMIZED_DIR}/mangrove-pavilion.webp`,
  weddingSetup: `${OPTIMIZED_DIR}/wedding-setup.webp`,
};

export function optimizedImageSrc(src: string): string {
  if (!src) return src;
  if (src.includes('/uploads/Almeja_Logo_Large_PNG.png')) return resortImages.logo;
  if (src.includes('/uploads/Logo_FB_Messenger.jpeg')) return resortImages.messengerLogo;

  const match = src.match(/photo-[a-zA-Z0-9-]+/);
  if (!match) return src;

  const assetName = IMAGE_BY_UNSPLASH_ID[match[0]];
  return assetName ? `${OPTIMIZED_DIR}/${assetName}.webp` : src;
}
