import { useState, useEffect } from "react";

const usePagination = <T>(
	data: T[],
	pageSize: number,
	fetchData?: () => Promise<void>
) => {
	const [currentPage, setCurrentPage] = useState(1);
	const totalPages = Math.ceil(data.length / pageSize);

	useEffect(() => {
		if (fetchData) {
			fetchData();
		}
	}, []);

	const paginatedData = data.slice(
		(currentPage - 1) * pageSize,
		currentPage * pageSize
	);

	const goToNextPage = () => {
		if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
	};

	const goToPreviousPage = () => {
		if (currentPage > 1) setCurrentPage((prev) => prev - 1);
	};

	return {
		currentPage,
		totalPages,
		paginatedData,
		goToNextPage,
		goToPreviousPage,
	};
};

export default usePagination;
