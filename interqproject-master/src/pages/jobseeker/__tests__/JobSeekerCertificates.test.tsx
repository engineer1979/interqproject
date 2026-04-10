import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import JobSeekerCertificates from '../JobSeekerCertificates';
import { useAuth } from '@/contexts/SimpleAuthContext';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/contexts/SimpleAuthContext');
vi.mock('@/integrations/supabase/client');
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: vi.fn() }),
}));

const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
};

const mockCertificates = [
  {
    id: 'cert-1',
    user_id: 'test-user-id',
    name: 'John Doe',
    title: 'IT Technical Interview Certification',
    assessment_score: 85,
    interview_score: 88,
    status: 'issued',
    certificate_number: 'CERT-123456',
    created_at: '2024-01-15T10:00:00Z',
  },
];

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};

describe('JobSeekerCertificates', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as vi.Mock).mockReturnValue({ user: mockUser });
  });

  it('renders loading state', () => {
    (supabase.from as vi.Mock).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: [], error: null }),
    });

    renderWithProviders(<JobSeekerCertificates />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders empty state when no certificates', async () => {
    (supabase.from as vi.Mock).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: [], error: null }),
    });

    renderWithProviders(<JobSeekerCertificates />);

    await waitFor(() => {
      expect(screen.getByText('No certificates yet')).toBeInTheDocument();
    });
    expect(screen.getByText('Generate Demo Certificate')).toBeInTheDocument();
  });

  it('renders certificates list', async () => {
    (supabase.from as vi.Mock).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: mockCertificates, error: null }),
    });

    renderWithProviders(<JobSeekerCertificates />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('IT Technical Interview Certification')).toBeInTheDocument();
      expect(screen.getByText('85%')).toBeInTheDocument();
      expect(screen.getByText('88%')).toBeInTheDocument();
    });
  });

  it('opens preview modal when preview button is clicked', async () => {
    (supabase.from as vi.Mock).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: mockCertificates, error: null }),
    });

    renderWithProviders(<JobSeekerCertificates />);

    await waitFor(() => {
      const previewButton = screen.getByLabelText(/Preview certificate for John Doe/i);
      fireEvent.click(previewButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Certificate Preview')).toBeInTheDocument();
    });
  });

  it('closes preview modal when close button is clicked', async () => {
    (supabase.from as vi.Mock).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: mockCertificates, error: null }),
    });

    renderWithProviders(<JobSeekerCertificates />);

    await waitFor(() => {
      const previewButton = screen.getByLabelText(/Preview certificate for John Doe/i);
      fireEvent.click(previewButton);
    });

    await waitFor(() => {
      const closeButton = screen.getByRole('button', { name: /close/i });
      fireEvent.click(closeButton);
    });

    await waitFor(() => {
      expect(screen.queryByText('Certificate Preview')).not.toBeInTheDocument();
    });
  });

  it('shows loading state on download button when generating PDF', async () => {
    (supabase.from as vi.Mock).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: mockCertificates, error: null }),
    });

    renderWithProviders(<JobSeekerCertificates />);

    await waitFor(() => {
      const downloadButton = screen.getByLabelText(/Download PDF certificate for John Doe/i);
      fireEvent.click(downloadButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Generating...')).toBeInTheDocument();
    });
  });

  it('displays correct certificate count', async () => {
    (supabase.from as vi.Mock).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: mockCertificates, error: null }),
    });

    renderWithProviders(<JobSeekerCertificates />);

    await waitFor(() => {
      expect(screen.getByText('1 certificate(s) earned')).toBeInTheDocument();
    });
  });

  it('formats date correctly in certificate preview', async () => {
    (supabase.from as vi.Mock).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: mockCertificates, error: null }),
    });

    renderWithProviders(<JobSeekerCertificates />);

    await waitFor(() => {
      const previewButton = screen.getByLabelText(/Preview certificate for John Doe/i);
      fireEvent.click(previewButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/January 15, 2024/)).toBeInTheDocument();
    });
  });

  it('displays certificate number in preview', async () => {
    (supabase.from as vi.Mock).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: mockCertificates, error: null }),
    });

    renderWithProviders(<JobSeekerCertificates />);

    await waitFor(() => {
      const previewButton = screen.getByLabelText(/Preview certificate for John Doe/i);
      fireEvent.click(previewButton);
    });

    await waitFor(() => {
      expect(screen.getByText('CERT-123456')).toBeInTheDocument();
    });
  });

  it('displays issuer information in preview', async () => {
    (supabase.from as vi.Mock).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: mockCertificates, error: null }),
    });

    renderWithProviders(<JobSeekerCertificates />);

    await waitFor(() => {
      const previewButton = screen.getByLabelText(/Preview certificate for John Doe/i);
      fireEvent.click(previewButton);
    });

    await waitFor(() => {
      expect(screen.getByText('InterQ Certification Authority')).toBeInTheDocument();
    });
  });
});