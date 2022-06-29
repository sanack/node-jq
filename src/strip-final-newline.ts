export default function stripFinalNewline(input: string): string {
  const LF = typeof input === 'string' ? '\n' : '\n'.charCodeAt(0);
  const CR = typeof input === 'string' ? '\r' : '\r'.charCodeAt(0);

  if (input[input.length - 1] === LF) {
   input = input.slice(0, -1);
  }

  if (input[input.length - 1] === CR) {
    input = input.slice(0, -1);
  }

  return input;
}
