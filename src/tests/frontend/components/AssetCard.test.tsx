import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AssetCard } from '@/components/AssetCard';
import { AssetProvider } from '@/providers/AssetProvider';
import { mockAsset, mockAssetMetrics } from '../mocks/assetMocks';
import userEvent from '@testing-library/user-event';

describe('AssetCard Component', () => {
  const defaultProps = {
    asset: mockAsset,
    onInvest: jest.fn(),
    onViewDetails: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders asset information correctly', () => {
    render(
      <AssetProvider>
        <AssetCard {...defaultProps} />
      </AssetProvider>
    );

    expect(screen.getByText(mockAsset.name)).toBeInTheDocument();
    expect(screen.getByText(mockAsset.type)).toBeInTheDocument();
    expect(screen.getByText(`$${mockAsset.value}`)).toBeInTheDocument();
  });

  it('displays asset metrics when available', async () => {
    render(
      <AssetProvider>
        <AssetCard {...defaultProps} metrics={mockAssetMetrics} />
      </AssetProvider>
    );

    expect(screen.getByText(`${mockAssetMetrics.temperature}°C`)).toBeInTheDocument();
    expect(screen.getByText(`${mockAssetMetrics.humidity}%`)).toBeInTheDocument();
  });

  it('calls onInvest when invest button is clicked', async () => {
    render(
      <AssetProvider>
        <AssetCard {...defaultProps} />
      </AssetProvider>
    );

    const investButton = screen.getByRole('button', { name: /invest/i });
    await userEvent.click(investButton);

    expect(defaultProps.onInvest).toHaveBeenCalledWith(mockAsset.id);
  });

  it('shows loading state during investment', async () => {
    const onInvest = jest.fn(() => new Promise(resolve => setTimeout(resolve, 1000)));

    render(
      <AssetProvider>
        <AssetCard {...defaultProps} onInvest={onInvest} />
      </AssetProvider>
    );

    const investButton = screen.getByRole('button', { name: /invest/i });
    await userEvent.click(investButton);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('displays error message when investment fails', async () => {
    const onInvest = jest.fn(() => Promise.reject('Investment failed'));

    render(
      <AssetProvider>
        <AssetCard {...defaultProps} onInvest={onInvest} />
      </AssetProvider>
    );

    const investButton = screen.getByRole('button', { name: /invest/i });
    await userEvent.click(investButton);

    await waitFor(() => {
      expect(screen.getByText(/investment failed/i)).toBeInTheDocument();
    });
  });

  it('navigates to details page when view details is clicked', () => {
    render(
      <AssetProvider>
        <AssetCard {...defaultProps} />
      </AssetProvider>
    );

    const detailsButton = screen.getByRole('button', { name: /view details/i });
    fireEvent.click(detailsButton);

    expect(defaultProps.onViewDetails).toHaveBeenCalledWith(mockAsset.id);
  });

  it('shows verified badge for verified assets', () => {
    render(
      <AssetProvider>
        <AssetCard {...defaultProps} asset={{ ...mockAsset, verified: true }} />
      </AssetProvider>
    );

    expect(screen.getByTestId('verified-badge')).toBeInTheDocument();
  });

  it('displays appropriate status indicator', () => {
    render(
      <AssetProvider>
        <AssetCard {...defaultProps} />
      </AssetProvider>
    );

    const statusIndicator = screen.getByTestId('status-indicator');
    expect(statusIndicator).toHaveClass(mockAsset.status.toLowerCase());
  });

  it('renders asset location correctly', () => {
    render(
      <AssetProvider>
        <AssetCard {...defaultProps} />
      </AssetProvider>
    );

    expect(screen.getByText(new RegExp(mockAsset.location.latitude.toString()))).toBeInTheDocument();
    expect(screen.getByText(new RegExp(mockAsset.location.longitude.toString()))).toBeInTheDocument();
  });

  it('shows investment progress', () => {
    const asset = {
      ...mockAsset,
      investment: {
        target: 100000,
        current: 75000,
      },
    };

    render(
      <AssetProvider>
        <AssetCard {...defaultProps} asset={asset} />
      </AssetProvider>
    );

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '75');
  });
});
