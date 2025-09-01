import { cn } from '@/lib/utils';

describe('cn', () => {
  it('combina classes simples', () => {
    expect(cn('p-2', 'text-sm')).toBe('p-2 text-sm');
  });
  it('resolve conflito tailwind (última vence)', () => {
    const result = cn('p-2', 'p-4');
    expect(result).toContain('p-4');
    expect(result).not.toContain('p-2 p-4');
  });
  it('ignora valores falsy', () => {
    // @ts-expect-error testando valores falsy variados
    expect(cn('p-2', null, undefined, false, 'm-1')).toBe('p-2 m-1');
  });
});
