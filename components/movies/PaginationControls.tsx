import Link from "next/link";

type PaginationControlsProps = {
    currentPage: number;
    totalPages: number;
    searchParams: Record<string, string | string[] | undefined>;
};

function createPageUrl(
    page: number,
    searchParams: Record<string, string | string[] | undefined>
) {
    const params = new URLSearchParams();

    Object.entries(searchParams).forEach(([key, value]) => {
        if (!value || key === "page") return;

        if (Array.isArray(value)) {
            value.forEach((item) => params.append(key, item));
        } else {
            params.set(key, value);
        }
    });

    params.set("page", String(page));

    return `/?${params.toString()}`;
}

export default function PaginationControls({
    currentPage,
    totalPages,
    searchParams,
}: PaginationControlsProps) {
    return (
        <div className="mt-8 flex items-center justify-center gap-4">
            <Link
                href={createPageUrl(Math.max(1, currentPage - 1), searchParams)}
                className={`rounded-full px-5 py-2 text-sm font-semibold ${currentPage === 1
                        ? "pointer-events-none bg-slate-800 text-slate-500"
                        : "bg-violet-600 text-white hover:bg-violet-500"
                    }`}
            >
                Previous
            </Link>

            <span className="text-sm text-slate-300">
                Page {currentPage} of {totalPages}
            </span>

            <Link
                href={createPageUrl(Math.min(totalPages, currentPage + 1), searchParams)}
                className={`rounded-full px-5 py-2 text-sm font-semibold ${currentPage === totalPages
                        ? "pointer-events-none bg-slate-800 text-slate-500"
                        : "bg-violet-600 text-white hover:bg-violet-500"
                    }`}
            >
                Next
            </Link>
        </div>
    );
}
