const listenEventTypeList = ['click'] as const
type eventListenerType = {
  id: string
  callback: () => void
}
const MyReact = (function () {
  let hooks: any[] = []
  let currentHookIndex = 0
  let root: HTMLElement | null = null
  let rootComponent: () => string | null = null
  let queue = []
  let eventListeners: Record<string, eventListenerType[]> = { click: [] }
  let currentEventIndex = 0
  const render = () => {
    if (root && rootComponent) {
      currentHookIndex = 0
      eventListeners = {}
      initEventListener()
      root.innerHTML = rootComponent()
    }
  }
  const needUpdate = () => {
    queue.push(1)
  }
  const initEventListener = () => {
    currentEventIndex = 0

    eventListeners = {}
    listenEventTypeList.forEach((eventType) => (eventListeners[eventType] = []))
  }
  const addEventListener = () => {
    listenEventTypeList.forEach((eventType) =>
      root.addEventListener(eventType, (e) => {
        eventListeners[eventType].forEach(({ id, callback }) => {
          if ((e.target as HTMLElement).id === id) {
            callback()
          }
        })
      })
    )
  }
  const excuteCallback = (callback: () => void) => {
    setTimeout(() => {
      callback()
    }, 0)
  }
  return {
    init(element: HTMLElement, functionComponent: () => string) {
      root = element
      rootComponent = functionComponent
      hooks = []
      render()
      addEventListener()
      setInterval(() => {
        if (queue.length !== 0) {
          render()
          queue = []
        }
      }, 1000 / 60)
    },
    render,
    addEventListener(eventName: string, callback: () => void) {
      currentEventIndex += 1
      const eventId = 'event-id-' + currentEventIndex
      eventListeners[eventName].push({ id: eventId, callback })
      return `id="${eventId}"`
    },
    useEffect(callback: () => void, currrentValues?: any[]) {
      const preValues = hooks[currentHookIndex]
      if (preValues === undefined) {
        hooks[currentHookIndex] = currrentValues
        currentHookIndex += 1
        return excuteCallback(callback)
      }
      const isChangedValues = !currrentValues.every((curValue, i) => curValue === preValues[i])
      if (isChangedValues) {
        excuteCallback(callback)
        hooks[currentHookIndex] = currrentValues
      }
      currentHookIndex += 1
    },
    useState(initialValue: any) {
      hooks[currentHookIndex] = hooks[currentHookIndex] || initialValue
      const setStateHookIndex = currentHookIndex
      const setState = (newValue: any) => {
        hooks[setStateHookIndex] = newValue
        needUpdate()
      }
      currentHookIndex += 1
      return [hooks[setStateHookIndex], setState]
    },
    useMemo(callback: () => void, currrentValues?: any[]) {
      const preValues = hooks[currentHookIndex]

      if (preValues === undefined) {
        hooks[currentHookIndex] = currrentValues
        hooks[currentHookIndex + 1] = callback()
        const res = hooks[currentHookIndex + 1]

        currentHookIndex += 2
        return res
      }
      const isChangedValues = !currrentValues.every((curValue, i) => curValue === preValues[i])
      if (isChangedValues) {
        hooks[currentHookIndex] = currrentValues
        hooks[currentHookIndex + 1] = callback()
        const res = hooks[currentHookIndex + 1]
        currentHookIndex += 2
        return res
      }
      const res = hooks[currentHookIndex + 1]
      currentHookIndex += 2
      return res
    },
  }
})()

export default MyReact
