import MyReact from '../'

test('useEffect 의 두번째 prop에 빈배열을 주었을때는 한번만 실행되어야 한다.', () => {
  const root = document.createElement('div')
  const mockFn = jest.fn()
  jest.useFakeTimers()

  const TestComponent = () => {
    const handlers = mockFn
    MyReact.useEffect(handlers, [])
    return `<h1>hello</h1>`
  }
  MyReact.init(root, TestComponent)
  MyReact.render()
  MyReact.render()
  MyReact.render()
  jest.advanceTimersByTime(1000)

  expect(mockFn).toHaveBeenCalledTimes(1)
})

test('useEffect 의 두번째 prop을 주지 않았을때는 매번 실행되어야 한다.', () => {
  const root = document.createElement('div')
  const mockFn = jest.fn()
  const TestComponent = () => {
    const handlers = mockFn
    MyReact.useEffect(handlers)
    return `<h1>hello</h1>`
  }
  MyReact.init(root, TestComponent)
  MyReact.render()
  MyReact.render()
  MyReact.render()
  jest.advanceTimersByTime(1000)

  expect(mockFn).toHaveBeenCalledTimes(4)
})

test('useEffect 의 두번째 prop 의 값이 달라질때만 실행 되어야 한다.', () => {
  const root = document.createElement('div')
  const mockFn = jest.fn()
  let a = 1
  const TestComponent = () => {
    const handlers = mockFn
    MyReact.useEffect(handlers, [a])
    return `<h1>hello</h1>`
  }
  // 첫번쨰 실행
  MyReact.init(root, TestComponent)
  MyReact.render()
  a = 2
  // 두번째 실행
  MyReact.render()
  MyReact.render()
  jest.advanceTimersByTime(1000)

  expect(mockFn).toHaveBeenCalledTimes(2)
})
