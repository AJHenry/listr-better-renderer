import chalk from 'chalk';
import cliTruncate from 'cli-truncate';
import figures from 'figures';
import indentString from 'indent-string';
import logUpdate from 'log-update';
import stripAnsi from 'strip-ansi';
import { getSymbol, getTiming, isDefined } from './lib/utils';

export interface BetterRendererOptions {
	showSubtasks: boolean;
	collapse: boolean;
	clearOutput: boolean;
	showTiming: boolean;
	showNextTasks: boolean;
	showMultiline: boolean;
}

export interface BetterRender {}

const defaultOptions: BetterRendererOptions = {
	showSubtasks: true,
	collapse: true,
	clearOutput: false,
	showTiming: false,
	showNextTasks: true,
	showMultiline: false,
};

let savedOutputMap: {
	[id: number]: string[];
} = {};
let stateChanged = true;

const renderHelper = (
	tasks: any,
	options: BetterRendererOptions,
	level: number = 0,
	outputCapture: string[] = [],
) => {
	let output: string[] = [];

	for (let task of tasks) {
		if (!options.showNextTasks && task.state === 'unknown') continue;

		const disabled = !task.isEnabled() ? ` ${chalk.dim('[disabled]')}` : '';
		const skipped = task.isSkipped() ? ` ${chalk.dim('[skipped]')}` : '';

		if (!task.id) {
			// Could this get problematic??? Probably
			task.id = Math.ceil(Math.random() * 1000000000);
		}

		// const out = indentString(
		// 	` ${getSymbol(task, options)} ${task.title}${disabled}${skipped}${disabled}`,
		// 	level,
		// 	'  ',
		// );
		// output.push(cliTruncate(out, process.stdout.columns));

		if (task.isEnabled()) {
			const timing =
				options.showTiming && !task.isSkipped()
					? ` ${chalk.gray(getTiming(task))}`
					: '';

			output.push(
				indentString(
					` ${getSymbol(task, options)} ${
						task.title
					}${skipped}${disabled}${timing}`,
					level,
					'  ',
				),
			);

			if (
				(!options.collapse ||
					task.isPending() ||
					task.isSkipped() ||
					task.hasFailed()) &&
				isDefined(task.output)
			) {
				let data = task.output;

				if (typeof data === 'string') {
					data = stripAnsi(
						data
							.trim()
							.split('\n')
							.filter(Boolean)
							.pop(),
					);

					if (data === '') {
						data = undefined;
					}
				}

				if (isDefined(data)) {
					const out = indentString(
						`${figures.arrowRight} ${data} `,
						level,
						'  ',
					);

					let savedOutput = savedOutputMap[task.id] ?? [];
					if (options.showMultiline) {
						if (savedOutput.length === 0) savedOutput = [...savedOutput, out];
						if (
							savedOutput.length > 0 &&
							out !== savedOutput[savedOutput.length - 1]
						)
							savedOutput = [...savedOutput, out];
						savedOutputMap[task.id] = savedOutput;
					} else {
						savedOutput = [out];
					}

					savedOutput.forEach(no => {
						output.push(
							`   ${chalk.gray(cliTruncate(no, process.stdout.columns - 3))} `,
						);
					});
				}
			}

			if (
				(task.isPending() || task.hasFailed() || options.collapse === false) &&
				(task.hasFailed() || options.showSubtasks !== false) &&
				task.subtasks.length > 0
			) {
				output = output.concat(
					renderHelper(task.subtasks, options, level + 1, outputCapture),
				);
			}
		}
	}

	return output.join('\n');
};

const render = (tasks: any, options: BetterRendererOptions) => {
	logUpdate(renderHelper(tasks, options));
};

const trackTaskTiming = (tasks: any, options: BetterRendererOptions) => {
	if (!options.showTiming) {
		return;
	}

	for (const task of tasks) {
		task.subscribe(event => {
			if (event.type === 'SUBTASKS') {
				trackTaskTiming(task.subtasks, options);
			} else if (event.type === 'STATE') {
				if (task.isPending()) {
					task._startTime = Date.now();
				} else if (task.isCompleted() || task.hasFailed()) {
					task._duration = getTiming(task);
				}
			}
		});
	}
};

class UpdateRenderer<BetterRender> {
	private _tasks: any;
	private _options: any;
	private _id: any;

	constructor(tasks: any, options: BetterRendererOptions) {
		this._tasks = tasks;
		this._options = {
			...defaultOptions,
			...options,
		};
	}

	render() {
		if (this._id) {
			// Do not render if we are already rendering
			return;
		}

		trackTaskTiming(this._tasks, this._options);

		this._id = setInterval(() => {
			render(this._tasks, this._options);
		}, 100);
	}

	end(err: Error) {
		if (this._id) {
			clearInterval(this._id);
			this._id = undefined;
		}

		render(this._tasks, this._options);

		if (this._options.clearOutput && err === undefined) {
			logUpdate.clear();
		} else {
			logUpdate.done();
		}
	}
}

export default UpdateRenderer;
