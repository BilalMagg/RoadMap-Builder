import { motion } from "framer-motion";
import { Heart, Share2, BarChart, User, Clock } from "lucide-react";

export interface RoadmapFeedItem {
    id: string;
    title: string;
    description: string;
    status: 'draft' | 'published';
    likes: number;
    views: number;
    createdAt: string;
    updatedAt: string;
    author: {
        id: string;
        username: string;
        avatar?: string;
    };
    category: string;
    stepCount: number;
    progress?: number;
    isLiked: boolean;
}

interface RoadmapCardProps {
    roadmap: RoadmapFeedItem;
    onLike?: (id: string) => void;
}

export const RoadmapCard = ({ roadmap, onLike }: RoadmapCardProps) => {
    const {
        id,
        title,
        description,
        author,
        likes,
        views,
        category,
        stepCount,
        progress,
        isLiked
    } = roadmap;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ y: -5 }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white p-5 shadow-lg shadow-slate-200/50 transition-all hover:shadow-xl hover:shadow-slate-200/80 dark:bg-slate-900 dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-800"
        >
            <div className="absolute top-0 right-0 p-5 opacity-0 transition-opacity group-hover:opacity-100">
                <button className="rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 hover:text-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200">
                    <Share2 className="h-4 w-4" />
                </button>
            </div>

            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <span className="inline-flex items-center rounded-lg bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-700 ring-1 ring-inset ring-primary-600/20 dark:bg-primary-500/10 dark:text-primary-400 dark:ring-primary-500/20">
                        {category}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                        <Clock className="h-3 w-3" />
                        <span>{new Date(roadmap.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>

                <div>
                    <h3 className="line-clamp-1 text-xl font-bold text-slate-900 decoration-slate-900/20 hover:underline dark:text-white dark:decoration-white/20">
                        {title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                        {description}
                    </p>
                </div>

                {progress !== undefined && progress > 0 && (
                    <div className="w-full">
                        <div className="flex justify-between text-xs mb-1 font-medium text-slate-500 dark:text-slate-400">
                            <span>In Progress</span>
                            <span>{Math.round(progress)}%</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Author */}
                <div className="flex items-center gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
                    <div className="h-8 w-8 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                        {author.avatar ? (
                            <img src={author.avatar} alt={author.username} className="h-full w-full object-cover" />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-slate-400">
                                <User className="h-4 w-4" />
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                            {author.username}
                        </span>
                    </div>
                </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => onLike && onLike(id)}
                        className={`group flex items-center gap-1.5 text-sm font-medium transition-colors ${isLiked
                            ? 'text-pink-600 dark:text-pink-500 delay-75'
                            : 'text-slate-500 hover:text-pink-600 dark:text-slate-400 dark:hover:text-pink-500'
                            }`}
                    >
                        <Heart className={`h-4 w-4 transition-all ${isLiked ? 'fill-current scale-110' : 'group-hover:scale-110'}`} />
                        <span>{likes}</span>
                    </button>
                    <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400">
                        <BarChart className="h-4 w-4" />
                        <span>{views}</span>
                    </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <span>{stepCount} Steps</span>
                </div>
            </div>
        </motion.div>
    );
};
