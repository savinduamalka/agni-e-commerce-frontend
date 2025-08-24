import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/shared/header";
import Footer from "@/components/shared/footer";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";

type Category = {
	_id: string;
	name: string;
	description: string;
	image?: string;
	slug: string;
};

export default function CategoriesPage() {
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const categoriesPerPage = 12;

	useEffect(() => {
		async function fetchCategories() {
			try {
				const response = await fetch(
					`${import.meta.env.VITE_BACKEND_URL}/categories`
				);
				if (!response.ok) {
					throw new Error("Failed to fetch categories");
				}
				const data = await response.json();
				if (data.success) {
					setCategories(data.data.categories);
				} else {
					throw new Error(data.message || "Failed to fetch categories");
				}
			} catch (err) {
				const errorMessage =
					err instanceof Error ? err.message : "An unknown error occurred";
				setError(errorMessage);
				toast.error(errorMessage, {
					style: {
						boxShadow: "none",
					},
				});
			} finally {
				setLoading(false);
			}
		}

		fetchCategories();
	}, []);

	const indexOfLastCategory = currentPage * categoriesPerPage;
	const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
	const currentCategories = categories.slice(
		indexOfFirstCategory,
		indexOfLastCategory
	);

	const totalPages = Math.ceil(categories.length / categoriesPerPage);

	return (
		<div className="bg-gray-50 min-h-screen">
			<Header />
			<main className="container mx-auto px-4 py-8">
				<section className="text-center mb-12">
					<h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">
						Shop by Category
					</h1>
					<p className="text-lg md:text-xl text-gray-600">
						Find what you're looking for from our wide range of categories.
					</p>
				</section>

				<section>
					<div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
						{loading &&
							Array.from({ length: 12 }).map((_, index) => (
								<div key={index} className="flex flex-col space-y-3">
									<Skeleton className="h-40 w-full rounded-lg" />
									<div className="space-y-2">
										<Skeleton className="h-4 w-3/4 mx-auto" />
									</div>
								</div>
							))}
						{!loading &&
							!error &&
							currentCategories.map((category) => (
								<Card
									key={category._id}
									className="overflow-hidden transform hover:scale-105 transition-transform cursor-pointer group"
								>
									<CardHeader className="p-0">
										<div className="bg-gray-100 h-40 flex items-center justify-center text-5xl group-hover:scale-110 transition-transform duration-300">
											{category.image ? (
												<img
													src={category.image}
													alt={category.name}
													className="w-full h-full object-cover"
												/>
											) : (
												<span className="text-5xl">🛍️</span>
											)}
										</div>
									</CardHeader>
									<CardContent className="p-4 text-center">
										<CardTitle className="text-lg font-semibold mb-1">
											{category.name}
										</CardTitle>
									</CardContent>
								</Card>
							))}
					</div>
				</section>
				{!loading && !error && categories.length > categoriesPerPage && (
					<section className="mt-12">
						<Pagination>
							<PaginationContent>
								<PaginationItem>
									<PaginationPrevious
										href="#"
										onClick={(e) => {
											e.preventDefault();
											setCurrentPage((prev) => Math.max(prev - 1, 1));
										}}
									/>
								</PaginationItem>
								{Array.from({ length: totalPages }, (_, i) => (
									<PaginationItem key={i}>
										<PaginationLink
											href="#"
											isActive={i + 1 === currentPage}
											onClick={(e) => {
												e.preventDefault();
												setCurrentPage(i + 1);
											}}
										>
											{i + 1}
										</PaginationLink>
									</PaginationItem>
								))}
								<PaginationItem>
									<PaginationNext
										href="#"
										onClick={(e) => {
											e.preventDefault();
											setCurrentPage((prev) => Math.min(prev + 1, totalPages));
										}}
									/>
								</PaginationItem>
							</PaginationContent>
						</Pagination>
					</section>
				)}
			</main>
			<Footer />
		</div>
	);
}
