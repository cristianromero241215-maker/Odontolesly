// Navegación móvil
const burger = document.querySelector('.burger');
const nav = document.querySelector('.main-nav');
if (burger && nav) {
  burger.addEventListener('click', () => {
    const open = nav.style.display === 'block';
    nav.style.display = open ? 'none' : 'block';
    burger.setAttribute('aria-expanded', String(!open));
  });
}

// Loader helpers
const loader = document.getElementById('loader');
const mensaje = document.getElementById('mensaje');
function showLoader(){ if(loader) loader.style.display='block'; }
function hideLoader(){ if(loader) loader.style.display='none'; }

// Cargar horas disponibles (Calendar)
const fechaInput = document.getElementById('fecha');
const horaSelect = document.getElementById('hora');

async function cargarHorarios(dateStr){
  if(!window.APPS_SCRIPT_CAL_URL) return;
  try{
    showLoader();
    if(horaSelect){ horaSelect.innerHTML = '<option>Consultando disponibilidad...</option>'; }
    const res = await fetch(`${window.APPS_SCRIPT_CAL_URL}?date=${encodeURIComponent(dateStr)}`);
    const data = await res.json(); // { slots: [...] }
    if(!horaSelect) return;
    if(!Array.isArray(data.slots) || data.slots.length === 0){
      horaSelect.innerHTML = '<option value="">No hay horarios disponibles</option>';
      return;
    }
    horaSelect.innerHTML = '<option value="" disabled selected>Selecciona</option>';
    data.slots.forEach(h => {
      const opt = document.createElement('option');
      opt.value = h; opt.textContent = h;
      horaSelect.appendChild(opt);
    });
  }catch(e){
    console.error(e);
    if(horaSelect) horaSelect.innerHTML = '<option value="">Error al cargar horarios</option>';
  }finally{
    hideLoader();
  }
}

if(fechaInput){
  fechaInput.addEventListener('change', (e) => {
    if(e.target.value) cargarHorarios(e.target.value);
  });
}

// Enviar formulario
const form = document.getElementById('citaForm');
if(form){
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if(mensaje) mensaje.textContent = '';
    showLoader();

    const data = Object.fromEntries(new FormData(form).entries());
    try{
      // Registrar en Sheets
      if(window.APPS_SCRIPT_SHEETS_URL){
        await fetch(window.APPS_SCRIPT_SHEETS_URL, {
          method:'POST',
          body: JSON.stringify({ action:'add', ...data })
        });
      }
      // Crear evento en Calendar
      if(window.APPS_SCRIPT_CAL_URL){
        const calRes = await fetch(window.APPS_SCRIPT_CAL_URL, {
          method:'POST',
          body: JSON.stringify({ action:'create', nombre:data.nombre, telefono:data.telefono, tratamiento:data.tratamiento, date:data.fecha, time:data.hora })
        });
        const j = await calRes.json();
        if(!j.success) throw new Error(j.message || 'No se pudo crear el evento');
      }
      if(mensaje) mensaje.textContent = '✅ Tu cita fue agendada. Te contactaremos por WhatsApp.';
      form.reset();
      if(horaSelect) horaSelect.innerHTML = '<option value="" disabled selected>Selecciona una fecha primero</option>';
    }catch(err){
      console.error(err);
      if(mensaje) mensaje.textContent = '❌ Hubo un error al agendar. Intenta nuevamente.';
    }finally{
      hideLoader();
    }
  });
}
