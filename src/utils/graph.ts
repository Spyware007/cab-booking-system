interface Graph {
  [key: string]: { [key: string]: number };
}

export function findShortestPath(
  graph: Graph,
  start: string,
  end: string
): { path: string[]; duration: number } {
  const distances: { [key: string]: number } = {};
  const previous: { [key: string]: string | null } = {};
  const nodes = new Set(Object.keys(graph));
  const pq = new PriorityQueue<string>();

  nodes.forEach((node) => {
    distances[node] = node === start ? 0 : Infinity;
    previous[node] = null;
    pq.enqueue(node, distances[node]);
  });

  while (!pq.isEmpty()) {
    const closest = pq.dequeue()!.element;

    if (closest === end) {
      const path = [];
      let current = end;
      while (current) {
        path.unshift(current);
        current = previous[current];
      }
      return { path, duration: distances[end] };
    }

    if (distances[closest] === Infinity) break;

    for (const neighbor in graph[closest]) {
      const alt = distances[closest] + graph[closest][neighbor];
      if (alt < distances[neighbor]) {
        distances[neighbor] = alt;
        previous[neighbor] = closest;
        pq.enqueue(neighbor, alt);
      }
    }
  }

  return { path: [], duration: Infinity };
}

class PriorityQueue<T> {
  private elements: { element: T; priority: number }[] = [];

  enqueue(element: T, priority: number) {
    this.elements.push({ element, priority });
    this.elements.sort((a, b) => a.priority - b.priority);
  }

  dequeue() {
    return this.elements.shift();
  }

  isEmpty() {
    return this.elements.length === 0;
  }
}
