/* Configuración de la página del cliente (index.html) */
const CONFIG = {
  NOMBRE: 'Sergio Escobar',
  WHATSAPP: '',      // WhatsApp de contacto para clientes. Formato internacional sin +, ej: 56912345678
  EMAIL: '',         // Correo para la opción "Enviar por correo" del cliente
  VIDEO_FONDO: 'fondo.mp4',  // Video de fondo (archivo junto a index.html). Déjalo vacío '' para desactivarlo
  SHEETS_URL: '',    // URL /exec del Google Apps Script vinculado a tu hoja de cálculo (ver README)

  /* Ciudades y comunas que aparecen en el formulario (agrega o quita las que necesites) */
  ZONAS: {
    "Concepción": ["Concepción", "Talcahuano", "Hualpén", "San Pedro de la Paz", "Chiguayante"],
    "Los Ángeles": ["Los Ángeles"],
    "Chillán": ["Chillán", "Chillán Viejo"],
    "Osorno": ["Osorno"],
    "Santiago": ["Alhué", "Buin", "Calera de Tango", "Cerrillos", "Cerro Navia", "Colina", "Conchalí", "Curacaví", "El Bosque", "El Monte", "Estación Central", "Huechuraba", "Independencia", "Isla de Maipo", "La Cisterna", "La Florida", "La Granja", "La Pintana", "La Reina", "Lampa", "Las Condes", "Lo Barnechea", "Lo Espejo", "Lo Prado", "Macul", "Maipú", "María Pinto", "Melipilla", "Ñuñoa", "Padre Hurtado", "Paine", "Pedro Aguirre Cerda", "Peñaflor", "Peñalolén", "Pirque", "Providencia", "Pudahuel", "Puente Alto", "Quilicura", "Quinta Normal", "Recoleta", "Renca", "San Bernardo", "San Joaquín", "San José de Maipo", "San Miguel", "San Pedro", "San Ramón", "Santiago", "Talagante", "Tiltil", "Vitacura"]
  },

  /* Sucursales de retiro. La ciudad y la comuna deben escribirse igual que en ZONAS. horario es opcional. */
  SUCURSALES: [
    { nombre: "Casa Matriz Concepción", ciudad: "Concepción", comuna: "Concepción", direccion: "Paicaví 2613 / 2601", detalle: "Venta de vehículos nuevos y usados, repuestos, accesorios y servicio técnico", horario: '' },
    { nombre: "Paicaví 2119", ciudad: "Concepción", comuna: "Concepción", direccion: "Paicaví 2119", detalle: "Venta de seminuevos / usados y exhibición comercial", horario: '' },
    { nombre: "O'Higgins 36", ciudad: "Concepción", comuna: "Concepción", direccion: "O'Higgins 36", detalle: "Venta de vehículos y servicio técnico oficial", horario: '' },
    { nombre: "Prat 1020 / Salas 224", ciudad: "Concepción", comuna: "Concepción", direccion: "Prat 1020 / Salas 224", detalle: "Atención comercial y servicio automotriz", horario: '' },
    { nombre: "Cataluña 1156", ciudad: "Concepción", comuna: "Concepción", direccion: "Cataluña 1156", detalle: "Venta y entrega de unidades", horario: '' },
    { nombre: "San Martín 70", ciudad: "Concepción", comuna: "Concepción", direccion: "San Martín 70", detalle: "Servicio técnico y postventa", horario: '' },
    { nombre: "Autoplaza Mallplaza El Trébol", ciudad: "Concepción", comuna: "Talcahuano", direccion: "Av. Jorge Alessandri 3177", detalle: "Módulo de ventas y exhibición de vehículos nuevos multimarca", horario: '' },
    { nombre: "Los Ángeles · Av. Alemania", ciudad: "Los Ángeles", comuna: "Los Ángeles", direccion: "Av. Alemania 413", detalle: "Venta de vehículos nuevos, usados y repuestos", horario: '' },
    { nombre: "Los Ángeles · Taller Las Industrias", ciudad: "Los Ángeles", comuna: "Los Ángeles", direccion: "Av. Las Industrias 10445", detalle: "Servicio técnico, desabolladura y pintura oficial", horario: '' },
    { nombre: "Chillán · O'Higgins 1061", ciudad: "Chillán", comuna: "Chillán", direccion: "Av. Bernardo O'Higgins 1061", detalle: "Venta de vehículos usados y sala de ventas", horario: '' },
    { nombre: "Chillán · O'Higgins 788", ciudad: "Chillán", comuna: "Chillán", direccion: "Av. Bernardo O'Higgins 788", detalle: "Venta de vehículos nuevos y postventa", horario: '' },
    { nombre: "Chillán · Arauco 1188", ciudad: "Chillán", comuna: "Chillán", direccion: "Arauco 1188", detalle: "Servicio técnico y atención comercial", horario: '' },
    { nombre: "Osorno · René Soriano", ciudad: "Osorno", comuna: "Osorno", direccion: "Av. René Soriano 2623", detalle: "Venta de vehículos nuevos, seminuevos y postventa", horario: '' },
    { nombre: "Movicenter", ciudad: "Santiago", comuna: "Huechuraba", direccion: "Av. Américo Vespucio 1155", detalle: "Venta de vehículos nuevos y usados", horario: '' },
    { nombre: "Mallplaza Vespucio", ciudad: "Santiago", comuna: "La Florida", direccion: "Av. Vicuña Mackenna Oriente 7110 / 8603", detalle: "Exhibición de catálogo multimarca y usados", horario: '' }
  ]
};
