import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AdminDashboard } from '@/components/Dashboard/AdminDashboard';
import React from 'react';

// Mock de toast para não interferir com asserts.
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: () => {}, dismiss: () => {}, toasts: [] })
}));

async function openCadastros() {
  await userEvent.click(screen.getByRole('button', { name: /Cadastros/i }));
  // Aguarda título do diálogo
  await screen.findByText(/Gerenciar Cadastros/i);
}

describe('AdminDashboard ações adicionais', () => {
  it('edita nome de paciente existente', async () => {
    render(<AdminDashboard />);
  await openCadastros();
  const row = await screen.findByTestId('patient-row-1');
  const editBtn = within(row).getByRole('button', { name: 'Editar' });
  await userEvent.click(editBtn);
  const input = within(row).getByDisplayValue('Maria Souza');
    await userEvent.clear(input);
    await userEvent.type(input, 'Maria Silva');
  const salvar = within(row as HTMLElement).getByRole('button', { name: 'Salvar' });
  await userEvent.click(salvar);
    expect(screen.getByText('Maria Silva')).toBeInTheDocument();
  });

  it('exclui um paciente', async () => {
    render(<AdminDashboard />);
  await openCadastros();
  const row = await screen.findByTestId('patient-row-2');
  const excluirBtn = within(row).getByRole('button', { name: /Excluir/i });
  await userEvent.click(excluirBtn);
    // Dialogo de confirmação
    const confirm = await screen.findByRole('button', { name: 'Excluir' });
    await userEvent.click(confirm);
    expect(screen.queryByText('João Pereira')).not.toBeInTheDocument();
  });

  it('adiciona e remove profissional', async () => {
    render(<AdminDashboard />);
  await openCadastros();
  // Botão Novo de profissionais: encontra seção pelo heading e depois o botão
  const profHeading = screen.getByRole('heading', { name: /Profissionais/i });
  const profSection = profHeading.closest('div')?.parentElement; // container da seção
  const botaoProf = within(profSection as HTMLElement).getByRole('button', { name: 'Novo' });
  await userEvent.click(botaoProf);
    const input = await screen.findByPlaceholderText('Nome completo');
    await userEvent.type(input, 'Dr. Teste');
    const salvar = screen.getByRole('button', { name: /^Salvar$/i });
    await userEvent.click(salvar);
    expect(screen.getByText('Dr. Teste')).toBeInTheDocument();
    // Excluir recém adicionado
  const profCard = screen.getByText('Dr. Teste').closest('[data-testid]') || screen.getByText('Dr. Teste').closest('div');
  const excluirBtn2 = within(profCard as HTMLElement).getByRole('button', { name: /Excluir/i });
  await userEvent.click(excluirBtn2);
    const confirm = await screen.findByRole('button', { name: 'Excluir' });
    await userEvent.click(confirm);
    expect(screen.queryByText('Dr. Teste')).not.toBeInTheDocument();
  });

  it('altera relatório para Financeiro e adiciona notas', async () => {
    render(<AdminDashboard />);
    // Abre dialog de relatórios
    await userEvent.click(screen.getByRole('button', { name: 'Relatórios' }));
    const select = screen.getByLabelText('Tipo de relatório');
    await userEvent.selectOptions(select, 'financeiro');
    expect(await screen.findByText(/Receita estimada/i)).toBeInTheDocument();
    const textarea = screen.getByPlaceholderText('Observações adicionais...');
    await userEvent.type(textarea, 'Nota importante');
    expect(screen.getByText(/Notas: Nota importante/)).toBeInTheDocument();
  });
});
