//	'use strict';

	var video = document.getElementById('video'),
		vjs,
		imagesWaiting = 0,
		imagesToLoad = {
			weather: 'jpg',
			fish: 'jpg',
			urbandecay: 'jpg',
			curtain: 'jpg',
			colorcube: 'png',
			spiritcube: 'png'
		},
		images = {},
		imageCallbacks = [],
		scriptsLoaded = false,
		imagesLoaded = false;

	function loadImages(callback) {
		var key;

		function loadImage(name) {
			var image = document.createElement('img');
			images[name] = image;
			image.addEventListener('load', function() {
				delete imagesToLoad[name];
				imagesWaiting--;
				while (!imagesWaiting && imageCallbacks.length) {
					(imageCallbacks.shift())();
				}
			});
			image.src = 'images/' + name + '.' + imagesToLoad[name];
			imagesToLoad[name] = false;
		}

		if (callback) {
			imageCallbacks.push(callback);
		}

		for (key in imagesToLoad) {
			if (imagesToLoad[key]) {
				imagesWaiting++;
				loadImage(key);
			}
		}
	}

	function setUpVideo() {
		if (!scriptsLoaded || !imagesLoaded) {
			return;
		}
		var seriously = new Seriously();
		var canvas = document.getElementById('canvas');
		var target = seriously.target(canvas);

		/* effects nodes */

		var chroma = seriously.effect('chroma');
		chroma.weight = 1.32;
		chroma.balance = 0;
		chroma.screen = 'rgb(77, 239, 41)';
		chroma.clipWhite = 0.85;
		chroma.clipBlack = 0.5125;

		chroma.source = video;

		//set up underwater effect
		var water = {
			blend: seriously.effect('blend'),
			ripple: seriously.effect('ripple'),
			blue: seriously.effect('tone')
		};

		water.blend.top = chroma;
		water.blend.bottom = images.weather;

		water.blue.light = 'rgb(240, 240, 255)';
		water.blue.dark = 'rgb(50, 50, 150)';
		water.blue.toned = 0.3;


		water.blue.source = water.blend;
		water.ripple.source = water.blue;
		//todo: blur

		var spirit = {
			blend: seriously.effect('blend'),
			cube: seriously.effect('colorcube')
		};

		spirit.cube.source = video;
		spirit.cube.cube = images.spiritcube;


		//set up night vision effect
		//todo: scope and crosshairs
		var night = {
			blend: seriously.effect('blend'),
			nightvision: seriously.effect('nightvision'),
			vignette: seriously.effect('vignette'),
			scanlines: seriously.effect('scanlines')
		};

		night.blend.top = chroma;
		night.blend.bottom = images.urbandecay;

		night.nightvision.source = night.blend;
		night.nightvision.luminanceThreshold = 0.1;
		night.nightvision.amplification = 1.5;

		night.vignette.source = night.nightvision;
		night.vignette.amount = 2.5;

		night.scanlines.source = night.vignette;
		night.scanlines.intensity = 0.5;
		night.scanlines.lines = 140;
		night.scanlines.size = 0.05;

		var sketch = {
			blend: seriously.effect('blend'),
			white: seriously.effect('color'),
			sketch: seriously.effect('sketch')
		};

		sketch.white.color = 'white';

		sketch.blend.top = chroma;
		sketch.blend.bottom = sketch.white;

		sketch.sketch.source = sketch.blend;

		var invasion = {
			blend: seriously.effect('blend'),
			tv: seriously.effect('tvglitch'),
			blackwhite: seriously.effect('hue-saturation')
		};
		invasion.blend.top = chroma;
		invasion.blend.bottom = images.curtain;
		invasion.blackwhite.source = invasion.blend;
		invasion.tv.source = invasion.blackwhite;

		invasion.blackwhite.saturation = -1;
		invasion.tv.distortion = 0.01;
		invasion.tv.verticalSync = 0;
		invasion.tv.scanlines = 0.22;
		invasion.tv.lineSync = 0.03;
		invasion.tv.frameSharpness = 10.67;
		invasion.tv.frameLimit = 0.3644;
		invasion.tv.bars = 0.15;

		var scenes = [
			{
				id: 'water',
				activate: function(output, inputName) {
					output[inputName || 'source'] = water.ripple;//todo: blur
				},
				blend: water.blend
			},
			{
				id: 'nightvision',
				activate: function(output, inputName) {
					output[inputName || 'source'] = night.scanlines;
					//output[inputName || 'source'] = night.nightvision;
				},
				blend: night.blend
			},
			{
				id: 'spirit',
				activate: function(output, inputName) {
					output[inputName || 'source'] = spirit.cube;
				},
				blend: spirit.blend
			},
			{
				id: 'invasion',
				activate: function(output, inputName) {
					output[inputName || 'source'] = invasion.tv;
				},
				blend: invasion.blend
			},
			/*{
				id: 'sketch',
				activate: function(output, inputName) {
					output[inputName || 'source'] = sketch.sketch;
				}
			},
			*/
			{
				id: 'raw',
				activate: function(output, inputName) {
					output[inputName || 'source'] = video;
				}
			}
		];

		var transition = seriously.effect('split');
		transition.fuzzy = 0.1;
		target.source = transition;

		function animateInterval(callback, time, finished) {
			var start = Date.now();
			function runner() {
				var diff = Date.now() - start;
				if (diff < time) {
					callback(diff);
					setTimeout(runner, 4);
				} else if (finished) {
					finished();
				}
			}
			runner();
		}

		var activeScene = 0;
		function activateScene(index) {
			function setButtons(tf) {
				var i, max, buttons = document.querySelectorAll('#buttons button');
				for (i = 0, max = buttons.length; i < max; i++) {
					buttons.item(i).disabled = tf;
				}
			}

			index = index % scenes.length;
			if (index === activeScene) {
				return;
			}

			var from = scenes[activeScene];
			var to = scenes[index];
			activeScene = index;

			target.source = transition;
			from.activate(transition, 'sourceA');
			to.activate(transition, 'sourceB');
			transition.split = 0;

			setButtons(true);
			animateInterval(function (time) {
				transition.split = time/ 500 + 0.1;
			}, 500, function () {
				to.activate(target);
				setButtons(false);
			});
		}

		//set up buttons and transitions
		(function() {
			var i, max, buttons = document.querySelectorAll('#buttons button');
			for (i = 0, max = buttons.length; i < max; i++) {
				buttons.item(i).addEventListener('click', (function(index) {
					return function() {
						activateScene(index);
					};
				}(i)), false);
			}
		}());

		scenes[0].activate(target);

		seriously.animate(function () {
			//water.blur.radius = Math.abs(Math.sin(Date.now()/1000 + 1 )) * 3 ;
			water.ripple.wave = Math.abs(Math.sin(Date.now()/1000 / 4));

			water.ripple.distortion = Math.abs(Math.sin(Date.now()/1000 / 4.5)) * 2;
			var c = Math.sin(Math.PI * video.currentTime / video.duration);

			night.nightvision.timer = video.currentTime;
			invasion.tv.time = Date.now();
		});
	}


	require.config({
		baseUrl: 'js/',
		paths: {
			'videojs': 'video'
		},
		shim: {
			'videojs': {
				exports: 'VideoJS'
			}
		}
	});

	require([
		'videojs',
		'seriously'
	], function (VideoJS, Seriously) {
		var msg = Seriously.incompatible(),
			id;
		video.innerHTML = '<source src="http://seriouslyjs.com/video/wtf_greenscreen_sm.webm" type="video/webm" /><source src="http://seriouslyjs.com/video/wtf_greenscreen_sm.mp4" type="video/mp4" />';
		video.load();
		vjs = VideoJS.setup('video');
		vjs.width(960);
		vjs.height(540);
		if (msg) {
			if (msg === 'webgl') {
				id = 'error-webgl';
			} else {
				id = 'error-context';
			}
			document.getElementById(id).style.display = 'block';
			document.getElementById('buttons').style.display = 'none';
			document.getElementById('canvas').style.display = 'none';
			video.style.display = 'block';
			video.style.height = '540px';
			return;
		}

	});

	require([
		'seriously',
		'effects/seriously.chroma',
		'effects/seriously.blend',
		'effects/seriously.ripple',
		'effects/seriously.tone',
		'effects/seriously.colorcube',
		'effects/seriously.nightvision',
		'effects/seriously.vignette',
		'effects/seriously.split',
		'effects/seriously.scanlines',
		'effects/seriously.sketch',
		'effects/seriously.color',
		'effects/seriously.tvglitch',
		'effects/seriously.hue-saturation'
	], function (Seriously) {
		scriptsLoaded = true;
		setUpVideo();
	});


	loadImages(function () {
		imagesLoaded = true;
		setUpVideo();
	});

