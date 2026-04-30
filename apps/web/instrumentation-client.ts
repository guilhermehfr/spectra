export async function register() {
  if (process.env.NODE_ENV !== 'development') return

  if (typeof window !== 'undefined') {
    const { worker } = await import('./src/mocks/browser')
    await worker.start({
      onUnhandledRequest: 'bypass',
    })
    return
  }
}
