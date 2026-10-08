// Tamaño del frasco en mililitros, que la tienda muestra siempre junto al nombre.

const ML_PATTERN = /\s*(?:\bx\s*)?(\d+(?:[.,]\d+)?)\s*ml\b/i;

// Toma los ml escritos en el nombre ("Sauvage Elixir 100 ml", "Eros X5ML") cuando no se cargan aparte.
export function parseSizeMl(text: string): number | undefined {
  const match = text.match(ML_PATTERN);
  return match ? Number(match[1].replace(",", ".")) : undefined;
}

export const formatMl = (ml: number) => `${ml.toLocaleString("es-AR")} ml`;

// Nombre para la tienda: sin los ml (se muestran aparte) ni el "· Tester" que ya indica la presentación.
export function displayName({ name, sizeMl }: { name: string; sizeMl?: number | null }) {
  let clean = name.replace(/\s*·\s*tester\s*$/i, "");
  if (sizeMl && parseSizeMl(clean) === sizeMl) clean = clean.replace(ML_PATTERN, "");
  return clean.replace(/\s{2,}/g, " ").trim() || name;
}
