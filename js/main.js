import { ref, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { app, analytics, database } from './firebaseConfig.js';
// Variable
const CardList = document.getElementById("list");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const pageinfo = document.getElementById("pageInfo");

const PAGE_SIZE_LIMIT = 10;
let currentPage = 0;
let stories = [];

// Clicks
document.getElementById("MainBtn").addEventListener("click", ()=> {
   window.location.href = "index.html";
});

document.getElementById("chooseBtn").addEventListener("click", ()=> {
   document.querySelector(".choose").style.display = "block";
});

document.getElementById("discord").addEventListener("click", ()=>{

});

 document.getElementById("Facebook").addEventListener("click", ()=>{

 });

 document.getElementById("whatsapp").addEventListener("click", ()=>{

 });

// Firebase Init
async function LoadData(){
   const snapshot = await get(ref(database, "story"));
   if(!snapshot.exists()) return;
   stories = Object.values(snapshot.val());
   //
}

function render(){
   CardList.innerHTML = "";

   const start = (currentPage -1) * PAGE_SIZE_LIMIT;
   const end = start + PAGE_SIZE_LIMIT;

   
}