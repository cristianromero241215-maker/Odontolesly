// Loader
window.addEventListener("load", function() {
  const loader = document.getElementById("loader");
  const mainContent = document.getElementById("mainContent");
  setTimeout(() => {
    loader.style.display = "none";
    mainContent.style.display = "block";
  }, 1500);
});

// Scroll reveal
function revealOnScroll() {
  const reveals = document.querySelectorAll(".reveal");
  for (let i = 0; i < reveals.length; i++) {
    const windowHeight = window.innerHeight;
    const elementTop = reveals[i].getBoundingClientRect().top;
    const elementVisible = 100;
    if (elementTop < windowHeight - elementVisible) {
      reveals[i].classList.add("active");
    } else {
      reveals[i].classList.remove("active");
    }
  }
}
window.addEventListener("scroll", revealOnScroll);

// Google Calendar API
const CLIENT_ID = "TU_CLIENT_ID";
const API_KEY = "TU_API_KEY";
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
const SCOPES = "https://www.googleapis.com/auth/calendar.events";
const authorizeButton = document.getElementById("authorize_button");

function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(() => { authorizeButton.onclick = handleAuthClick; });
}

function handleAuthClick() { gapi.auth2.getAuthInstance().signIn(); }

document.getElementById("appointmentForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const date = document.getElementById("date").value;
  const service = document.getElementById("service").value;

  const event = {
    summary: `Cita con ${name}`,
    description: `Servicio: ${service}\nCorreo: ${email}`,
    start: { dateTime: new Date(date).toISOString(), timeZone: 'America/Mexico_City' },
    end: { dateTime: new Date(new Date(date).getTime() + 30*60000).toISOString(), timeZone: 'America/Mexico_City' }
  };

  gapi.client.calendar.events.insert({
    calendarId: 'primary',
    resource: event
  }).then(response => {
    document.getElementById("statusMsg").innerText = "✅ Cita registrada en Google Calendar";
    document.getElementById("appointmentForm").reset();
  }).catch(err => {
    console.error(err);
    document.getElementById("statusMsg").innerText = "❌ Error al registrar la cita";
  });
});

handleClientLoad();
