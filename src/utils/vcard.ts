interface VCardData {
  name: string;
  phone: string;
  email: string;
  url?: string;
  organization?: string;
}

export function generateVCard(data: VCardData): string {
  const vcard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${data.name}`,
    `TEL:${data.phone}`,
    `EMAIL:${data.email}`,
    data.url ? `URL:${data.url}` : '',
    data.organization ? `ORG:${data.organization}` : '',
    'END:VCARD'
  ].filter(Boolean).join('\n');
  
  return vcard;
}

export function downloadVCard(vcard: string, filename: string) {
  const blob = new Blob([vcard], { type: 'text/vcard' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.vcf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}