// Helper to format seconds as M:SS
export default function formatDuration(seconds) {
  const secsNum = Number(seconds) || 0;
  const mins = Math.floor(secsNum / 60);
  const secs = secsNum % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
