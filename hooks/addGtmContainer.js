'use strict';

const xcode = require('xcode');
const fs = require('fs-extra');
const path = require('path');

module.exports = function(context) {

    function fromDir(startPath, filter, rec, multiple) {
        if (!fs.existsSync(startPath)) {
            console.log('no dir ', startPath);
            return;
        }

        const files = fs.readdirSync(startPath);
        var resultFiles = []
        for (var i = 0; i < files.length; i++) {
            var filename = path.join(startPath, files[i]);
            var stat = fs.lstatSync(filename);
            if (stat.isDirectory() && rec) {
                fromDir(filename, filter);
            }

            if (filename.indexOf(filter) >= 0) {
                if (multiple) {
                    resultFiles.push(filename);
                } else {
                    return filename;
                }
            }
        }
        if (multiple) {
            return resultFiles;
        }
    }

    var containerLocation;
    var platform;
    var destinationPath;

    if (context.opts.plugin.platform === 'android') {
        platform = 'android';
        destinationPath = '/platforms/' + platform + '/app/src/main/assets/containers';
        if(process.argv.join('|').indexOf('ANDROID_CONTAINER_LOCATION=') > -1) {
            containerLocation = process.argv.join('|').match(/ANDROID_CONTAINER_LOCATION=(.*?)(\||$)/)[1]
        }
    } else if (context.opts.plugin.platform === 'ios') {
        platform = 'ios';
        destinationPath = '/platforms/' + platform + '/container';
        if(process.argv.join('|').indexOf('IOS_CONTAINER_LOCATION=') > -1) {
            containerLocation = process.argv.join('|').match(/IOS_CONTAINER_LOCATION=(.*?)(\||$)/)[1]
        }
    }

    if (!containerLocation) {
        console.log('No container location provided');
        return;
    }

    var source = path.join(containerLocation);

    var destination = path.join(context.opts.projectRoot, destinationPath);

    fs.copySync(source, destination);

    console.log('Successfully copied a container file to ' + destination);

    if (platform === 'ios') {

        var xcodeProjPath = fromDir('platforms/ios','.xcodeproj', false);
        var projectPath = xcodeProjPath + '/project.pbxproj';
        var myProj = xcode.project(projectPath);

        myProj.parseSync();

        var pbxGroupKey = myProj.findPBXGroupKey({ name: 'CustomTemplate' });

        var resourceFile = myProj.addResourceFile(
            destination,
            {},
            pbxGroupKey
        );

        if (resourceFile) {
            fs.writeFileSync(projectPath, myProj.writeSync());

            console.log('Successfully added the container as a resource to ios project');
        }
    }

};
