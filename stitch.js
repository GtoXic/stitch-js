#!/usr/bin/env node
var fs = require("fs");
var path = require("path");

if(process.argv.length < 4){
	console.log("Missing parameters. Syntax:");
	console.log("stitchjs <input> <output>");
	process.exit(1);
}

var file = process.argv[2];
var out = process.argv[3];

var fpath = path.dirname(file);

var output = "";

console.log("Loading %s",file);
var contents = fs.readFileSync(file).toString();

var lines = contents.split("\n");

console.log("Moving through %s",file);
for(line in lines){
	line = lines[line].toString().trim();
	if(/\|#IMPORT_FILE (.*)#\|/igm.test(line)){
		var incfile = /\|#IMPORT_FILE (.*)#\|/igm.exec(line)[1];
		var linenum = -1;
		if(incfile.indexOf(':') !== -1){
			linenum = incfile.split(':')[1];
			incfile = incfile.split(':')[0];
		}
		if(fs.existsSync(path.join(fpath,incfile))){
			try{
				var incfilecont = fs.readFileSync(path.join(fpath,incfile)).toString();
				if(linenum !== -1){
					var lines = incfilecont.split('\n');
					if(lines.length > linenum){
						console.log("Skipping inclusion of %s (line number too high)",incfile);
					}else{
						var l = lines[linenum-1].replace(/(\r|\n|\r\n)/gm,"");
						line = line.replace(/\|#IMPORT_FILE (.*)#\|/igm,l);
						console.log("Included line %s from %s",linenum,incfile);
					}
				}else{
					line = line.replace(/\|#IMPORT_FILE (.*)#\|/igm,incfilecont);
					console.log("Included %s",incfile);
				}
			}catch(e){
				console.log(e);
				console.log("Skipping inclusion of %s (error)",incfile);
			}
		}else{
			console.log("Skipping inclusion of %s (missing)",incfile);
		}
	}
	output += line + "\n";
}

console.log("Complete! Outputting to %s",out);

try{
	fs.writeFileSync(out,output);
}catch(e){
	console.log("Error occured when outputting to %s",out);
}