import { ObservationSession, Observation } from '../types';
import { barcelonaBirds } from '../data/birds';

export function generateCSV(session: ObservationSession, observations: Observation[]): string {
  const lines: string[] = [];

  lines.push('Sessió d\'Observació d\'Ocells');
  lines.push('');
  lines.push(`Data d'inici:,${new Date(session.start_time).toLocaleString('ca-ES')}`);
  if (session.end_time) {
    lines.push(`Data de finalització:,${new Date(session.end_time).toLocaleString('ca-ES')}`);
  }
  lines.push(`Ubicació:,"${session.location_lat}, ${session.location_lng}"`);
  lines.push('');
  lines.push('Espècie,Quantitat');

  observations.forEach((obs) => {
    let birdName = obs.bird_species;
    if (!obs.is_custom) {
      const bird = barcelonaBirds.find((b) => b.id === obs.bird_species);
      if (bird) {
        birdName = `${bird.name_ca} (${bird.scientific_name})`;
      }
    }
    lines.push(`"${birdName}",${obs.count}`);
  });

  lines.push('');
  lines.push(`Total d'ocells observats:,${observations.reduce((sum, obs) => sum + obs.count, 0)}`);
  lines.push(`Nombre d'espècies:,${observations.length}`);

  return lines.join('\n');
}

export function downloadCSV(filename: string, content: string): void {
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function createSessionCSVFilename(session: ObservationSession): string {
  const date = new Date(session.start_time);
  const dateStr = date.toISOString().slice(0, 10);
  const timeStr = date.toTimeString().slice(0, 5).replace(':', '-');
  return `sessio-ocells-${dateStr}-${timeStr}.csv`;
}
