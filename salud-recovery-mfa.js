import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.0?bundle";

const sb=createClient(
  "https://tkrugleneazdeqhxxkvr.supabase.co",
  "sb_publishable_1oVup3kgJeyOfHFoZeAfTw_-3TkiPib",
  {auth:{persistSession:true,storage:sessionStorage,autoRefreshToken:true,detectSessionInUrl:false}}
);

const strong=p=>p.length>=12&&/[a-z]/.test(p)&&/[A-Z]/.test(p)&&/\d/.test(p)&&/[^A-Za-z0-9]/.test(p);

function notice(text,type=""){
  const host=document.getElementById("message");
  if(!host)return;
  host.innerHTML="";
  const box=document.createElement("div");
  box.className="notice "+type;
  box.textContent=text;
  host.appendChild(box);
  setTimeout(()=>box.remove(),9000);
}

function ensureMfaUi(){
  const btn=document.getElementById("recoverySaveBtn");
  if(!btn)return null;
  let wrap=document.getElementById("recoveryMfaWrap");
  if(wrap)return wrap;
  wrap=document.createElement("div");
  wrap.id="recoveryMfaWrap";
  wrap.className="hidden";
  const label=document.createElement("label");
  label.textContent="Código de autenticador";
  const input=document.createElement("input");
  input.id="recoveryMfaCode";
  input.inputMode="numeric";
  input.autocomplete="one-time-code";
  input.maxLength=8;
  input.placeholder="6 dígitos";
  const help=document.createElement("p");
  help.className="small muted";
  help.textContent="Por seguridad, confirma el código de tu app autenticadora.";
  wrap.append(label,input,help);
  btn.before(wrap);
  return wrap;
}

async function refreshMfaVisibility(){
  const view=document.getElementById("recoveryView");
  if(!view||view.classList.contains("hidden"))return;
  try{
    const {data}=await sb.auth.mfa.getAuthenticatorAssuranceLevel();
    const needs=data?.currentLevel!=="aal2"&&data?.nextLevel==="aal2";
    ensureMfaUi()?.classList.toggle("hidden",!needs);
  }catch{}
}

async function elevateToAal2(){
  const wrap=ensureMfaUi();
  wrap?.classList.remove("hidden");
  const input=document.getElementById("recoveryMfaCode");
  const code=String(input?.value||"").trim();
  if(!/^\d{6,8}$/.test(code))throw new Error("Ingresa el código de tu app autenticadora.");
  const {data,error}=await sb.auth.mfa.listFactors();
  if(error)throw error;
  const factor=(data?.totp||[]).find(x=>x.status==="verified");
  if(!factor)throw new Error("No encontramos un autenticador MFA activo. Contacta al administrador.");
  const challenge=await sb.auth.mfa.challenge({factorId:factor.id});
  if(challenge.error)throw challenge.error;
  const verify=await sb.auth.mfa.verify({factorId:factor.id,challengeId:challenge.data.id,code});
  if(verify.error)throw new Error("Código de autenticador incorrecto o vencido.");
  await sb.auth.refreshSession();
  const confirmed=await sb.auth.mfa.getAuthenticatorAssuranceLevel();
  if(confirmed.data?.currentLevel!=="aal2")throw new Error("No se pudo confirmar el segundo factor. Inténtalo nuevamente.");
}

async function savePassword(){
  const btn=document.getElementById("recoverySaveBtn");
  const p=document.getElementById("recoveryPass1")?.value||"";
  const c=document.getElementById("recoveryPass2")?.value||"";
  if(p!==c)return notice("Las contraseñas no coinciden.","bad");
  if(!strong(p))return notice("Usa al menos 12 caracteres, mayúscula, minúscula, número y símbolo.","bad");
  btn.disabled=true;
  const old=btn.textContent;
  try{
    btn.textContent="Verificando…";
    const aal=await sb.auth.mfa.getAuthenticatorAssuranceLevel();
    if(aal.error)throw aal.error;
    if(aal.data?.currentLevel!=="aal2"&&aal.data?.nextLevel==="aal2")await elevateToAal2();
    btn.textContent="Guardando…";
    const {error}=await sb.auth.updateUser({password:p});
    if(error)throw error;
    await sb.auth.signOut({scope:"others"});
    notice("Contraseña actualizada correctamente.","ok");
    history.replaceState({},document.title,"/salud.html");
    setTimeout(()=>location.href="/salud.html",1200);
  }catch(e){
    const m=String(e?.message||"No se pudo actualizar la contraseña.");
    notice(m.includes("AAL2")?"Confirma el código de tu app autenticadora para continuar.":m,"bad");
    await refreshMfaVisibility();
  }finally{
    btn.disabled=false;
    btn.textContent=old;
  }
}

function install(){
  const btn=document.getElementById("recoverySaveBtn");
  const view=document.getElementById("recoveryView");
  if(!btn||!view)return;
  ensureMfaUi();
  btn.onclick=e=>{e.preventDefault();savePassword()};
  const obs=new MutationObserver(()=>refreshMfaVisibility());
  obs.observe(view,{attributes:true,attributeFilter:["class"]});
  setTimeout(refreshMfaVisibility,250);
}

if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",install,{once:true});
else install();
