export function getUseMock(): boolean {
  return process.env.NEXT_PUBLIC_DISABLE_MSW !== 'true'
}
