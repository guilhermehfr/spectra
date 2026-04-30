export async function register() {
  if (process.env.NODE_ENV !== "development") {
    return
  }

  if (typeof window !== "undefined") {
    const { worker } = await import("./mocks/browser")
    await worker.start({
      onUnhandledRequest: "bypass",
    })
    return
  }

  const { server } = await import("./mocks/server")
  server.listen({
    onUnhandledRequest: "bypass",
  })
}
