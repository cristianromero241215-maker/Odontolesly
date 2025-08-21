const SHEETS_API_URL = https://script.google.com/macros/s/AKfycbwkJVznRpqxaJAcCxSXbF1gA3PNi9mVzx3xpNLWjEQnrOx5rL1TJ7rDnSyqHlsYNfFZ/exec;

// Protección de sesión
if(localStorage.getItem('isAdminLoggedIn') !== 'true'){
  window.location.href = 'login.html';
}

document.getElementById('logoutBtn')?.addEventListener('click', () => {
  localStorage.removeItem('isAdminLoggedIn');
  window.location.href = 'login.html';
});

const tbody = document.querySelector('#citasTable tbody');
const filtroFecha = document.getElementById('filtroFecha');
const filtroTexto = document.getElementById('filtroTexto');
document.getElementById('refrescar')?.addEventListener('click', cargarCitas);

async function cargarCitas(){
  try{
    const res = await fetch(https://script.google.com/macros/s/AKfycbwkJVznRpqxaJAcCxSXbF1gA3PNi9mVzx3xpNLWjEQnrOx5rL1TJ7rDnSyqHlsYNfFZ/exec);
    const rows = await res.json(); // Matriz completa con encabezados
    const data = rows.slice(1).map(r => ({
      nombre:r[0], telefono:r[1], tratamiento:r[2], fecha:r[3], hora:r[4], estado:r[5]
    }));

    let filtrado = data;
    if(filtroFecha?.value){ filtrado = filtrado.filter(x => x.fecha === filtroFecha.value); }
    if(filtroTexto?.value){
      const t = filtroTexto.value.toLowerCase();
      filtrado = filtrado.filter(x => (x.nombre+x.tratamiento).toLowerCase().includes(t));
    }

    tbody.innerHTML = '';
    filtrado.forEach(row => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${row.nombre}</td><td>${row.telefono}</td><td>${row.tratamiento}</td><td>${row.fecha}</td><td>${row.hora}</td><td></td>`;
      const tdEstado = tr.children[5];
      const sel = document.createElement('select');
      ["Pendiente","Atendida","Cancelada"].forEach(s => { const o=document.createElement('option'); o.value=s;o.textContent=s;if(s===row.estado) o.selected=true; sel.appendChild(o); });
      sel.addEventListener('change', async () => {
        await fetch(https://script.google.com/macros/s/AKfycbwkJVznRpqxaJAcCxSXbF1gA3PNi9mVzx3xpNLWjEQnrOx5rL1TJ7rDnSyqHlsYNfFZ/exec, { method:'POST', body: JSON.stringify({ action:'update', nombre:row.nombre, fecha:row.fecha, hora:row.hora, estado: sel.value }) });
        alert('✅ Estado actualizado');
      });
      tdEstado.appendChild(sel);
      tbody.appendChild(tr);
    });
  }catch(e){
    alert('Error cargando citas'); console.error(e);
  }
}

cargarCitas();
