import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTable } from './data-table';

interface SampleItem {
  id: string;
  name: string;
  value: number;
}

const columns: ColumnDef<SampleItem>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'value',
    header: 'Value',
    cell: ({ row }) => `$${row.original.value}`,
  },
];

const mockData: SampleItem[] = [
  { id: '1', name: 'Alpha Telegram', value: 10 },
  { id: '2', name: 'Beta TikTok', value: 20 },
  { id: '3', name: 'Gamma YouTube', value: 30 },
];

describe('DataTable (TanStack Table)', () => {
  it('renders table headers and rows accurately', () => {
    render(
      <DataTable
        columns={columns}
        data={mockData}
        searchColumnKey="name"
        searchPlaceholder="Filter items..."
      />,
    );

    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Alpha Telegram')).toBeInTheDocument();
    expect(screen.getByText('Beta TikTok')).toBeInTheDocument();
    expect(screen.getByText('$30')).toBeInTheDocument();
  });

  it('filters rows based on search input', () => {
    render(
      <DataTable
        columns={columns}
        data={mockData}
        searchColumnKey="name"
        searchPlaceholder="Filter items..."
      />,
    );

    const searchInput = screen.getByPlaceholderText('Filter items...');
    fireEvent.change(searchInput, { target: { value: 'TikTok' } });

    expect(screen.queryByText('Alpha Telegram')).not.toBeInTheDocument();
    expect(screen.getByText('Beta TikTok')).toBeInTheDocument();
  });
});
