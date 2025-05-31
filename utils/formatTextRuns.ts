export const formatTextRuns = (runs?: { text: string }[]) =>
  runs?.map((run) => run.text).join('') || '';
