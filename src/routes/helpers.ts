type RawCoord = {
  latitude?: any;
  longitude?: any;
  timestamp?: any; 
};

export function normalizeCoords(input: unknown): Array<{ latitude: number; longitude: number; timestamp: Date }> {
  if (!Array.isArray(input)) return [];
  const out: Array<{ latitude: number; longitude: number; timestamp: Date }> = [];

  for (const c of input as RawCoord[]) {
    const lat = Number(c?.latitude);
    const lng = Number(c?.longitude);
    const tsRaw = c?.timestamp;

    if (!Number.isFinite(lat) || !Number.isFinite(lng) || tsRaw == null) continue;

    const ts =
      typeof tsRaw === 'number'
        ? new Date(tsRaw) 
        : typeof tsRaw === 'string'
        ? new Date(tsRaw) 
        : tsRaw instanceof Date
        ? tsRaw
        : null;

    if (!ts || Number.isNaN(+ts)) continue;

    out.push({ latitude: lat, longitude: lng, timestamp: ts });
  }

  return out;
}
