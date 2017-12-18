import fs from 'fs';
import pkg from './package.json';
import vars from './docs/.vars.json';

let templateVariables = Object.assign( vars, {
	version: pkg.version,
	description: pkg.description,
	repositoryUrl: pkg.repository.url
});

function render( templateSource, variables ) {
	return templateSource.replace( /\{\{(.*?)\}\}/g, ( n, match ) => {
		if ( variables[ match ] ) {
			return variables[ match ];
		}
	});
}

function read( templateFilePath, callback ) {
	fs.readFile( templateFilePath, 'utf8', ( error, contents ) => {
		if ( error ) throw error;
		callback( contents );
	});
}

function build( targetPath, sourcePath, logotypePath ) {
	read( logotypePath, svgSource => {
		templateVariables.logotype = svgSource;

		read( sourcePath, data => {
			const generatedData = render( data, templateVariables );
			fs.writeFile( targetPath, generatedData, error => {
				if ( error ) throw error;
				console.log( `Generated template at ${targetPath} from ${sourcePath}.` );
			})
		});
	});
}

build( './docs/index.html', './docs/.index.template', vars.logotypePath );
