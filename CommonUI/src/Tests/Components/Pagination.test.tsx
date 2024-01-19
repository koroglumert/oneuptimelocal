import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Pagination, {
    ComponentProps,
} from '../../Components/Pagination/Pagination';

describe('Pagination', () => {
    it('renders Component', () => {
        const props: ComponentProps = {
            currentPageNumber: 1,
            totalItemsCount: 20,
            itemsOnPage: 10,
            onNavigateToPage: jest.fn(),
            isLoading: false,
            isError: false,
            singularLabel: 'Item',
            pluralLabel: 'Items',
        };

        render(<Pagination {...props} />);

        expect(
            screen.getByText(/Showing 1 to 10 on this page/i)
        ).toBeInTheDocument();
    });

    it('renders with 1 item', () => {
        const props: ComponentProps = {
            currentPageNumber: 1,
            totalItemsCount: 1,
            itemsOnPage: 10,
            onNavigateToPage: jest.fn(),
            isLoading: false,
            isError: false,
            singularLabel: 'Item',
            pluralLabel: 'Items',
        };

        render(<Pagination {...props} />);

        expect(screen.getByText(/1 Item/i)).toBeInTheDocument();
    });

    it('calls onNavigateToPage when Next link is clicked', async () => {
        const mockOnNavigateToPage: jest.Mock = jest.fn();
        const props: ComponentProps = {
            currentPageNumber: 1,
            totalItemsCount: 19,
            itemsOnPage: 10,
            onNavigateToPage: mockOnNavigateToPage,
            isLoading: false,
            isError: false,
            singularLabel: 'Item',
            pluralLabel: 'Items',
        };

        render(<Pagination {...props} />);

        fireEvent.click(screen.getByText('Next'));

        await waitFor(() => {
            expect(mockOnNavigateToPage).toHaveBeenCalledWith(2, 10);
        });
    });

    it('calls onNavigateToPage when Previous link is clicked', async () => {
        const mockOnNavigateToPage: jest.Mock = jest.fn();
        const props: ComponentProps = {
            currentPageNumber: 2,
            totalItemsCount: 19,
            itemsOnPage: 10,
            onNavigateToPage: mockOnNavigateToPage,
            isLoading: false,
            isError: false,
            singularLabel: 'Item',
            pluralLabel: 'Items',
        };

        render(<Pagination {...props} />);

        fireEvent.click(screen.getByText('Previous'));

        await waitFor(() => {
            expect(mockOnNavigateToPage).toHaveBeenCalledWith(1, 10);
        });
    });

    it('shows Pagination Modal when button modal is clicked', async () => {
        const props: ComponentProps = {
            currentPageNumber: 1,
            totalItemsCount: 0,
            itemsOnPage: 10,
            onNavigateToPage: jest.fn(),
            isLoading: false,
            isError: false,
            singularLabel: 'Item',
            pluralLabel: 'Items',
        };

        render(<Pagination {...props} />);

        fireEvent.click(screen.getByTestId('show-pagination-modal-button'));

        await waitFor(() => {
            expect(screen.getByText('Navigate to Page')).toBeInTheDocument();
        });
    });

    it('shows Pagination Modal when current page link is clicked', async () => {
        const props: ComponentProps = {
            currentPageNumber: 2,
            totalItemsCount: 19,
            itemsOnPage: 10,
            onNavigateToPage: jest.fn(),
            isLoading: false,
            isError: false,
            singularLabel: 'Item',
            pluralLabel: 'Items',
        };

        render(<Pagination {...props} />);

        fireEvent.click(screen.getByTestId('current-page-link'));

        await waitFor(() => {
            expect(screen.getByText('Navigate to Page')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByTestId('close-button'));

        await waitFor(() => {
            expect(screen.queryByTestId('pagination-modal')).toBeNull();
        });
    });

    it('shows Pagination Modal and submit with go to page', async () => {
        const mockOnNavigateToPage: jest.Mock = jest.fn();
        const props: ComponentProps = {
            currentPageNumber: 1,
            totalItemsCount: 20,
            itemsOnPage: 10,
            onNavigateToPage: mockOnNavigateToPage,
            isLoading: false,
            isError: false,
            singularLabel: 'Item',
            pluralLabel: 'Items',
        };

        render(<Pagination {...props} />);

        fireEvent.click(screen.getByTestId('current-page-link'));

        await waitFor(() => {
            expect(screen.getByText('Navigate to Page')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('Go to Page'));

        await waitFor(() => {
            expect(mockOnNavigateToPage).toHaveBeenCalledWith(1, 10);
        });
    });
});
