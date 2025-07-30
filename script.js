import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, push, onValue, set, remove } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

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
const auth = getAuth(app);

const petForm = document.getElementById("petForm");
const petList = document.getElementById("petList");
const userDisplay = document.getElementById("userDisplay");

let currentUser = null;

onAuthStateChanged(auth, (user) => {
  currentUser = user;
  userDisplay.textContent = user ? \`Logged in as: \${user.email}\` : "Not logged in";
  loadPets();
});

petForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!currentUser) return alert("Please log in first.");
  const name = document.getElementById("petName").value;
  if (!name.trim()) return;

  const newPetRef = push(ref(database, "pets"));
  await set(newPetRef, { name, addedBy: currentUser.email });
  petForm.reset();
});

function loadPets() {
  const petsRef = ref(database, "pets");
  onValue(petsRef, (snapshot) => {
    petList.innerHTML = "";
    const pets = snapshot.val();
    for (const id in pets) {
      const li = document.createElement("li");
      li.textContent = \`\${pets[id].name} (added by \${pets[id].addedBy})\`;

      if (currentUser && pets[id].addedBy === currentUser.email) {
        const delBtn = document.createElement("button");
        delBtn.textContent = "Delete";
        delBtn.onclick = () => remove(ref(database, \`pets/\${id}\`));
        li.appendChild(delBtn);
      }

      petList.appendChild(li);
    }
  });
}

window.signUp = async function() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("Signed up successfully!");
  } catch (err) {
    alert(err.message);
  }
};

window.logIn = async function() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Logged in!");
  } catch (err) {
    alert(err.message);
  }
};

window.logOut = function() {
  signOut(auth);
  alert("Logged out");
};
