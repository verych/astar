if (!window['console']) {
    window['console'] = {
        log: function () {}
    };
};

//setup array of scripts and an index to keep track of where we are in the process
var scripts = ['assets', 'appobject', 'start', 'finish', 'soldier', 'soldosapience', 'map', 'info', 'tower', 'menu', 'core'],
    scriptsIndex = 0;

//setup a function that loads a single script
function loadScripts() {

	//make sure the current index is still a part of the array
	if (scriptsIndex < scripts.length) {

		//get the script at the current index
		$.getScript('js/classes/' + scripts[scriptsIndex] + '.js', function () {

			//once the script is loaded, increase the index and attempt to load the next script
			log('Loaded: ' + scripts[scriptsIndex]);
			scriptsIndex++;
			loadScripts();
		});
	}
	else if (scriptsIndex == scripts.length) {
		log('Core creating...');
		window.game = new Core($('.canvasHolder1')[0]);
		window.game.init();
		//window.game.run();
	}
}