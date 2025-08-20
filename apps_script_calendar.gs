// === Configuración ===
const CALENDAR_ID = 'primary'; // o ID del calendario
const TIMEZONE = 'America/Mexico_City';
const DURACION_MINUTOS = 30;

// Horarios de atención: 1=Lun ... 6=Sáb, 0=Dom
const HORARIOS = {
  1: [['09:00','14:00'], ['16:00','19:00']],
  2: [['09:00','14:00'], ['16:00','19:00']],
  3: [['09:00','14:00'], ['16:00','19:00']],
  4: [['09:00','14:00'], ['16:00','19:00']],
  5: [['09:00','14:00'], ['16:00','19:00']],
  6: [['09:00','13:00']]
};

function doGet(e){
  const date = e?.parameter?.date;
  if(!date) return ContentService.createTextOutput(JSON.stringify({slots:[]})).setMimeType(ContentService.MimeType.JSON);
  const slots = obtenerSlots(date);
  return ContentService.createTextOutput(JSON.stringify({slots})).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e){
  const data = JSON.parse(e.postData.contents);
  if(data.action === 'create'){
    return crearEvento(data);
  }
  return ContentService.createTextOutput(JSON.stringify({success:false,message:'Acción inválida'})).setMimeType(ContentService.MimeType.JSON);
}

function obtenerSlots(dateStr){
  const cal = CalendarApp.getCalendarById(CALENDAR_ID);
  const date = new Date(dateStr+'T00:00:00');
  const dow = date.getDay();
  const rangos = HORARIOS[dow];
  if(!rangos) return [];
  const startDay = new Date(date); startDay.setHours(0,0,0,0);
  const endDay = new Date(date); endDay.setHours(23,59,59,999);
  const eventos = cal.getEvents(startDay, endDay);
  const ocupados = eventos.map(ev => [fmt(ev.getStartTime()), fmt(ev.getEndTime())]);

  const disponibles = [];
  rangos.forEach(r=>{
    let current = parse(dateStr, r[0]);
    const fin = parse(dateStr, r[1]);
    while(current < fin){
      const siguiente = new Date(current.getTime() + DURACION_MINUTOS*60000);
      const choque = ocupados.some(o => {
        const os = parse(dateStr,o[0]); const oe = parse(dateStr,o[1]);
        return (current < oe && siguiente > os);
      });
      if(!choque && siguiente <= fin){ disponibles.push(fmt(current)); }
      current = siguiente;
    }
  });
  return disponibles;
}

function crearEvento(data){
  try{
    const cal = CalendarApp.getCalendarById(CALENDAR_ID);
    const inicio = parse(data.date, data.time);
    const fin = new Date(inicio.getTime() + DURACION_MINUTOS*60000);
    const title = `Cita: ${data.nombre} (${data.tratamiento})`;
    const desc = `Paciente: ${data.nombre}\nTel: ${data.telefono}\nTratamiento: ${data.tratamiento}`;
    cal.createEvent(title, inicio, fin, {description: desc});
    return ContentService.createTextOutput(JSON.stringify({success:true})).setMimeType(ContentService.MimeType.JSON);
  }catch(err){
    return ContentService.createTextOutput(JSON.stringify({success:false,message:String(err)})).setMimeType(ContentService.MimeType.JSON);
  }
}

function parse(dateStr, hhmm){ const [h,m] = hhmm.split(':').map(Number); const d = new Date(dateStr+'T00:00:00'); d.setHours(h,m,0,0); return d; }
function fmt(d){ const hh=('0'+d.getHours()).slice(-2); const mm=('0'+d.getMinutes()).slice(-2); return `${hh}:${mm}`; }
