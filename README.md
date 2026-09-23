# 🔧 Cotizador de Repuestos

Herramienta de cotización de repuestos de vehículos, preparada para uso de **Sergio Escobar**. Genera un registro automático de cada cotización y lo exporta a Excel para tomar el caso de forma más eficiente.

## Funciones

- Registro automático con ID correlativo (`COT-0001`, `COT-0002`…) y fecha/hora.
- Datos del cliente, vehículo (marca, modelo, año, patente) y repuestos (código, proveedor, cantidad, precio).
- Cálculo de neto, IVA 19 % y total en CLP.
- Marcas: Suzuki, Mazda, Renault, Great Wall (GWM), Haval, Changan y DFSK, con sugerencias de modelos.
- Responsable asignado por defecto: Sergio Escobar (editable) y estado del caso (Nuevo, Cotizado, Aprobado, Cerrado).
- Exportación a Excel (`.xlsx`) automática al guardar, por cotización o de todo el registro.
- Buscador por cliente, patente o ID.

## Publicar en GitHub Pages

1. Crea un repositorio en GitHub (se recomienda **privado** si es de uso interno).
2. Sube `index.html` y `README.md`.
3. En **Settings → Pages**, elige *Deploy from a branch*, rama `main`, carpeta `/ (root)`.
4. Quedará en `https://TU-USUARIO.github.io/NOMBRE-DEL-REPO/`.

> GitHub Pages en repositorios privados requiere un plan de pago. En un plan gratuito el repositorio debe ser público; en ese caso, no subas datos de clientes.

## Uso local

Abre `index.html` en el navegador (necesita internet para cargar la librería SheetJS).

## Sobre los datos

Las cotizaciones se guardan en el navegador de quien usa la app; no se suben a GitHub. Para trabajar desde otro equipo, exporta a Excel. No subas al repositorio Excels con datos reales de clientes.
