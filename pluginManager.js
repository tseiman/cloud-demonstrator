
const { readdirSync, statSync,readFileSync } = require('fs')
const { join } = require('path')


module.exports = {
	listPlugins: function (filter) {
//		const dirs = p => readdirSync(p).filter(f => statSync(join(p, f)).isDirectory())
	var plugins = [];
	const getDirectories = source =>  readdirSync(source, { withFileTypes: true })
		.filter(dirent => dirent.isDirectory())
    		.map(dirent => dirent.name)

    	getDirectories("./plugin").forEach(function (value, index, array) {
/*    		var base64Icon = "";
    		try {
				let bitmap = readFileSync("./plugin/" + value + "/icon.png");
				base64Icon = new Buffer.from(bitmap).toString('base64');
			} catch (e) {
				console.error(`couldnt open file ${value} because ${e.message}`);		
				base64Icon = "";		
			}
*/
    		try {
				var jsondata = JSON.parse(readFileSync("./plugin/" + value + "/manifest.json"));
				if((typeof jsondata.type !== 'undefined') && (typeof filter !== 'undefined')) {
					if(jsondata.type === filter) {
/*						if(base64Icon !== "") {
							jsondata.icon = base64Icon;
						} */
						jsondata.path=value;
 						plugins.push(jsondata);
					}
				}
			} catch (e) {
				console.error(`couldnt open file ${value} because ${e.message}`);
			}
    	});
		return { "plugins" : plugins };

	}
};
