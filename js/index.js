import { ref, get } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";
import { app, analytics, database } from './firebaseConfig.js';

const CardList = document.getElementById("list");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const pageinfo = document.getElementById("pageInfo");

const orderSelect = document.getElementById("order");
const categorySelect = document.getElementById("category");
const typeSelect = document.getElementById("type");
const searchInput = document.getElementById("search");

const PAGE_SIZE_LIMIT = 5;
let currentPage = 1;
let stories = [];

const TYPE_SYNONYMS = {
  story: ["story", "رواية", "قصة", "rewaya"],
  puzzle: ["puzzle", "فازورة", "fayazer"],
  joke: ["joke", "نكتة", "Comec"],
  sayings: ["sayings", "اقوال", "Talks"]
};

const CLASS_SYNONYMS = {
  comedy: ["comedy", "كوميدي", "كوميدية"],
  history: ["history", "تاريخية"],
  children: ["children", "أطفال", "اطفال"],
  horror: ["horror", "رعب"],
  self: ["self", "تطوير ذات"],
  notreal: ["notreal", "خيال"],
  religion: ["religion", "ديني"],
  sad: ["sad", "حزين"],
  drama: ["drama", "دراما"],
  education: ["education", "تعليمية"],
  community: ["community", "اجتماعية"],
  love: ["love", "رومانسية"]
};

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

// -------------------- INIT --------------------
async function LoadData() {
  const snapshot = await get(ref(database, "story"));
  if (!snapshot.exists()) return;
  stories = Object.values(snapshot.val());
  render();
}

// -------------------- EVENTS --------------------
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

[orderSelect, categorySelect, typeSelect, searchInput].forEach(el => {
  el.addEventListener("input", () => {
    currentPage = 1; // إعادة ضبط الصفحة عند أي تغيير
    render();
  });
});

prevBtn.onclick = () => { if (currentPage > 1) { currentPage--; render(); } };
nextBtn.onclick = () => { currentPage++; render(); };

// -------------------- HELPER --------------------
function buildStoryText(story) {
  const typeText = Type_Map[story.type] || "";
  const classList = [];
  for (const key in CLASS_MAP) if (story[key] === "on") classList.push(CLASS_MAP[key]);
  const classText = classList.join(" - ");
  return { typeText, classText };
}

function matchesSynonyms(text, synonyms) {
  for (const key in synonyms) {
    if (synonyms[key].some(word => word.includes(text))) return key;
  }
  return null;
}

// -------------------- RENDER --------------------
function render() {
  CardList.innerHTML = "";

  const selectedOrder = orderSelect.value;
  const selectedCategory = categorySelect.value;
  const selectedType = typeSelect.value;
  const searchText = searchInput.value.toLowerCase().trim();

  let filteredStories = stories.filter(story => {
    // فلترة حسب category
    const categoryMap = { story: "story", fayazer: "puzzle", Comec: "joke", Talks: "sayings" };
    if (selectedCategory && categoryMap[selectedCategory] !== story.type) return false;

    // فلترة حسب type
    const typeMap = {
      comedy: "comedy", history: "history", children: "children", horror: "horror",
      self: "self", notreal: "notreal", religion: "religion", sad: "sad",
      drama: "drama", education: "education", community: "community", love: "love"
    };
    if (selectedType && story[typeMap[selectedType]] !== "on") return false;

    // البحث الذكي متعدد اللغات والمرادفات
    if (searchText) {
      const combinedText = `${story.name_story} ${story.name_create} ${story.story}`.toLowerCase();

      let typeMatch = false;
      if (matchesSynonyms(searchText, TYPE_SYNONYMS) === story.type) typeMatch = true;

      let classMatch = false;
      const classKey = matchesSynonyms(searchText, CLASS_SYNONYMS);
      if (classKey && story[classKey] === "on") classMatch = true;

      if (!combinedText.includes(searchText) && !typeMatch && !classMatch) return false;
    }

    return true;
  });
  
  if (selectedOrder === "popularity") {
    filteredStories.sort((a, b) => {
        const scoreA = (parseInt(a.like || 0) * 0.7) + (parseFloat(a.rate || 0) * 0.3);
        const scoreB = (parseInt(b.like || 0) * 0.7) + (parseFloat(b.rate || 0) * 0.3);
        return scoreB - scoreA; // الأكبر أولًا
    });
} else {
    filteredStories.sort((a, b) => (parseInt(b.time_upload || 0) - parseInt(a.time_upload || 0)));
}
  // الصفحات
  const totalPages = Math.max(Math.ceil(filteredStories.length / PAGE_SIZE_LIMIT), 1);
  currentPage = Math.min(currentPage, totalPages); // تأكد أن الصفحة الحالية لا تتجاوز العدد الكلي

  const start = (currentPage - 1) * PAGE_SIZE_LIMIT;
  const end = start + PAGE_SIZE_LIMIT;

  filteredStories.slice(start, end).forEach(story => {
    const card = document.createElement("div");
    card.className = "card";
    card.addEventListener("click", () => {
      window.location.href = `html/story.html?id=${story.id_story}`;
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

  pageinfo.textContent = `${currentPage} / ${totalPages}`;
  nextBtn.disabled = end >= filteredStories.length;
  prevBtn.disabled = currentPage === 1;
}

// -------------------- START --------------------
LoadData();