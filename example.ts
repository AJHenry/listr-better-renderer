import delay from 'delay'
import Listr from 'listr'
import logSymbols from 'log-symbols'
import Observable from 'zen-observable'
import renderer from '.'

const tasks = new Listr(
  [
    {
      title: 'Git',
      task: () => {
        return new Listr(
          [
            {
              title: 'Checking git status',
              task: () => {
                return new Observable((observer) => {
                  observer.next('foo')

                  delay(2000)
                    .then(() => {
                      observer.next('bar')
                      return delay(2000)
                    })
                    .then(() => {
                      observer.next(0)
                      return delay(500)
                    })
                    .then(() => {
                      observer.next(1)
                      return delay(500)
                    })
                    .then(() => {
                      observer.next({ hello: 'world' })
                      return delay(500)
                    })
                    .then(() => {
                      observer.next('')
                      return delay(500)
                    })
                    .then(() => {
                      observer.complete()
                    })
                })
              },
              enabled: false
            },
            {
              title: 'Checking remote history',
              task: () => delay(2000)
            }
          ],
          { concurrent: true }
        )
      }
    },
    {
      title: 'Install npm dependencies',
      task: () => delay(2000)
    },
    {
      title: 'Run tests',
      task: () =>
        delay(2000).then(() => {
          return new Observable((observer) => {
            observer.next('clinton && xo && ava')

            delay(2000)
              .then(() => {
                observer.next(`${logSymbols.success} 7 passed`)
                return delay(2000)
              })
              .then(() => {
                observer.complete()
              })
          })
        })
    },
    {
      title: 'Publish package',
      task: () =>
        delay(1000).then(() => {
          throw new Error('Package name already exists')
        })
    }
  ],
  {
    renderer,
    showTiming: true
  }
)

const multiLineOutput = new Listr(
  [
    {
      title: 'Git',
      task: () => {
        return new Listr(
          [
            {
              title: 'Checking git status',
              task: () => {
                return new Observable((observer) => {
                  observer.next('foo')

                  delay(2000)
                    .then(() => {
                      observer.next('bar')
                      return delay(2000)
                    })
                    .then(() => {
                      observer.next(0)
                      return delay(500)
                    })
                    .then(() => {
                      observer.next(1)
                      return delay(500)
                    })
                    .then(() => {
                      observer.next({ hello: 'world' })
                      return delay(500)
                    })
                    .then(() => {
                      observer.next('')
                      return delay(500)
                    })
                    .then(() => {
                      observer.complete()
                    })
                })
              }
            },
            {
              title: 'Checking remote history',
              task: () => delay(2000)
            }
          ],
          { concurrent: true, collapse: false }
        )
      }
    },
    {
      title: 'Install npm dependencies',
      task: () => delay(2000)
    },
    {
      title: 'Run tests',
      task: () =>
        delay(2000).then(() => {
          return new Observable((observer) => {
            observer.next('clinton && xo && ava')

            delay(2000)
              .then(() => {
                observer.next(`${logSymbols.success} 7 passed`)
                return delay(2000)
              })
              .then(() => {
                observer.complete()
              })
          })
        })
    },
    {
      title: 'Publish package',
      task: () =>
        delay(1000).then(() => {
          throw new Error('Package name already exists')
        })
    }
  ],
  {
    renderer,
    showMultiline: true
  }
)

const timingTest = () =>
  new Promise((resolve) =>
    tasks.run().catch((error) => {
      console.error(error.message)
      resolve()
    })
  )

const multiLineTest = () =>
  new Promise((resolve) =>
    multiLineOutput.run().catch((error) => {
      console.error(error.message)
      resolve()
    })
  )

const runner = async () => {
  console.log('Running Timing Tasks\n')
  await timingTest()

  console.log('\nRunning Multi-line output')
  await multiLineTest()
}

runner()
