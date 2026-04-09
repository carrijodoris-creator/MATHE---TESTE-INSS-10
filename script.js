let token=localStorage.getItem("token");

async function login(){
let cpf=document.getElementById("cpf").value;
let senha=document.getElementById("senha").value;

let r=await fetch('/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({cpf,senha})});
let d=await r.json();

if(d.success){
localStorage.setItem("token",d.token);
window.location=d.tipo=="admin"?"admin.html":"app.html";
}else alert("Erro login");
}

async function consultar(){
let r=await fetch('/consulta',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token})});
let d=await r.json();
document.getElementById("resultado").innerHTML=JSON.stringify(d.beneficio);
}

function baixarApp(){
let ua=navigator.userAgent;
if(/android/i.test(ua))location="https://play.google.com/store/apps/details?id=br.gov.inss.mobile";
else location="https://apps.apple.com/br/app/meu-inss/id1446095916";
}

async function criarUsuario(){
let nome=document.getElementById("nome").value;
let cpf=document.getElementById("cpf").value;
let senha=document.getElementById("senha").value;
let email=document.getElementById("email").value;

await fetch('/admin/add',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({nome,cpf,senha,email})});
alert("OK");
}
