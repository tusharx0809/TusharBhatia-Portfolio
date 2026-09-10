const scene=document.getElementById('scene');
const renderer=new THREE.WebGLRenderer({canvas:scene,antialias:true,alpha:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.setSize(innerWidth,innerHeight);
const camera=new THREE.PerspectiveCamera(60,innerWidth/innerHeight,.1,1000);
camera.position.z=8;
const world=new THREE.Scene();

const starsGeo=new THREE.BufferGeometry(), count=1700, pos=new Float32Array(count*3);
for(let i=0;i<count;i++){pos[i*3]=(Math.random()-.5)*32;pos[i*3+1]=(Math.random()-.5)*22;pos[i*3+2]=(Math.random()-.5)*30;}
starsGeo.setAttribute('position',new THREE.BufferAttribute(pos,3));
const stars=new THREE.Points(starsGeo,new THREE.PointsMaterial({color:0x63eaff,size:.035,transparent:true,opacity:.75}));
world.add(stars);


let mx=0,my=0,targetX=0,targetY=0;
addEventListener('pointermove',e=>{targetX=(e.clientX/innerWidth-.5)*.6;targetY=(e.clientY/innerHeight-.5)*.35});
let scroll=0;
addEventListener('scroll',()=>{scroll=scrollY});

function animate(){
  requestAnimationFrame(animate);
  mx+=(targetX-mx)*.035; my+=(targetY-my)*.035;
  stars.rotation.y+=.00015;
  camera.position.x=mx;
  camera.position.y=-my-scroll*.00008;
  camera.lookAt(mx*.35,-my*.25,-scroll*.0012);
  renderer.render(world,camera);
}
animate();

addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});

const bar=document.querySelector('.progress span');
addEventListener('scroll',()=>{const max=document.documentElement.scrollHeight-innerHeight;bar.style.width=(scrollY/max*100)+'%'});

document.querySelectorAll('.project').forEach(card=>{
  card.addEventListener('pointermove',e=>{
    const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    card.style.transform=`perspective(900px) rotateX(${y*-4}deg) rotateY(${x*4}deg) translateZ(12px)`;
  });
  card.addEventListener('pointerleave',()=>card.style.transform='');
});

const obs=new IntersectionObserver(entries=>{
 entries.forEach(e=>{if(e.isIntersecting){e.target.animate([{opacity:0,transform:'translateY(45px)'},{opacity:1,transform:'translateY(0)'}],{duration:850,fill:'forwards',easing:'cubic-bezier(.2,.8,.2,1)'});obs.unobserve(e.target)}})
},{threshold:.15});
document.querySelectorAll('.content-section,.stack-section,.learning,.contact').forEach(x=>obs.observe(x));
