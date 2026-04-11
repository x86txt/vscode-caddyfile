import { spawnSync } from 'node:child_process';

const managers = [
	{ name: 'bun', command: 'bun', args: ['install'] },
	{ name: 'pnpm', command: 'pnpm', args: ['install'] },
	{ name: 'yarn', command: 'yarn', args: ['install'] },
];

function hasCommand(command) {
	const result = spawnSync(command, ['--version'], {
		stdio: 'ignore',
		shell: process.platform === 'win32',
	});

	return result.status === 0;
}

for (const manager of managers) {
	if (!hasCommand(manager.command)) {
		continue;
	}

	console.log(`Using ${manager.name} for dependency installation...`);
	const result = spawnSync(manager.command, manager.args, {
		stdio: 'inherit',
		shell: process.platform === 'win32',
	});

	process.exit(result.status ?? 1);
}

console.error('No supported package manager found. Install bun, pnpm, or yarn.');
process.exit(1);
