import { Link } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import { ArrowRight, Lightbulb, Users, Zap, Globe, Lock, Share2 } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: <Lightbulb className="w-6 h-6 text-yellow-500" />,
    title: "Turn ideas into reality",
    description: "Transform your vision into a visual roadmap. Make complex journeys simple and understandable.",
  },
  {
    icon: <Users className="w-6 h-6 text-blue-500" />,
    title: "Share your knowledge",
    description: "Create learning paths that guide others. Build a community around your expertise.",
  },
  {
    icon: <Zap className="w-6 h-6 text-orange-500" />,
    title: "Move at your speed",
    description: "No complicated setup. Start building immediately and iterate as you go.",
  },
  {
    icon: <Globe className="w-6 h-6 text-green-500" />,
    title: "Works for anything",
    description: "Education, business, creative projects—Pathfinder adapts to your vision.",
  },
  {
    icon: <Lock className="w-6 h-6 text-purple-500" />,
    title: "Keep control",
    description: "Your roadmaps are yours. Choose who sees them, who follows them, and how they're shared.",
  },
  {
    icon: <Share2 className="w-6 h-6 text-pink-500" />,
    title: "Inspire others",
    description: "Build in public, collect feedback, and watch your roadmaps guide and inspire a community.",
  },
];

const StatCounter = ({ value, label }: { value: string; label: string }) => (
  <div className="flex flex-col items-center">
    <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">{value}</span>
    <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
  </div>
);

export default function Index() {
  return (
    <Layout>
      <div className="relative overflow-hidden bg-white dark:bg-slate-950">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary-200/30 rounded-full blur-[100px] -z-10 opacity-50 dark:opacity-20 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-accent-200/30 rounded-full blur-[120px] -z-10 opacity-40 dark:opacity-10" />

        {/* Hero Section */}
        <section className="relative px-6 pt-20 pb-16 md:pt-32 md:pb-24 max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-primary-50 text-primary-600 text-sm font-medium mb-6 border border-primary-100 hover:shadow-sm transition-shadow">
              ✨ The simplest way to plan and share
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6 leading-tight">
              Map your journey, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500">
                inspire your path
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
              Create beautiful, interactive roadmaps for any domain. From learning paths to project timelines, guide your community toward their goals.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all bg-primary-600 rounded-lg hover:bg-primary-700 hover:scale-105 shadow-lg shadow-primary-500/30 ring-offset-2 ring-primary-500 focus:ring-2"
              >
                Start building free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <a
                href="#values"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-all dark:bg-slate-800 dark:text-gray-200 dark:border-slate-700 dark:hover:bg-slate-700"
              >
                Learn more
              </a>
            </div>

            {/* Mock Stats */}
            <div className="flex flex-wrap justify-center gap-12 sm:gap-24 border-y border-gray-100 dark:border-slate-800 py-8 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
              <StatCounter value="10k+" label="Active Users" />
              <StatCounter value="50k+" label="Roadmaps Created" />
              <StatCounter value="1M+" label="Monthly Views" />
            </div>
          </motion.div>
        </section>

        {/* Features Grid */}
        <section id="values" className="py-20 bg-gray-50/50 dark:bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Everything you need</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">Focused on what matters—helping you build and share.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-slate-700"
                >
                  <div className="w-12 h-12 bg-gray-50 dark:bg-slate-700 rounded-xl flex items-center justify-center mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 px-6">
          <div className="max-w-5xl mx-auto bg-gradient-to-br from-primary-600 to-accent-600 rounded-3xl p-12 text-center text-white shadow-2xl relative overflow-hidden">

            {/* Texture overlay */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />

            <h2 className="text-3xl md:text-5xl font-bold mb-6 relative z-10">Ready to build your roadmap?</h2>
            <p className="text-lg md:text-xl text-primary-100 mb-10 max-w-2xl mx-auto relative z-10">
              Join creators who are already building roadmaps, sharing knowledge, and inspiring their communities.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
              <Link
                to="/signup"
                className="px-8 py-4 bg-white text-primary-600 font-bold rounded-lg hover:bg-gray-50 transition-colors shadow-lg"
              >
                Get started—it's free
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
