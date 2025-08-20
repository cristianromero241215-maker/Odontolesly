function doPost(e){
  const data = JSON.parse(e.postData.contents);
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Citas');
  if(!sh) throw new Error('Hoja "Citas" no existe');
  if(data.action === 'add'){
    sh.appendRow([data.nombre, data.telefono, data.tratamiento, data.fecha, data.hora, 'Pendiente']);
    return ContentService.createTextOutput('OK');
  }
  if(data.action === 'update'){
    const rows = sh.getDataRange().getValues();
    for(let i=1;i<rows.length;i++){
      const r = rows[i];
      if(r[0]===data.nombre && r[3]===data.fecha && r[4]===data.hora){
        sh.getRange(i+1,6).setValue(data.estado);
        return ContentService.createTextOutput('OK');
      }
    }
    return ContentService.createTextOutput('NOT_FOUND');
  }
  return ContentService.createTextOutput('INVALID');
}
function doGet(){ const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Citas'); const data = sh.getDataRange().getValues(); return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON); }
