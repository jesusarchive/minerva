export function getTimeString(date = new Date()): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function generateRandomId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function downloadRawLog(data: unknown) {
  const filename = 'data.json';

  const jsonBlob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  const jsonUrl = URL.createObjectURL(jsonBlob);

  const link = document.createElement('a');
  link.download = filename;
  link.href = jsonUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
