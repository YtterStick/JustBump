'use client';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalItems: number;
    itemsPerPage: number;
}

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    totalItems,
    itemsPerPage
}: PaginationProps) {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const surrounding = 1; // Number of pages around current page

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            // Always show first page
            pages.push(1);

            if (currentPage > surrounding + 3) {
                pages.push('...');
            }

            const start = Math.max(2, currentPage - surrounding);
            const end = Math.min(totalPages - 1, currentPage + surrounding);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - (surrounding + 2)) {
                pages.push('...');
            }

            // Always show last page
            pages.push(totalPages);
        }

        return pages;
    };

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div className="flex items-center justify-between bg-white px-5 py-3 rounded-2xl border border-gray-100 shadow-sm mt-4">
            <p className="text-sm text-gray-500">
                <span className="font-medium text-gray-700">{startItem}</span>
                –
                <span className="font-medium text-gray-700">{endItem}</span>
                {' '}of{' '}
                <span className="font-medium text-gray-700">{totalItems}</span>
            </p>
            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    aria-label="Previous page"
                >
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                    </svg>
                </button>

                {getPageNumbers().map((page, i) => (
                    typeof page === 'number' ? (
                        <button
                            key={i}
                            onClick={() => onPageChange(page)}
                            className={`min-w-[32px] h-8 rounded-lg text-sm font-medium transition-colors ${currentPage === page
                                ? 'bg-gray-900 text-white'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                                }`}
                        >
                            {page}
                        </button>
                    ) : (
                        <span key={i} className="px-2 text-gray-300 text-sm font-medium">
                            {page}
                        </span>
                    )
                ))}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    aria-label="Next page"
                >
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
