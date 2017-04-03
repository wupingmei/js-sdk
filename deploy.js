/* @dependencies */
import pkg from './package.json';
import { execSync, spawn } from 'child_process';


/**
 *	@const array argv
 */
const argv = process.argv.slice(2);

/**
 *	@const array VERSION_DEPLOY_TARGETS
 */
const VERSION_DEPLOY_TARGETS = [ 'major', 'minor', 'patch' ];

/**
 *	@const string VERSION_DEPLOY_TARGET
 */
const VERSION_DEPLOY_TARGET = argv[0];

/**
 *	@const string VERSION_DEPLOY_CURRENT
 */
const VERSION_DEPLOY_CURRENT = pkg.version;

/**
 *	@const array DEPLOYABLE_BRANCHES
 */
const DEPLOYABLE_BRANCHES = [ 'master', 'deploy' ];

/**
 *	@const bool VERBOSE
 */
const VERBOSE = (() => ( argv[1] && argv[1] === '--verbose' ))();

/**
 *	Validates whether deploy target is valid.
 *
 *	@return bool
 */
function validDeployTarget() {
	return VERSION_DEPLOY_TARGETS.includes(VERSION_DEPLOY_TARGET);
}

/**
 *	Increments current release number by one, either patch, minor or major depending on {@see VERSION_DEPLOY_TARGET}.
 *
 *	@return string
 */
function incrementReleaseVersion() {
	let version = VERSION_DEPLOY_CURRENT.split('.');
	version = version.map( v => parseInt(v) )

	let [ major, minor, patch ] = version;

	if ( VERSION_DEPLOY_TARGET === 'major' ) {
		major += 1;
		minor = 0;
		patch = 0;
	} else if ( VERSION_DEPLOY_TARGET === 'minor' ) {
		minor += 1;
		patch = 0;
	} else if ( VERSION_DEPLOY_TARGET === 'patch' ) {
		patch += 1;
	}

	return [ major, minor, patch ].join('.');
}

/**
 *	@const string VERSION_DEPLOY_RELEASE
 */
const VERSION_DEPLOY_RELEASE = incrementReleaseVersion();

/**
 *	@const string prepareMessage
 */
const prepareMessage = `Prepare version ${VERSION_DEPLOY_RELEASE}`

/**
 *	@const string releaseMessage
 */
const releaseMessage = `Version ${VERSION_DEPLOY_RELEASE}`

/**
 *	@const string deployScript
 */
const deployScript = [
	'yarn run test',
	'yarn run compile',
	'touch ./dist/BUILD',
	`echo "${(new Date()).toISOString()}" >> ./dist/BUILD`,
	`git add .`,
	`git commit -m "${prepareMessage}"`,
	`npm version ${VERSION_DEPLOY_TARGET} --force -m "${releaseMessage}"`
].join(' && ');

/**
 *	Validates if current branch is deployable.
 *
 *	@throws Error
 *
 *	@return void
 */
function validateBranchName() {
	const branchName = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();

	if ( DEPLOYABLE_BRANCHES.includes(branchName) === false ) {
		throw new Error(`Cannot deploy from "${branchName}", must be in any of: ${DEPLOYABLE_BRANCHES.join(', ')}.`)
	}
}

/**
 *	@NOTE Make sure "preversion" is set to linting and testing.
 *	@NOTE Make sure "postversion" is set to "git push && git push --tags && npm publish"
 */
try {
	validateBranchName();

	const shell = true;
	const deploy = spawn(deployScript, { shell })

	deploy.on('close', (exitCode) => {
		if (exitCode === 0) {
			console.log(`Successfully deployed version ${VERSION_DEPLOY_RELEASE}!`);
		} else {
			console.log(`Deploy script exited with error code: ${exitCode}`);
		}
	});

	if ( VERBOSE ) {
		deploy.stdout.on('data', (data) => {
			console.log(`${data}`);
		});

		deploy.stderr.on('data', (data) => {
			console.log(`${data}`);
		});
	}

} catch (error) {
	console.log(error.toString());
}