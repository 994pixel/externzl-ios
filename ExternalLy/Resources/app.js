const $ = (id) => document.getElementById(id);
const API_BASE = ""; // Defina a URL da API quando o backend estiver publicado.
let demoKeys = [];
let sessionLicense = null;

function showToast(message){const t=$("toast");t.textContent=message;t.classList.add("show");clearTimeout(window.__toastTimer);window.__toastTimer=setTimeout(()=>t.classList.remove("show"),2600)}
function maskKey(key){return key.length>9?key.slice(0,5)+"••••••"+key.slice(-4):key}
function randomKey(){const chars="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";const part=()=>Array.from({length:4},()=>chars[Math.floor(Math.random()*chars.length)]).join("");return `FF-${part()}-${part()}-${part()}`}
function formatDate(date){return date?new Intl.DateTimeFormat("pt-BR",{dateStyle:"medium",timeStyle:"short"}).format(new Date(date)):"Permanente"}

$("toggleKey").addEventListener("click",()=>{$("licenseInput").type=$("licenseInput").type==="password"?"text":"password"});
$("licenseInput").type="password";
$("loginForm").addEventListener("submit",async e=>{e.preventDefault();const key=$("licenseInput").value.trim();$("loginMessage").textContent="Validando...";try{
  if(!API_BASE){$("loginMessage").textContent="Backend ainda não conectado. A tela está pronta; configure a API para validar licenças.";return;}
  const response=await fetch(`${API_BASE}/api/auth/validate`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({key})});
  const data=await response.json();if(!response.ok||!data.valid)throw new Error(data.message||"KEY inválida ou expirada.");
  sessionLicense=data.license;enterApp();
}catch(err){$("loginMessage").textContent=err.message||"Falha ao validar a KEY."}});
function enterApp(){ $("loginView").classList.add("hidden");$("appView").classList.remove("hidden");renderLicense();navigate("overview"); }
$("logoutBtn").addEventListener("click",()=>{sessionLicense=null;$("appView").classList.add("hidden");$("loginView").classList.remove("hidden");$("licenseInput").value="";$("loginMessage").textContent="Sessão encerrada."});
function navigate(name){document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));$("page-"+name).classList.add("active");document.querySelectorAll(".nav-item").forEach(n=>n.classList.toggle("active",n.dataset.page===name));const labels={overview:"Visão geral",settings:"Configurações",license:"Minha licença",keys:"Gerenciar KEYS"};$("pageCrumb").textContent=labels[name]}
document.querySelectorAll(".nav-item").forEach(b=>b.addEventListener("click",()=>navigate(b.dataset.page)));
document.querySelectorAll("[data-goto]").forEach(b=>b.addEventListener("click",()=>navigate(b.dataset.goto)));
function renderLicense(){if(!sessionLicense)return;$("overviewLicense").textContent=maskKey(sessionLicense.key||"Licença ativa");$("overviewExpiry").textContent=sessionLicense.expiresAt?formatDate(sessionLicense.expiresAt):"Permanente";$("overviewDevices").textContent=`${sessionLicense.devicesUsed??1} / ${sessionLicense.deviceLimit??1}`;$("licenseKeyText").textContent=maskKey(sessionLicense.key||"");$("licenseExpiry").textContent=sessionLicense.expiresAt?formatDate(sessionLicense.expiresAt):"Permanente";$("licenseLimit").textContent=String(sessionLicense.deviceLimit??1);$("licenseStatus").textContent="ATIVA"}
$("fovRange").addEventListener("input",()=> $("fovValue").textContent=$("fovRange").value+"%");
$("saveSettings").addEventListener("click",()=>{const config={esp:{box:$("espBox").checked,hp:$("espHp").checked,name:$("espName").checked},aim:{fov:+$("fovRange").value,part:$("aimPart").value},notifications:$("notifications").checked};if($("localSave").checked)localStorage.setItem("ff-panel-preferences",JSON.stringify(config));showToast("Preferências salvas neste navegador.")});
try{const saved=JSON.parse(localStorage.getItem("ff-panel-preferences")||"null");if(saved){$("espBox").checked=!!saved.esp?.box;$("espHp").checked=!!saved.esp?.hp;$("espName").checked=!!saved.esp?.name;$("fovRange").value=saved.aim?.fov||80;$("fovValue").textContent=$("fovRange").value+"%";$("aimPart").value=saved.aim?.part||"head";$("notifications").checked=saved.notifications!==false}}catch{}
$("newKeyBtn").addEventListener("click",()=>{$("keyDialog").showModal()});
$("keyDuration").addEventListener("change",()=> $("customDateWrap").classList.toggle("hidden",$("keyDuration").value!=="custom"));
$("keyForm").addEventListener("submit",e=>{if(e.submitter?.id!=="createKey")return;e.preventDefault();const duration=$("keyDuration").value;let expiresAt=null;if(duration==="custom"){if(!$("customDate").value||new Date($("customDate").value)<=new Date()){showToast("Escolha uma data futura.");return}expiresAt=new Date($("customDate").value).toISOString()}else if(duration!=="permanent")expiresAt=new Date(Date.now()+Number(duration)*86400000).toISOString();demoKeys.unshift({key:randomKey(),expiresAt,deviceLimit:Math.max(1,Math.min(10,Number($("deviceLimit").value)||1)),status:"active"});$("keyDialog").close();renderKeys();showToast("KEY de demonstração criada.")});
function renderKeys(){const search=$("keySearch").value.toLowerCase();const filter=$("keyFilter").value;const rows=demoKeys.filter(k=>k.key.toLowerCase().includes(search)&&(filter==="all"||k.status===filter));$("keysTable").innerHTML=rows.length?rows.map((k,i)=>`<tr><td class="mono">${k.key}</td><td>${formatDate(k.expiresAt)}</td><td>${k.deviceLimit}</td><td><span class="status-tag ${k.status==="active"?"status-active":"status-blocked"}">${k.status==="active"?"ATIVA":"BLOQUEADA"}</span></td><td><button class="table-action" data-action="toggle" data-index="${demoKeys.indexOf(k)}">${k.status==="active"?"Bloquear":"Liberar"}</button><button class="table-action" data-action="delete" data-index="${demoKeys.indexOf(k)}">Excluir</button></td></tr>`).join(""):'<tr><td colspan="5" class="empty">Nenhuma KEY encontrada.</td></tr>'}
$("keysTable").addEventListener("click",e=>{const b=e.target.closest("button[data-action]");if(!b)return;const k=demoKeys[Number(b.dataset.index)];if(b.dataset.action==="toggle")k.status=k.status==="active"?"blocked":"active";else demoKeys.splice(Number(b.dataset.index),1);renderKeys()});
$("keySearch").addEventListener("input",renderKeys);$("keyFilter").addEventListener("change",renderKeys);
