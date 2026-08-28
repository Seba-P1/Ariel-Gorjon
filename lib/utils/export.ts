import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Tables } from '@/types/database';

export function formatRsvpDate(dateString: string): string {
  try {
    return format(new Date(dateString), "dd/MM/yyyy HH:mm 'hs'", { locale: es });
  } catch {
    return dateString;
  }
}

export function exportToExcel(
  rsvps: Tables<'rsvps'>[],
  eventTitle: string = 'evento'
) {
  const formattedData = rsvps.map((r, index) => ({
    '#': index + 1,
    'Nombre y Apellido': r.full_name,
    'Estado': r.status === 'confirmed' ? 'Confirmado' : r.status === 'declined' ? 'Rechazado' : 'Pendiente',
    'Acompañantes / Total': r.attendees_count,
    'Teléfono': r.phone || '—',
    'Email': r.email || '—',
    'Restricciones Alimentarias': r.dietary_notes || '—',
    'Canción Sugerida': r.song_request || '—',
    'Mensaje': r.message || '—',
    'Fecha de Respuesta': formatRsvpDate(r.created_at),
  }));

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Confirmaciones');

  // Auto-fit column widths
  const colWidths = [
    { wch: 5 },  // #
    { wch: 25 }, // Nombre
    { wch: 14 }, // Estado
    { wch: 20 }, // Total
    { wch: 18 }, // Telefono
    { wch: 25 }, // Email
    { wch: 30 }, // Restricciones
    { wch: 25 }, // Cancion
    { wch: 35 }, // Mensaje
    { wch: 20 }, // Fecha
  ];
  worksheet['!cols'] = colWidths;

  const safeName = eventTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  XLSX.writeFile(workbook, `rsvps-${safeName}-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
}

export function exportToCsv(
  rsvps: Tables<'rsvps'>[],
  eventTitle: string = 'evento'
) {
  const headers = [
    '#',
    'Nombre y Apellido',
    'Estado',
    'Personas',
    'Telefono',
    'Email',
    'Restricciones Alimentarias',
    'Cancion',
    'Mensaje',
    'Fecha',
  ];

  const rows = rsvps.map((r, idx) => [
    idx + 1,
    `"${(r.full_name || '').replace(/"/g, '""')}"`,
    r.status === 'confirmed' ? 'Confirmado' : r.status === 'declined' ? 'Rechazado' : 'Pendiente',
    r.attendees_count,
    `"${(r.phone || '').replace(/"/g, '""')}"`,
    `"${(r.email || '').replace(/"/g, '""')}"`,
    `"${(r.dietary_notes || '').replace(/"/g, '""')}"`,
    `"${(r.song_request || '').replace(/"/g, '""')}"`,
    `"${(r.message || '').replace(/"/g, '""')}"`,
    `"${formatRsvpDate(r.created_at)}"`,
  ]);

  const csvContent =
    '\uFEFF' + // UTF-8 BOM for Excel compatibility
    [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const safeName = eventTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  link.setAttribute('href', url);
  link.setAttribute('download', `rsvps-${safeName}-${format(new Date(), 'yyyy-MM-dd')}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
