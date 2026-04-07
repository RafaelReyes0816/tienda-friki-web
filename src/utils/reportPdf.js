import { jsPDF } from 'jspdf';

const MARGIN = 14;
const BOTTOM = 280;
const LINE = 7;

const fmtMoney = (n) =>
  `Bs. ${Number(n ?? 0).toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const fmtDate = (d) => {
  if (!d) return '—';
  try {
    return new Date(d).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return String(d);
  }
};

const truncate = (s, max = 42) => {
  const t = String(s ?? '');
  return t.length <= max ? t : `${t.slice(0, max - 1)}…`;
};

function ensureSpace(doc, y, need = LINE) {
  if (y + need > BOTTOM) {
    doc.addPage();
    return MARGIN;
  }
  return y;
}

/**
 * PDF resumen de pedidos (admin).
 */
export function downloadPedidosPdf(orders = []) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  let y = MARGIN;

  doc.setFontSize(16);
  doc.text('Tienda Friki — Reporte de pedidos', MARGIN, y);
  y += LINE + 2;
  doc.setFontSize(10);
  doc.text(`Generado: ${fmtDate(new Date())}`, MARGIN, y);
  y += LINE + 4;

  const totalVentas = orders.reduce((acc, o) => acc + Number(o.total ?? 0), 0);
  const byEstado = orders.reduce((acc, o) => {
    const e = (o.estado || '—').toLowerCase();
    acc[e] = (acc[e] || 0) + 1;
    return acc;
  }, {});

  doc.setFontSize(11);
  doc.text(`Total de pedidos: ${orders.length}`, MARGIN, y);
  y += LINE;
  y = ensureSpace(doc, y);
  doc.text(`Suma de totales: ${fmtMoney(totalVentas)}`, MARGIN, y);
  y += LINE + 2;

  doc.setFontSize(10);
  doc.text('Pedidos por estado:', MARGIN, y);
  y += LINE;
  const estados = Object.keys(byEstado).sort();
  if (estados.length === 0) {
    doc.text('—', MARGIN, y);
    y += LINE;
  } else {
    estados.forEach((e) => {
      y = ensureSpace(doc, y);
      doc.text(`  • ${e}: ${byEstado[e]}`, MARGIN, y);
      y += LINE;
    });
  }
  y += 4;

  doc.setFontSize(11);
  doc.text('Detalle de pedidos', MARGIN, y);
  y += LINE + 2;
  doc.setFontSize(9);

  orders.forEach((o, i) => {
    y = ensureSpace(doc, y, 24);
    const id = o.id ?? o.Id;
    const codigo = o.codigo ?? o.Codigo ?? '—';
    const estado = o.estado ?? o.Estado ?? '—';
    const total = o.total ?? o.Total;
    const usuario = o.usuario ?? o.Usuario;
    const nombreUser = usuario?.nombre ?? usuario?.Nombre ?? '—';

    doc.setFont('helvetica', 'bold');
    doc.text(`#${id} · ${truncate(codigo, 35)}`, MARGIN, y);
    y += LINE;
    doc.setFont('helvetica', 'normal');
    doc.text(`  Fecha: ${fmtDate(o.fecha ?? o.Fecha)}`, MARGIN, y);
    y += LINE;
    doc.text(`  Estado: ${estado}  |  Cliente: ${truncate(nombreUser, 40)}`, MARGIN, y);
    y += LINE;
    doc.text(`  Total: ${fmtMoney(total)}`, MARGIN, y);
    y += LINE + 2;

    if (i < orders.length - 1) {
      y = ensureSpace(doc, y, 2);
    }
  });

  doc.save(`reporte-pedidos-${Date.now()}.pdf`);
}

/**
 * PDF inventario / catálogo de productos (admin).
 */
export function downloadInventarioPdf(products = []) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  let y = MARGIN;

  doc.setFontSize(16);
  doc.text('Tienda Friki — Inventario de productos', MARGIN, y);
  y += LINE + 2;
  doc.setFontSize(10);
  doc.text(`Generado: ${fmtDate(new Date())}`, MARGIN, y);
  y += LINE + 4;

  doc.setFontSize(10);
  doc.text(`Productos en catálogo: ${products.length}`, MARGIN, y);
  y += LINE + 4;

  doc.setFontSize(9);
  products.forEach((p, i) => {
    const nombre = p.nombre ?? p.Nombre ?? '—';
    const precio = p.precio ?? p.Precio;
    const stock = p.stock ?? p.Stock;
    const franquicia = p.franquicia ?? p.Franquicia ?? '';
    const cat = p.categoria ?? p.Categoria;
    const catNombre = cat?.nombre ?? cat?.Nombre ?? '';

    y = ensureSpace(doc, y, 22);
    doc.setFont('helvetica', 'bold');
    doc.text(`${i + 1}. ${truncate(nombre, 55)}`, MARGIN, y);
    y += LINE;
    doc.setFont('helvetica', 'normal');
    doc.text(
      `   Precio: ${fmtMoney(precio)}  |  Stock: ${stock ?? 0}  |  Franquicia: ${truncate(franquicia || '—', 20)}`,
      MARGIN,
      y
    );
    y += LINE;
    doc.text(`   Categoría: ${truncate(catNombre || '—', 50)}`, MARGIN, y);
    y += LINE + 2;
  });

  doc.save(`reporte-inventario-${Date.now()}.pdf`);
}
