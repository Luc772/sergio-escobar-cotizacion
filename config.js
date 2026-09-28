/* Configuración de la página del cliente (index.html) */
const CONFIG = {
  NOMBRE: 'Sergio Escobar',
  WHATSAPP: '',      // WhatsApp de contacto para clientes. Formato internacional sin +, ej: 56912345678
  EMAIL: '',         // Correo para la opción "Enviar por correo" del cliente
  VIDEO_FONDO: 'fondo.mp4',  // Video de fondo (archivo junto a index.html). Déjalo vacío '' para desactivarlo
  SHEETS_URL: '',    // URL /exec del Google Apps Script vinculado a tu hoja de cálculo (ver README)

  /* Ciudades y comunas que aparecen en el formulario (agrega o quita las que necesites) */
  ZONAS: {
    'Santiago': ['Alhué','Buin','Calera de Tango','Cerrillos','Cerro Navia','Colina','Conchalí','Curacaví','El Bosque','El Monte','Estación Central','Huechuraba','Independencia','Isla de Maipo','La Cisterna','La Florida','La Granja','La Pintana','La Reina','Lampa','Las Condes','Lo Barnechea','Lo Espejo','Lo Prado','Macul','Maipú','María Pinto','Melipilla','Ñuñoa','Padre Hurtado','Paine','Pedro Aguirre Cerda','Peñaflor','Peñalolén','Pirque','Providencia','Pudahuel','Puente Alto','Quilicura','Quinta Normal','Recoleta','Renca','San Bernardo','San Joaquín','San José de Maipo','San Miguel','San Pedro','San Ramón','Santiago','Talagante','Tiltil','Vitacura'],
    'Valparaíso': ['Valparaíso','Viña del Mar','Concón','Quilpué','Villa Alemana'],
    'Concepción': ['Concepción','Talcahuano','San Pedro de la Paz','Hualpén','Chiguayante']
  },

  /* SUCURSALES DE EJEMPLO: reemplázalas por las reales (ciudad y comuna deben coincidir con ZONAS) */
  SUCURSALES: [
    { nombre: 'Sucursal Centro',  ciudad: 'Santiago', comuna: 'Santiago',  direccion: 'Dirección por completar', horario: 'Lun-Vie 9:00-18:00' },
    { nombre: 'Sucursal Oriente', ciudad: 'Santiago', comuna: 'Providencia', direccion: 'Dirección por completar', horario: 'Lun-Vie 9:00-18:00' },
    { nombre: 'Sucursal Sur',     ciudad: 'Santiago', comuna: 'San Bernardo', direccion: 'Dirección por completar', horario: 'Lun-Sáb 9:00-17:00' }
  ]
};
