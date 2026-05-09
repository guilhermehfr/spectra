export function extractInitials(name: string): string {
  const words = name
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0)

  if (words.length === 0) return '?'
  if (words.length === 1) return words[0].substring(0, 2).toUpperCase()

  return (words[0][0] + words[words.length - 1][0]).toUpperCase()
}
