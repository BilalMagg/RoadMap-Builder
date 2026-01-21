import { useState, useRef, useEffect } from "react";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Search, Loader2, TrendingUp, Clock, Sparkles } from "lucide-react";
import { RoadmapCard, type RoadmapFeedItem } from "../components/Feed/RoadmapCard";
import { PublishRoadmapModal } from "../components/Feed/PublishRoadmapModal";
import { api } from "../services/http";
import { toast } from "sonner";


const CATEGORIES = ["All", "Learning", "Business", "Design", "Programming", "Career", "Entrepreneurship"];

export const FeedPage = () => {
    const queryClient = useQueryClient();
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState<"recent" | "popular">("recent");
    const [activeCategory, setActiveCategory] = useState("All");
    const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
    const loadMoreRef = useRef(null);
    const isInView = useInView(loadMoreRef);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError
    } = useInfiniteQuery({
        queryKey: ["feed", sort, activeCategory, search],
        queryFn: async ({ pageParam = 1 }) => {
            const res = await api.get(`/roadmaps/feed`, {
                params: {
                    sort,
                    page: pageParam,
                    limit: 12,
                    search: search || undefined,
                    category: activeCategory !== "All" ? activeCategory : undefined
                }
            });
            // Adapt to API response structure depending on if it returns { data, meta } or just []
            // Assuming existing API might need tweaks so handling safe check:
            const items = Array.isArray(res.data) ? res.data : (res.data.data || []);
            return items as RoadmapFeedItem[];
        },
        getNextPageParam: (lastPage, allPages) => {
            if (!lastPage || lastPage.length < 12) return undefined;
            return allPages.length + 1;
        },
        initialPageParam: 1,
    });

    useEffect(() => {
        if (isInView && hasNextPage) {
            fetchNextPage();
        }
    }, [isInView, hasNextPage, fetchNextPage]);

    const likeMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await api.post(`/roadmaps/${id}/like`);
            return res.data;
        },
        onSuccess: () => {
            // Optimistically update
            queryClient.invalidateQueries({ queryKey: ["feed"] });
        },
        onError: () => {
            toast.error("Failed to like roadmap");
        }
    });

    // Flatten pages into one array
    const allRoadmaps = data?.pages.flatMap((page) => page) || [];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Hero Section */}
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-white pb-24 pt-16 dark:bg-slate-900">
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
                <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50 opacity-80 dark:from-primary-900/20 dark:via-slate-900 dark:to-accent-900/20" />

                <div className="relative mx-auto max-w-7xl px-4 md:px-8">
                    <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                        <div className="max-w-2xl">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1 text-sm font-medium text-primary-700 ring-1 ring-inset ring-primary-600/20 dark:bg-primary-500/10 dark:text-primary-300 dark:ring-primary-500/20"
                            >
                                <Sparkles className="h-4 w-4" />
                                <span>Discover Learning Paths</span>
                            </motion.div>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-6xl"
                            >
                                Explorer's <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-500">Feed</span>
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="mt-4 text-lg text-slate-600 dark:text-slate-400"
                            >
                                Discover, follow, and master roadmaps created by the community.
                                Find your next skill to conquer.
                            </motion.p>
                        </div>

                        <motion.button
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsPublishModalOpen(true)}
                            className="group flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 font-bold text-white shadow-xl shadow-primary-900/10 transition-all hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:shadow-white/10"
                        >
                            <Sparkles className="h-5 w-5 text-primary-200 transition-transform group-hover:rotate-12 dark:text-primary-600" />
                            Share Your Roadmap
                        </motion.button>
                    </div>
                </div>
            </div>

            <div className="relative mx-auto -mt-16 max-w-7xl px-4 pb-20 md:px-8">
                {/* Glassmorphic Search Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mb-10 rounded-2xl bg-white/80 p-4 shadow-xl backdrop-blur-xl ring-1 ring-slate-900/5 dark:bg-slate-900/80 dark:ring-white/10"
                >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search roadmaps, authors, topics..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-slate-900 shadow-sm transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                            />
                        </div>

                        <div className="flex items-center justify-between gap-4 border-t border-slate-200 pt-4 lg:border-t-0 lg:pt-0 dark:border-slate-800">
                            <div className="flex gap-2 overflow-x-auto no-scrollbar">
                                {CATEGORIES.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setActiveCategory(cat)}
                                        className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all ${activeCategory === cat
                                            ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20 dark:bg-white dark:text-slate-900"
                                            : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>

                            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 hidden lg:block" />

                            <div className="flex bg-slate-100 p-1 rounded-lg dark:bg-slate-800">
                                <button
                                    onClick={() => setSort("recent")}
                                    className={`p-2 rounded-md transition-all ${sort === "recent" ? "bg-white shadow-sm dark:bg-slate-700 text-slate-900 dark:text-white" : "text-slate-400 hover:text-slate-600"}`}
                                    title="Recent"
                                >
                                    <Clock className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setSort("popular")}
                                    className={`p-2 rounded-md transition-all ${sort === "popular" ? "bg-white shadow-sm dark:bg-slate-700 text-slate-900 dark:text-white" : "text-slate-400 hover:text-slate-600"}`}
                                    title="Popular"
                                >
                                    <TrendingUp className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Grid */}
                {isLoading ? (
                    <div className="flex h-64 items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
                    </div>
                ) : isError ? (
                    <div className="rounded-xl bg-red-50 p-8 text-center text-red-600 dark:bg-red-900/20">
                        Failed to load feed. Please try again.
                    </div>
                ) : (
                    <>
                        {!allRoadmaps.length ? (
                            <div className="py-20 text-center text-slate-500">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                                    <Search className="h-8 w-8 opacity-50" />
                                </div>
                                <h3 className="text-lg font-medium text-slate-900 dark:text-white">No roadmaps found</h3>
                                <p>Try adjusting your search or filters.</p>
                            </div>
                        ) : (
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                <AnimatePresence mode="popLayout">
                                    {allRoadmaps.map((roadmap: RoadmapFeedItem, idx: number) => (
                                        <RoadmapCard
                                            key={`${roadmap.id}-${idx}`}
                                            roadmap={roadmap}
                                            onLike={(id) => likeMutation.mutate(id)}
                                        />
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}

                        {/* Infinite Scroll Loader */}
                        <div ref={loadMoreRef} className="mt-12 flex justify-center h-10">
                            {isFetchingNextPage && <Loader2 className="h-6 w-6 animate-spin text-primary-500" />}
                        </div>
                    </>
                )}
            </div>
            <PublishRoadmapModal
                isOpen={isPublishModalOpen}
                onClose={() => setIsPublishModalOpen(false)}
            />
        </div>
    );
};
