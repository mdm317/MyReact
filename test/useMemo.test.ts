import MyReact from '../../core/MyReact'

test('usememo 호출시 한번만 호출되어야 하고 값을 저장해야놔야한다.', () => {
  const root = document.createElement('div')
  jest.useFakeTimers()
  const mockFn = jest.fn()
  mockFn.mockReturnValueOnce(10).mockReturnValue('never')
  const TestComponent = () => {
    const res = MyReact.useMemo(mockFn, [])
    return `<h1>${res}</h1>`
  }
  MyReact.init(root, TestComponent)

  MyReact.render()
  expect(root.innerHTML).toEqual('<h1>10</h1>')
  MyReact.render()
  MyReact.render()
  MyReact.render()
  MyReact.render()
  MyReact.render()
  expect(mockFn).toHaveBeenCalledTimes(1)
  expect(root.innerHTML).toEqual('<h1>10</h1>')
})

test('두번째 인자값이 바뀌었을때는 callback이 실행되어야한다.', () => {
  const root = document.createElement('div')
  jest.useFakeTimers()
  const mockFn = jest.fn()
  mockFn.mockReturnValueOnce(10).mockReturnValueOnce(20).mockReturnValue('never')
  let callback: any
  const TestComponent = () => {
    const [count, setCount] = MyReact.useState(1)
    callback = () => {
      setCount(count + 1)
    }
    const res = MyReact.useMemo(mockFn, [count])
    return `<h1>${res}</h1>`
  }
  MyReact.init(root, TestComponent)

  MyReact.render()
  expect(root.innerHTML).toEqual('<h1>10</h1>')
  callback()
  jest.advanceTimersByTime(1000)
  MyReact.render()
  expect(root.innerHTML).toEqual('<h1>20</h1>')
  MyReact.render()
  MyReact.render()
  expect(mockFn).toHaveBeenCalledTimes(2)
})
