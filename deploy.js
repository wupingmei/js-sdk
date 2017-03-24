import pkg from './package.json';
import { exec } from 'child_process';

const argv = process.argv.slice(2);
const targetVersion = argv[0];

// Increment version number (only used for commit message)
let [ major, minor, patch ] = pkg.version.split('.');
if (targetVersion === 'major') { major = parseInt(major) + 1 }
if (targetVersion === 'minor') { minor = parseInt(minor) + 1 }
if (targetVersion === 'patch') { patch = parseInt(patch) + 1 }

const newVersion = [ major, minor, patch ].join('.');
const message = `Version ${newVersion}`;

if ( ['major', 'minor', 'patch'].includes(targetVersion) ) {
	exec(`npm version ${targetVersion} --force -m ${message}`, (err, stdout, stderr) => {
		if (stdout !== null) {
			console.log(stdout);
		}
		
		if (stderr !== null) {
			console.log(stderr);
		}
		
		if (err !== null) {
			console.log('Deploy failed!');
		}
	});
} else {
	console.log('Invalid version deploy.')
}