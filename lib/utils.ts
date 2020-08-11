import chalk from 'chalk'
import elegantSpinner from 'elegant-spinner'
import figures from 'figures'
import logSymbols from 'log-symbols'
import { BetterRendererOptions } from '../'

const pointer = chalk.yellow(figures.pointer)
const skipped = chalk.yellow(figures.arrowDown)
const disabled = chalk.dim(figures.arrowDown)

export const isDefined = (x: any) => x !== null && x !== undefined

export const getSymbol = (task: any, options: BetterRendererOptions) => {
  if (!task.spinner) {
    task.spinner = elegantSpinner()
  }

  if (task.isPending()) {
    return options.showSubtasks !== false && task.subtasks.length > 0
      ? pointer
      : chalk.yellow(task.spinner())
  }

  if (task.isCompleted()) {
    return logSymbols.success
  }

  if (task.hasFailed()) {
    return task.subtasks.length > 0 ? pointer : logSymbols.error
  }

  if (!task.isEnabled()) {
    return disabled
  }

  if (task.isSkipped()) {
    return skipped
  }

  return ' '
}

export const getTiming = (task: any) => {
  if (task._duration) {
    return task._duration
  }

  if (!task._startTime) {
    return ''
  }

  const duration = Date.now() - task._startTime
  const seconds = parseInt(String((duration / 1000) % 60), 10)
  const minutes = parseInt(String((duration / 60000) % 60), 10)
  const hours = parseInt(String(duration / 3600000), 10)

  const hoursS = hours < 10 ? '0' + hours : hours
  const minutesS = minutes < 10 ? '0' + minutes : minutes
  const secondsS = seconds < 10 ? '0' + seconds : seconds

  return `[${hoursS === '00' ? '' : hoursS + ':'}${minutesS}:${secondsS}]`
}
