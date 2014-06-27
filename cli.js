#!/usr/bin/env node

var fs   = require('fs'),
    path = require('path'),
    mkdirp = require('mkdirp'),
    takesCb = require('takes-callback'),
    exec = require('child_process').exec;

var $home = process.env.HOME;
var npmInstallPath = path.join($home, '.clicli');

if (!$home) {
  throw new Error('looks like $HOME isn\'t defined');
}

var args = process.argv.slice(2).map(tryToParse);
var moduleName = args.shift();
var modulePath = path.join(npmInstallPath, 'node_modules', moduleName);


fs.exists(modulePath, function (result) {
  if (result) {
    run();
  } else {
    makeNpmInstallPath(function (err, res) {
      installModule(function (err, res) {
        run();
      });
    });
  }
});

function run () {
  var mainFn = require(getMain());
  if (takesCb(mainFn)) {
    runAsync(mainFn);
  } else {
    console.log(mainFn.apply(null, args));
  }
}

function runAsync (fn) {
  args.push(function (err, res) {
    if (err) {
      console.log('Error:');
      console.log(err);
    } else if (res) {
      console.log(res);
    }
  });
  var res = fn.apply(null, args);
}

function makeNpmInstallPath (cb) {
  mkdirp(path.join(npmInstallPath, 'node_modules'), cb);
}

function installModule(cb) {
  exec('npm install ' + moduleName, { cwd: npmInstallPath }, cb);
}

function getMain () {
  return path.join(modulePath, require(path.join(modulePath, 'package.json')).main);
}

function tryToParse(thing) {
  try {
    return JSON.parse(thing);
  }
  catch (e) {
    return thing;
  }
}
