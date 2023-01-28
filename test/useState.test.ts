import MyReact from '../../core/MyReact'

test('setstate 호출시 정상적으로 값이 바뀌어야 한다.', () => {
  const root = document.createElement('div')
  let callback: any
  jest.useFakeTimers()

  const TestComponent = () => {
    const [count, setCount] = MyReact.useState(123)
    const addCount = () => {
      setCount(count + 1)
    }
    callback = addCount
    return `<h1>${count}</h1>`
  }
  MyReact.init(root, TestComponent)
  expect(root.innerHTML).toEqual('<h1>123</h1>')

  callback && callback()
  jest.advanceTimersByTime(1000)
  expect(root.innerHTML).toEqual('<h1>124</h1>')
})
