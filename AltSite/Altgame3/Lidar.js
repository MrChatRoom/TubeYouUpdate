let battery = 900;

const MAX = 600000;

const positions = new Float32Array(MAX*3);
const colors = new Float32Array(MAX*3);

let count = 0;

let geometry, cloud;

let audio;

init();
initAudio();

function init(){

  geometry = new THREE.BufferGeometry();

  geometry.setAttribute("position", new THREE.BufferAttribute(positions,3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors,3));

  geometry.setDrawRange(0,0);
  geometry.computeBoundingSphere();

  const mat = new THREE.PointsMaterial({
    vertexColors:true,
    size:3,
    sizeAttenuation:false,
    depthWrite:false,
    depthTest:false,
    transparent:true,
    opacity:0.9,
    blending:THREE.AdditiveBlending
  });

  cloud = new THREE.Points(geometry, mat);
  cloud.frustumCulled = false;

  scene.add(cloud);
}

function initAudio(){
  audio = new (window.AudioContext||window.webkitAudioContext)();
}

function sound(type){

  const osc = audio.createOscillator();
  const gain = audio.createGain();

  if(type==="scan") osc.frequency.value = 927;
  if(type==="walk") osc.frequency.value = 115;
  if(type==="recharge") osc.frequency.value = 333;

  gain.gain.value = 0.04;

  osc.connect(gain);
  gain.connect(audio.destination);

  osc.start();
  osc.stop(audio.currentTime+0.09);
}

window.startScan = function(){

  if(battery<=0) return;

  battery--;

  scanLock=true;

  sound("scan");

  let p=0;

  const bar=document.getElementById("scanBar");
  bar.style.opacity=1;

  const wave = setInterval(()=>{

    p+=0.03;

    bar.style.width=(p*200)+"px";

    scan(p);

    if(p>=1){
      clearInterval(wave);
      scanLock=false;
      bar.style.opacity=0;

      sound("recharge");
    }

  },30);
};

function scan(p){

  const rays=420;

  const forward = new THREE.Vector3(0,0,-1)
    .applyAxisAngle(new THREE.Vector3(0,1,0), yaw);

  for(let i=0;i<rays;i++){

    const spread=(i/rays-0.5)*2;
    const vertical=1-p*2;

    const dir=forward.clone();
    dir.x+=spread;
    dir.y+=vertical;

    const ray=new THREE.Raycaster(camera.position,dir.normalize());

    let hit=ray.intersectObjects(walls);

    let point;

    if(hit.length>0){
      point=hit[0].point;
    } else {
      point=camera.position.clone().add(dir.multiplyScalar(12));
    }

    add(point, point.distanceTo(creature.position));
  }

  geometry.setDrawRange(0,count);
}

function add(pos, dist){

  if(count>=MAX) return;

  let i=count*4;

  positions[i]=pos.x;
  positions[i+1]=pos.y;
  positions[i+2]=pos.z;

  if(dist<1.5){
    colors[i]=1;colors[i+1]=0;colors[i+2]=0;
  } else {
    colors[i]=1;colors[i+1]=1;colors[i+2]=1;
  }

  count++;

  geometry.attributes.position.needsUpdate=true;
  geometry.attributes.color.needsUpdate=true;
}