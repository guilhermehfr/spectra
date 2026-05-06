export async function register() {
  if (process.env.NODE_ENV !== 'development') return
  if (process.env.NEXT_PUBLIC_DISABLE_MSW === 'true') return

  if (typeof window !== 'undefined') {
    const { worker } = await import('./src/mocks/browser')
    await worker.start({
      onUnhandledRequest: 'bypass',
    })
  }
}
