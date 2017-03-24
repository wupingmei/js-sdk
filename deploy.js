/* @dependencies */
import pkg from './package.json';
import { exec, spawn } from 'child_process';

/**
 *	@const array argv
 */
const argv = process.argv.slice(2);

/**
 *	@const deployVersion string
 */
const deployVersion = argv[0];

/**
 *	@const deployVersions array
 */
const deployVersions = [ 'major', 'minor', 'patch' ];

/**
 *	@const string version
 */
const version = (() => {
	let [ major, minor, patch ] = pkg.version.split('.');
	if (deployVersion === 'major') { major = parseInt(major) + 1 }
	if (deployVersion === 'minor') { minor = parseInt(minor) + 1 }
	if (deployVersion === 'patch') { patch = parseInt(patch) + 1 }
	return [ major, minor, patch ].join('.');
})();

/**
 *	@const string message
 */
const message = `Version ${version}.`;

/**
 *	@const string deployCommand
 */
const deployCommand = [
	'yarn run compile',
	'git add .',
	`git commit -m "Prepare version ${version}."`,
	`npm version ${deployVersion} --force -m ${message}`
].join(' && ');

console.log(deployCommand);

/**
 *	@const process deploy
 */
const deploy = spawn(deployCommand, { shell : true });

deploy.stdout.on('data', (data) => {
	console.log(`${data}`);
});

deploy.stderr.on('data', (data) => {
	console.log(`${data}`);
});

deploy.on('close', (code) => {
	console.log(`Deploy script exited with code: ${code}`);
});
