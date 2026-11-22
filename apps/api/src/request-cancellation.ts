import type { ServerResponse } from 'node:http';

/** Cancel provider work when its HTTP response disconnects; always release the listener. */
export async function withRequestCancellation<T>(response: ServerResponse, run: (signal: AbortSignal) => Promise<T>): Promise<T> {
  const controller = new AbortController();
  const disconnect = () => { if (!response.writableEnded) controller.abort(); };
  response.once('close', disconnect);
  // A close event may already have fired before the route starts its operation.
  if (response.destroyed) disconnect();
  try { return await run(controller.signal); }
  finally { response.removeListener('close', disconnect); }
}
