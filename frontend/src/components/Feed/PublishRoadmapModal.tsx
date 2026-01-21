import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Globe, Lock, Loader2 } from "lucide-react";
import { RoadmapApi } from "../../features/roadmap/services/roadmapApi";
import { toast } from "sonner";

interface PublishRoadmapModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface RoadmapSummary {
    id: string;
    title: string;
    isPublic?: boolean;
}

export const PublishRoadmapModal = ({ isOpen, onClose }: PublishRoadmapModalProps) => {
    const [roadmaps, setRoadmaps] = useState<RoadmapSummary[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isPublishing, setIsPublishing] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadUserRoadmaps();
        }
    }, [isOpen]);

    const loadUserRoadmaps = async () => {
        setIsLoading(true);
        try {
            const data = await RoadmapApi.getAllRoadmaps();
            setRoadmaps(data);
        } catch (error) {
            toast.error("Failed to load your roadmaps");
        } finally {
            setIsLoading(false);
        }
    };

    const handlePublish = async () => {
        if (!selectedId) return;

        setIsPublishing(true);
        try {
            // Mock API call - in a real app, this would toggle the public status
            await RoadmapApi.updateRoadmap(selectedId, { isPublic: true });

            toast.success("Roadmap published to feed successfully!");
            onClose();
        } catch (error) {
            toast.error("Failed to publish roadmap");
        } finally {
            setIsPublishing(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900"
                >
                    {/* Header */}
                    <div className="relative border-b border-slate-100 bg-white px-6 py-6 pt-10 dark:border-slate-800 dark:bg-slate-900">
                        <button
                            onClick={onClose}
                            className="absolute right-4 top-4 rounded-full bg-slate-100 p-2 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-600 dark:bg-slate-800 dark:text-slate-500 dark:hover:bg-slate-700 dark:hover:text-slate-300"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600 ring-1 ring-primary-100 dark:bg-primary-900/20 dark:text-primary-400 dark:ring-primary-900/50">
                                <Globe className="h-6 w-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Share to Feed</h2>
                                <p className="text-slate-500 dark:text-slate-400">Showcase your learning path to the community</p>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Select a Roadmap
                        </h3>

                        {isLoading ? (
                            <div className="flex h-40 items-center justify-center">
                                <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
                            </div>
                        ) : roadmaps.length === 0 ? (
                            <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center dark:border-slate-700">
                                <p className="text-slate-500">You haven't created any roadmaps yet.</p>
                            </div>
                        ) : (
                            <div className="max-h-60 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
                                {roadmaps.map((map) => (
                                    <button
                                        key={map.id}
                                        onClick={() => setSelectedId(map.id)}
                                        className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition-all ${selectedId === map.id
                                            ? "border-primary-600 bg-primary-50 dark:border-primary-500 dark:bg-primary-900/20"
                                            : "border-slate-200 hover:border-primary-200 hover:shadow-md dark:border-slate-700 dark:hover:border-primary-800"
                                            }`}
                                    >
                                        <div>
                                            <h4 className={`font-semibold ${selectedId === map.id ? "text-primary-700 dark:text-primary-300" : "text-slate-700 dark:text-slate-200"}`}>
                                                {map.title}
                                            </h4>
                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                {map.isPublic ? (
                                                    <span className="flex items-center gap-1 text-emerald-600">
                                                        <Globe className="h-3 w-3" /> Published
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1">
                                                        <Lock className="h-3 w-3" /> Private
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        {selectedId === map.id && (
                                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-600 text-white">
                                                <Check className="h-4 w-4" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="mt-8 flex items-center justify-end gap-3">
                            <button
                                onClick={onClose}
                                className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={!selectedId || isPublishing}
                                onClick={handlePublish}
                                className="flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-primary-500/20 transition-all hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isPublishing && <Loader2 className="h-4 w-4 animate-spin" />}
                                Publish to Feed
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
