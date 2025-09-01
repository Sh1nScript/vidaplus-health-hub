import { render, screen, fireEvent } from '@testing-library/react';
import { AdminDashboard } from '@/components/Dashboard/AdminDashboard';
import React from 'react';

// Mock simples para toast provider (componentes Radix não são necessários aqui)
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: () => {}, dismiss: () => {}, toasts: [] })
}));

describe('AdminDashboard', () => {
  it('abre diálogo de cadastros e adiciona paciente', () => {
    render(<AdminDashboard />);
    fireEvent.click(screen.getByRole('button', { name: /Cadastros/i }));
    fireEvent.click(screen.getAllByRole('button', { name: /Novo/i })[0]);
    const input = screen.getByPlaceholderText(/Nome completo/i);
    fireEvent.change(input, { target: { value: 'Paciente Teste' } });
    fireEvent.click(screen.getByRole('button', { name: /^Salvar$/i }));
    expect(screen.getByText('Paciente Teste')).toBeInTheDocument();
  });
});
