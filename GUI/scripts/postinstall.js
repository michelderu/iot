var fs = require('fs');
var path = require('path');
var child_process = require('child_process');
var os = require('os');

var spawnedProcesses  = [];

function do_npm_install(folder, installArgs) {
  installArgs = installArgs || [];
  installArgs.unshift('i');
  // npm binary based on OS
  var npmCmd = os.platform().startsWith('win') ? 'npm.cmd' : 'npm';

	console.log('');
	console.log('===================================================================');
	console.log(`Performing "npm install" inside ${folder}`);
	console.log('===================================================================');
	console.log('');

  // install folder
  var child = child_process.spawn(
    npmCmd,
    installArgs,
    { env: process.env, cwd: folder, stdio: 'inherit' }
  );
  // Keep track of the all the processes. We may need to abort the install.
  spawnedProcesses.push(child);
  // Fully abort the install if any process closes with anything other than a code of 0.
  child.on('close', (code, signal) => {
    if (code !== 0) {
      console.log(`"npm install" inside ${folder} process exited with code ${code}, signal ${signal}`);
      spawnedProcesses.forEach(function(child) {
        child.kill('SIGABRT');
      });
    }
  });
  }

function npm_install(folder, installArgs) {
  if ( fs.existsSync(path.join(folder, 'package.json')) ) {
    do_npm_install(folder, installArgs);
  } else {
    var errorMessage = 'Could not run `npm install` in `' + folder +
      '` because there is no `package.json` in this directory.';
    if (path.basename(folder) === 'middle-tier') {
      errorMessage = errorMessage + ' This is likely because you have not initialized the Node middle-tier\'s git submodule in `./middle-tier`. Please run the following commands to initialize the submodule and rerun `npm install`: \n\n    git submodule update --init --recursive\n    npm install\n\n';
    }
    throw new Error(errorMessage);
  }
}

var rootDirectory = process.cwd();
npm_install(path.join(rootDirectory, 'ui'));
npm_install(
  path.join(rootDirectory, 'middle-tier'),
  ['--no-optional', '--no-shrinkwrap']
);
