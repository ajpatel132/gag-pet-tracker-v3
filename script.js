import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, push, onValue, set } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAWnntTQF-QullnSup0upgqBZBD2L97MVI",
  authDomain: "gag-pet-tracker-a5b6a.firebaseapp.com",
  projectId: "gag-pet-tracker-a5b6a",
  storageBucket: "gag-pet-tracker-a5b6a.appspot.com",
  messagingSenderId: "82791063841",
  appId: "1:82791063841:web:25464efef316c1211f1e60",
  measurementId: "G-N9Z7D81Y0X",
  databaseURL: "https://gag-pet-tracker-a5b6a-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const petForm = document.getElementById("petForm");
const petList = document.getElementById("petList");

petForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("petName").value;
  if (!name.trim()) return;

  const newPetRef = push(ref(database, "pets"));
  await set(newPetRef, { name });

  petForm.reset();
});

function loadPets() {
  const petsRef = ref(database, "pets");
  onValue(petsRef, (snapshot) => {
    petList.innerHTML = "";
    const pets = snapshot.val();
    for (const id in pets) {
      const li = document.createElement("li");
      li.textContent = pets[id].name;
      petList.appendChild(li);
    }
  });
}

loadPets();
