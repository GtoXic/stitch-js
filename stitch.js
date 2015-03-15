var fs = require("fs");
var path = require("path");

if(process.argv.length < 4){
	console.log("Missing parameters. Syntax:");
	console.log("%s <input> <output>",process.argv[0]);
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
	if(/^\/\/include-file (.*)/igm.test(line)){
		var incfile = /^\/\/include-file (.*)/igm.exec(line)[1];
		if(fs.existsSync(path.join(fpath,incfile))){
			try{
				var incfilecont = fs.readFileSync(path.join(fpath,incfile)).toString();
				line = incfilecont;
				console.log("Included %s",incfile);
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