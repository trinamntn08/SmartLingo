export class SpeechError extends Error {
  constructor(public readonly statusCode: number, message: string, public readonly terminal = false) { super(message); }
}
