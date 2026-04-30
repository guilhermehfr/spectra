export async function register() {
  if (
    process.env.NODE_ENV === "development" &&
    typeof window !== "undefined"
  ) {
    const { worker } = await import("./mocks/browser")
    await worker.start({
      onUnhandledRequest: "bypass",
    })
  }
}
