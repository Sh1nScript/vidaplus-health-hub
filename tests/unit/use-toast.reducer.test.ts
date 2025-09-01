import { reducer } from '@/hooks/use-toast';

const baseToast = { id: '1', open: true } as any;

describe('toast reducer', () => {
  it('adiciona toast e respeita limite', () => {
    const state1 = reducer({ toasts: [] }, { type: 'ADD_TOAST', toast: baseToast });
    expect(state1.toasts).toHaveLength(1);
    const state2 = reducer(state1, { type: 'ADD_TOAST', toast: { id: '2', open: true } as any });
    expect(state2.toasts).toHaveLength(1);
    expect(state2.toasts[0].id).toBe('2');
  });

  it('atualiza toast existente', () => {
    const s = reducer({ toasts: [baseToast] }, { type: 'UPDATE_TOAST', toast: { id: '1', open: false } });
    expect(s.toasts[0].open).toBe(false);
  });

  it('remove toast', () => {
    const s1 = reducer({ toasts: [baseToast] }, { type: 'REMOVE_TOAST', toastId: '1' });
    expect(s1.toasts).toHaveLength(0);
  });
});
