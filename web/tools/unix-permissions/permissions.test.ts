import { describe, expect, test } from 'bun:test';
import {
  DEFAULT_MODE,
  has,
  parseOctal,
  parseSymbolic,
  toOctal,
  toSymbolic,
  withPermission,
} from './permissions.ts';

describe('toSymbolic', () => {
  test('renders the default mode', () => {
    expect(toSymbolic(DEFAULT_MODE)).toBe('-rw-r--r--');
  });

  test('renders the extremes', () => {
    expect(toSymbolic(0o777)).toBe('-rwxrwxrwx');
    expect(toSymbolic(0o000)).toBe('----------');
    expect(toSymbolic(0o755)).toBe('-rwxr-xr-x');
  });
});

describe('toOctal', () => {
  test('pads to three digits', () => {
    expect(toOctal(0o007)).toBe('007');
    expect(toOctal(0o644)).toBe('644');
  });
});

describe('parseOctal', () => {
  test('accepts three octal digits', () => {
    expect(parseOctal('755')).toBe(0o755);
    expect(parseOctal(' 644 ')).toBe(0o644);
  });

  test('rejects anything else', () => {
    expect(parseOctal('64')).toBeNull();
    expect(parseOctal('8')).toBeNull();
    expect(parseOctal('0644')).toBeNull();
    expect(parseOctal('')).toBeNull();
  });
});

describe('parseSymbolic', () => {
  test('accepts both leading-dash and bare forms', () => {
    expect(parseSymbolic('-rw-r--r--')).toBe(0o644);
    expect(parseSymbolic('rw-r--r--')).toBe(0o644);
  });

  test('accepts a file-type prefix', () => {
    expect(parseSymbolic('drwxr-xr-x')).toBe(0o755);
  });

  test('rejects malformed input', () => {
    expect(parseSymbolic('rwxrwxrw')).toBeNull();
    expect(parseSymbolic('xwrxwrxwr')).toBeNull();
    expect(parseSymbolic('')).toBeNull();
  });
});

describe('round trips', () => {
  test('every mode survives octal and symbolic', () => {
    for (let mode = 0; mode <= 0o777; mode += 1) {
      expect(parseOctal(toOctal(mode))).toBe(mode);
      expect(parseSymbolic(toSymbolic(mode))).toBe(mode);
    }
  });
});

describe('withPermission', () => {
  test('sets and clears a single bit', () => {
    expect(withPermission(0o644, 'user', 'execute', true)).toBe(0o744);
    expect(withPermission(0o644, 'user', 'write', false)).toBe(0o444);
  });

  test('is idempotent', () => {
    expect(withPermission(0o644, 'user', 'read', true)).toBe(0o644);
  });
});

describe('has', () => {
  test('reads the right bits', () => {
    expect(has(0o644, 'user', 'write')).toBe(true);
    expect(has(0o644, 'group', 'write')).toBe(false);
    expect(has(0o644, 'other', 'read')).toBe(true);
  });
});
