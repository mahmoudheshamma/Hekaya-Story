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

 prevBtn.onclick = ()=> {
   currentPage--;
   render();
 };
 nextBtn.onclick = ()=> {
   currentPage++;
   render();
 }
// Firebase Init
async function LoadData(){
   const snapshot = await get(ref(database, "story"));
   if(!snapshot.exists()) return;
   stories = Object.values(snapshot.val());
   render();
}

function render(){
   CardList.innerHTML = "";

   const start = (currentPage -1) * PAGE_SIZE_LIMIT;
   const end = start + PAGE_SIZE_LIMIT;
   
   stories.slice(start, end).forEach(story =>{
      const card = document.createElement("div");
      card.className = "card";
      
      card.innerHTML = `
        <div class="headerStory">
            <span class="StoryName">${story.name}</span>
            <span class="StoryNumber"></span>
        </div>
        <div class="StoryInfo">
            <span class="StoryType"></span>
            <span class="StoryClass"></span>
        </div>
        <div class="StoryFooter">
            <span class="StoryWriter"></span>
            <span class="StoryRating"></span>
        </div>
      `;
      CardList.appendChild(card);
   });
   pageinfo.textContent = `${currentPage} / ${Math.ceil(stories.length / PAGE_SIZE_LIMIT)}`;
   nextBtn.disabled = end >= stories.length;
   prevBtn.disabled = currentPage === 1;
}

LoadData();