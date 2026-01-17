import { ref, get } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";
import { app, analytics, database } from './firebaseConfig.js';

const params = new URLSearchParams(window.location.search);

const id = params.get("id");
const slug = params.get("slug");

let key_story = null;

if(slug) {
    key_story = { type: "slug", value: slug };
}else if (id) {
    key_story = { type: "id", value: id };
} else {
    window.location.href = `../html/error.html`;
}

async function fetchStory(key_story) {
    if (!key_story) return null;
    
    try {
        if (key_story.type === "id") {
            const itemRef = ref(database, `story/${key_story.value}`);
            const snapshot = await get(itemRef);
            return snapshot.exists() ? snapshot.val() : null;
        } else if (key_story.type === "slug") {
            const productsRef = ref(database, "story");
            const q = query(productsRef, orderByChild("slug"), equalTo(key_story.value));
            const snapshot = await get(q);

            if (snapshot.exists()) {
                let data = null;
                snapshot.forEach(child => {
                    data = child.val();
                });
                return data;
            } else {
                return null;
            }
        }
    } catch (error) {
        console.error("خطأ في جلب البيانات:", error);
        return null;
    }
}

fetchStory(key_story).then(data => {
    if (!data) {
        window.location.href = `../html/error.html`;
        return;
    }
    // Get Data data.n
    document.title = data.name_story
});