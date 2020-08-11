> [Listr](https://github.com/SamVerschueren/listr) update renderer

<img src="screenshot.gif" />

## Install

```
$ npm install --save listr-better-renderer
```

## Usage

```js
const BetterRenderer = require('listr-better-renderer');
const Listr = require('listr');

const list = new Listr(
	[
		{
			title: 'foo',
			task: () => Promise.resolve('bar'),
		},
	],
	{
		renderer: BetterRenderer,
		collapse: false,
	},
);

list.run();
```

> Note: This is the default renderer for [Listr](https://github.com/SamVerschueren/listr) and doesn't need to be specified.

## Options

These options should be provided in the [Listr](https://github.com/SamVerschueren/listr) options object.

### showSubtasks

Type: `boolean`<br>
Default: `true`

Set to `false` if you want to disable the rendering of the subtasks. Subtasks will be rendered if an error occurred in one of them.

### collapse

Type: `boolean`<br>
Default: `true`

Set to `false` if you don't want subtasks to be hidden after the main task succeed.

### clearOutput

Type: `boolean`<br>
Default: `false`

Clear the output when all the tasks are executed succesfully.

### showTiming

Type: `boolean`<br>
Default: `false`

Set to `true` if you want tasks to display how long they took (or are taking) to run.

### showMultiline

Type: `boolean`<br>
Default: `false`

Set to `true` if you want the output of streams and other tasks to persist, i.e. all lines of output will be shown instead of 1

## Related

- [listr](https://github.com/SamVerschueren/listr) - Terminal task list
- [listr-verbose-renderer](https://github.com/SamVerschueren/listr-verbose-renderer) - Listr verbose renderer
- [listr-update-renderer](https://github.com/SamVerschueren/listr-update-renderer) - The Original renderer
- [listr-silent-renderer](https://github.com/SamVerschueren/listr-silent-renderer) - Suppress Listr rendering output

## License

MIT © [Andrew Henry](https://github.com/AJHenry)
