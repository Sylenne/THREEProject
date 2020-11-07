let camera, scene, renderer;

init();
animate();

function init() {

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 20000 );
    camera.position.z = 20;

    scene = new THREE.Scene();
		
		const loader = new THREE.TextureLoader();
		const texture = loader.load( 'sd.JPG' );

    var pixels = 300;
    var pixelSize = 0.27;
    const starsGeometry = new THREE.PlaneBufferGeometry( 20, 20,pixels,pixels);


		var starsMaterial = new THREE.PointsMaterial( { color: 0x888888,size:pixelSize,transparent:true } );

		var starField = new THREE.Points( starsGeometry, starsMaterial );
    starsMaterial.onBeforeCompile = function(shader){
        shader.vertexShader =  shader.vertexShader.replace('void main() {',[
        "varying vec2 globalUV;",
        "void main() {",
        "globalUV = uv;"
        ].join('\n'));

        shader.fragmentShader = shader.fragmentShader.replace("uniform vec3 diffuse;",[
        "varying vec2 globalUV;",
        "uniform sampler2D tDiffuse;",
        "uniform vec3 diffuse;",
        ].join('\n')).replace("gl_FragColor = vec4( outgoingLight, diffuseColor.a );",[
        "vec4 texColor = texture2D( tDiffuse, globalUV );",
        "outgoingLight *= texColor.xyz;",
        "gl_FragColor = vec4( outgoingLight, texColor.a * diffuseColor.a );"
        ].join('\n'));
        
        shader.uniforms.tDiffuse ={value:texture}
    }

    var range = 40;
    for (var i = 0; i < 1500; i++) {
      var particle = new THREE.Vector3(
        Math.random() * range - range / 2,
        Math.random() * range - range * 1.5,
        Math.random() * range - range / 2);

        const particle = new  THREE.Vector3( [
          -1.0, -1.0,  1.0,
           1.0, -1.0,  1.0,
           1.0,  1.0,  1.0,
        
           1.0,  1.0,  1.0,
          -1.0,  1.0,  1.0,
          -1.0, -1.0,  1.0
        ]

        particle.velocityX = (Math.random() - 0.5) / 3;
        particle.velocityY = 0.1 + (Math.random() / 5 );
        starsGeometry.vertices.push (particle);
      
    } 
    scene.add(starField);
    renderer = new THREE.WebGLRenderer( { antialias: true } );
		renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
		
		const controls = new THREE.OrbitControls( camera, renderer.domElement );
		
}

function animate() {

    requestAnimationFrame( animate );
    renderer.render( scene, camera );

}
