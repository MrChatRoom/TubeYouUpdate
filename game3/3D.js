let scene, camera, renderer;

let move = { f:false, b:false, l:false, r:false };
let yaw = 0;

window.scanLock = false;

let walls = [];
let creature;

let velocity = new THREE.Vector3();

init();
animate();

function init() {

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.01, 2000);
  camera.position.set(0, 2, 5);

  renderer = new THREE.WebGLRenderer({ antialias:true });
  renderer.setSize(innerWidth, innerHeight);
  document.body.appendChild(renderer.domElement);

  buildMaze();
  spawnCreature();

  document.addEventListener("keydown", down);
  document.addEventListener("keyup", up);
  document.addEventListener("mousemove", mouse);
  document.addEventListener("click", () => document.body.requestPointerLock());

  window.addEventListener("resize", resize);
}

function buildMaze() {

  const geo = new THREE.BoxGeometry(2,6,2);
  const mat = new THREE.MeshBasicMaterial({ visible:false });

  const layout = [
    "##########",
    "#   #    #",
    "#   #    #",
    "#        #",
    "###  ### #",
    "#        #",
    "#  ##     ",
    "#     ##  #",
    "#        #",
    "##########"
  ];

  for(let z=0; z<layout.length; z++){
    for(let x=0; x<layout[z].length; x++){

      if(layout[z][x]==="#"){
        const w = new THREE.Mesh(geo, mat);
        w.position.set((x-5)*2,3,(z-5)*2);
        scene.add(w);
        walls.push(w);
      }
    }
  }
}

function spawnCreature(){

  const geo = new THREE.BoxGeometry(1,1,1);
  const mat = new THREE.MeshBasicMaterial({ color:0x000000 });

  creature = new THREE.Mesh(geo, mat);
  creature.position.set(0,1,0);

  scene.add(creature);
}

function moveCreature(){

  const t = Date.now()*0.001;

  creature.position.x += Math.sin(t*0.7)*0.01;
  creature.position.z += Math.cos(t*0.6)*0.01;
}

function mouse(e){
  if(scanLock) return;
  if(document.pointerLockElement !== document.body) return;

  yaw -= e.movementX*0.002;
  camera.rotation.set(0,yaw,0);
}

function down(e){
  if(scanLock) return;

  if(e.code==="KeyW") move.f=true;
  if(e.code==="KeyS") move.b=true;
  if(e.code==="KeyA") move.l=true;
  if(e.code==="KeyD") move.r=true;

  if(e.code==="KeyE") window.startScan();
}

function up(e){
  if(scanLock) return;

  if(e.code==="KeyW") move.f=false;
  if(e.code==="KeyS") move.b=false;
  if(e.code==="KeyA") move.l=false;
  if(e.code==="KeyD") move.r=false;
}

function collide(pos){

  for(let w of walls){
    if(Math.abs(pos.x-w.position.x)<1.2 &&
       Math.abs(pos.z-w.position.z)<1.2){
      return true;
    }
  }

  return false;
}

function animate(){

  requestAnimationFrame(animate);

  moveCreature();

  if(!scanLock){

    velocity.set(0,0,0);

    if(move.f) velocity.z -= 0.08;
    if(move.b) velocity.z += 0.08;
    if(move.l) velocity.x -= 0.08;
    if(move.r) velocity.x += 0.08;

    velocity.applyAxisAngle(new THREE.Vector3(0,1,0), yaw);

    let next = camera.position.clone().add(velocity);

    if(!collide(next)){
      camera.position.copy(next);
    }
  }

  renderer.render(scene,camera);
}

function resize(){
  camera.aspect = innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth,innerHeight);
}