export async function evaluateProjects(projects: string[]) {
  const response = await fetch('/api/evaluate-projects', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ projects }),
  });

  if (!response.ok) throw new Error('Failed to get scores');

  const data = await response.json();
  return data.scores as number[];
}