import { ref, get } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";
import { app, analytics, database } from './firebaseConfig.js';
// Variable
const CardList = document.getElementById("list");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const pageinfo = document.getElementById("pageInfo");

const PAGE_SIZE_LIMIT = 5;
let currentPage = 1;
let stories = [];

const Type_Map = {
  rewaya: "رواية",
  sayings: "أقوال",
  story: "قصة",
  joke: "نكتة",
  puzzle: "فازورة"
};

const CLASS_MAP = {
  community: "اجتماعية",
  notreal: "خيال",
  history: "تاريخية",
  drama: "دراما",
  horror: "رعب",
  education: "تعليمية",
  love: "رومانسية",
  religion: "ديني",
  sad: "حزين",
  self: "تطوير ذات",
  comedy: "كوميدي",
  children: "أطفال"
};

// Clicks
document.getElementById("MainBtn").addEventListener("click", ()=> {
   window.location.href = "index.html";
});

document.getElementById("chooseBtn").addEventListener("click", ()=> {
   const choose = document.querySelector(".choose");
choose.style.display =
  getComputedStyle(choose).display === "none" ? "flex" : "none";
});

document.getElementById("discord").addEventListener("click", ()=>{

});

 document.getElementById("Facebook").addEventListener("click", ()=>{

 });

 document.getElementById("whatsapp").addEventListener("click", ()=>{

 });

 prevBtn.onclick = ()=> {
 if (currentPage > 1) {
   currentPage--;
   render();
  }
 };
 nextBtn.onclick = ()=> {
 if (!stories.length) {
  pageinfo.textContent = "لا توجد قصص";
  nextBtn.disabled = true;
}
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

//events
function buildStoryText(story){
    const typeText = Type_Map[story.type] || "";
    
    const classList = [];
    
    for (const key in CLASS_MAP) {
        if (story[key] === "on") {
           classList.push(CLASS_MAP[key]);
        }
    }
    const classText = classList.join(" - ");
    
    return{
        typeText,
        classText
    };
}

function render(){
   CardList.innerHTML = "";

   const start = (currentPage -1) * PAGE_SIZE_LIMIT;
   const end = start + PAGE_SIZE_LIMIT;
   
   stories.slice(start, end).forEach(story =>{
      const card = document.createElement("div");
      card.className = "card";
      
      card.addEventListener("click", () => {
         window.location.href = `story.html?id=${story.id_story}`
      });

      const { typeText, classText } = buildStoryText(story);
      
      card.innerHTML = `
        <div class="story-card">
                
                <div class="headerStory">
                
                <h3 class="story-title">${story.name_story}</h3>
                <span class="story-number">${story.num_story}</span>
            
                </div>
            
                <div class="InfoStory">
                
                <span class="story-Type">${typeText}</span>
                <span class="story-Class">${classText}</span>
                
                </div>
            
                <div class="FooterStory">
                
                <span class="storyWriter">${story.name_create}</span>
                <span class="storyRate">${story.rate}</span>
                
                </div>
                
            </div>
      `;
      CardList.appendChild(card);
   });
   pageinfo.textContent = `${currentPage} / ${Math.ceil(stories.length / PAGE_SIZE_LIMIT)}`;
   nextBtn.disabled = end >= stories.length;
   prevBtn.disabled = currentPage === 1;
}

LoadData();
