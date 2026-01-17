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

console.log(key_story);