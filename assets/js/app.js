
// HADI LI MSTOCKI FIHA ACCOUNTS



const users = [
  { name : "admin", email: "admin@app.com", password: "admin123" , role: "admin" },
  { name : "user", email: "user@app.com", password: "user123" , role: "user" },
];

const form = document.getElementById("LoginForm");
const error = document.getElementById("error-message");

form.addEventListener("submit", function (a) {
  a.preventDefault(); //kt actualiser la page

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  let foundUser = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!foundUser) {
    error.textContent = "password or email incorrect";
    return;
  }

  // Stocker user dans la session
  localStorage.setItem("loggedInUser", JSON.stringify(foundUser));
  // Sauvegarder le rôle dans localStorage
  localStorage.setItem('userRole', foundUser.role);
  localStorage.setItem('userEmail', foundUser.email);
  localStorage.setItem('userName', foundUser.name);

  window.location.href = "dashboard.html";
});
