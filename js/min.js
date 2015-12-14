		var container, camera, scene, renderer;
		var screen_W = window.innerWidth;
		var screen_H = window.innerHeight;
		var effect, composer , resolution, numBlobs;
		var light, pointLight, ambientLight;
		var time = 0;
		var clock = new THREE.Clock();

		init();
		setup();
		animate();

		function init() {

			container = document.getElementById( 'container' );

			camera = new THREE.PerspectiveCamera( 45, screen_W / screen_H, 1, 10000 );
			camera.position.z = 1200;

			scene = new THREE.Scene();

			light = new THREE.DirectionalLight( 0xd5d5d5 );
			scene.add( light );

			pointLight = new THREE.PointLight( 0x5f5f5f );
			pointLight.position.set( 0, 0, 100 );
			scene.add( pointLight );

			ambientLight = new THREE.AmbientLight( 0xd5d5d5 );
			scene.add( ambientLight );

			materials = generateMaterials();
			current_material = "clear";
			resolution = 50;

			effect = new THREE.MarchingCubes( resolution, materials[ current_material ].m, true, true );
			effect.position.set( 100, 200, 0);
			effect.scale.set( 500, 500, 500 );
			scene.add( effect );

			renderer = new THREE.WebGLRenderer( { antialias: true } );
			renderer.setClearColor( 0x141414 );
			renderer.setPixelRatio( window.devicePixelRatio );
			renderer.setSize( screen_W, screen_H );

			renderer.gammaInput = true;
			renderer.gammaOutput = true;

			container.appendChild( renderer.domElement );

			controls = new THREE.OrbitControls( camera, renderer.domElement );

			window.addEventListener( 'resize', onWindowResize, false );

		}

		function onWindowResize( event ) {

			screen_W = window.innerWidth;
			screen_H = window.innerHeight;

			camera.aspect = screen_W / screen_H;
			camera.updateProjectionMatrix();
			renderer.setSize( screen_W, screen_H );

		}

		function generateMaterials() {

			var materials = {

				"clear"  :
				{
				m: new THREE.MeshPhongMaterial( { color: 0x5d5d5d, specular: 0xffffff, shininess: 250 } )
				}

			};

			return materials;

		}

		function setup() {

			effectController = { speed: 0.4, numBlobs: 5, resolution: 60, isolation: 60}

		}

		function updateCubes( object, time, numblobs ) {

			object.reset();

			var i, ballx, bally, ballz, subtract, strength;

			subtract = 12;
			strength = 1.2 / ( ( Math.sqrt( numblobs ) - 1 ) / 4 + 1 );

			for ( i = 0; i < numblobs; i ++ ) {

				ballx = Math.sin( i + 1.26 * time * ( 1.03 + 0.5 * Math.cos( 0.21 * i ) ) ) * 0.27 + 0.5;
				bally = Math.abs( Math.cos( i + 1.12 * time * Math.cos( 1.22 + 0.1424 * i ) ) ) * 0.27 + 0.2;
				ballz = Math.cos( i + 1.32 * time * 0.1 * Math.sin( ( 0.92 + 0.53 * i ) ) ) * 0.27 + 0.5;

				object.addBall(ballx, bally, ballz, strength, subtract);

			}

		}

		function animate() {

			requestAnimationFrame( animate );

			render();

		}

		function render() {

			var delta = clock.getDelta();

			time += delta * effectController.speed * 0.3;

			controls.update( delta );

			if ( effectController.resolution !== resolution ) {

				resolution = effectController.resolution;
				effect.init( resolution );

			}

			if ( effectController.isolation !== effect.isolation ) {

				effect.isolation = effectController.isolation;

			}

			updateCubes( effect, time, effectController.numBlobs );

			renderer.render( scene, camera );

		}