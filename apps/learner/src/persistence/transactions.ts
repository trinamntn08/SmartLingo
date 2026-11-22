export function requestResult<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Could not access browser storage.'));
  });
}

export function transactionDone(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onabort = () => reject(transaction.error ?? new Error('The browser could not save this change.'));
    transaction.onerror = () => reject(transaction.error ?? new Error('Browser storage failed.'));
  });
}

export function appendImmutable<T extends { id: string }>(database: IDBDatabase, name: string, value: T, parse: (input: unknown) => T): Promise<void> {
  return appendImmutableBatch(database, name, [value], parse);
}

export async function appendImmutableBatch<T extends { id: string }>(database: IDBDatabase, name: string, values: readonly T[], parse: (input: unknown) => T): Promise<void> {
  const distinct = new Map<string, T>();
  for (const value of values) {
    const previous = distinct.get(value.id);
    if (previous && JSON.stringify(previous) !== JSON.stringify(value)) throw new Error('This event ID already belongs to a different attempt.');
    distinct.set(value.id, value);
  }
  if (!distinct.size) return;
  const transaction = database.transaction(name, 'readwrite');
  const done = transactionDone(transaction);
  const store = transaction.objectStore(name);
  const writes = [...distinct.values()].map(value => new Promise<void>((resolve, reject) => {
    const request = store.get(value.id);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      try {
        if (request.result === undefined) store.add(value);
        else if (JSON.stringify(parse(request.result)) !== JSON.stringify(value)) {
          throw new Error('This event ID already belongs to a different attempt.');
        }
        resolve();
      } catch (error) { reject(error); transaction.abort(); }
    };
  }));
  await Promise.all([...writes, done]);
}
