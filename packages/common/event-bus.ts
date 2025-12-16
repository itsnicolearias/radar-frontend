// Cross-platform lightweight event bus for logout events
type Listener = () => void

const GLOBAL_KEY = "__radar_logout_listeners__"

function getSet(): Set<Listener> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (!(globalThis as any)[GLOBAL_KEY]) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ;(globalThis as any)[GLOBAL_KEY] = new Set<Listener>()
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return (globalThis as any)[GLOBAL_KEY]
}

export function emitLogout() {
  try {
    if (typeof window !== "undefined" && typeof window.dispatchEvent === "function") {
      try {
        const ev = new CustomEvent("radar:logout")
        window.dispatchEvent(ev)
        return
      } catch (e) {
        // fallback to global listener set
      }
    }

    const set = getSet()
    set.forEach((cb) => {
      try {
        cb()
      } catch (e) {
        // ignore
      }
    })
  } catch (e) {
    // ignore
  }
}

export function onLogout(cb: Listener) {
  if (typeof window !== "undefined" && typeof window.addEventListener === "function") {
    window.addEventListener("radar:logout", cb)
    return () => window.removeEventListener("radar:logout", cb)
  }

  const set = getSet()
  set.add(cb)
  return () => set.delete(cb)
}

export function offLogout(cb: Listener) {
  if (typeof window !== "undefined" && typeof window.removeEventListener === "function") {
    window.removeEventListener("radar:logout", cb)
    return
  }
  const set = getSet()
  set.delete(cb)
}
