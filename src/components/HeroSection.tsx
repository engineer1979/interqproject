import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Play, Users, TrendingUp, Shield, CheckCircle2, Clock, Target, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImg from "@/assets/hero-interview.jpg";

const HeroSection = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
  };

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-24 pb-20 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-6%] w-[600px] h-[600px] rounded-full bg-cyan-500/[0.08] blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-6%] w-[500px] h-[500px] rounded-full bg-blue-500/[0.05] blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full bg-cyan-500/[0.04] blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="container-width relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          {/* Left Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col space-y-6 text-center lg:text-left items-center lg:items-start max-w-2xl mx-auto lg:mx-0"
          >
            {/* Badge */}
            <motion.div variants={itemVariants}>
              <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-semibold tracking-wider uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mr-2 animate-pulse" />
                Expert-Led Technical Hiring Platform
              </span>
            </motion.div>

            {/* H1 */}
            <motion.h1
              variants={itemVariants}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[4.25rem] font-extrabold leading-[1.1] tracking-tight text-white"
            >
              Technical Interview Platform{" "}
              <span className="text-gradient-brand">
                Powered by Experts
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0"
            >
              InterQ replaces unstructured hiring with{" "}
              <strong className="text-white">structured candidate assessments</strong>{" "}
              led by vetted domain experts — so you hire faster, reduce bias, and eliminate bad hires.
            </motion.p>

            {/* Bullet benefits */}
            <motion.ul
              variants={itemVariants}
              className="flex flex-col gap-2 text-sm sm:text-base text-slate-300 w-full max-w-xl mx-auto lg:mx-0"
            >
              {[
                "Structured technical interviews — not gut-feel decisions",
                "Vetted Experts assess candidates across 50+ domains",
                "Detailed evaluation reports delivered within 24 hours",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-400 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </motion.ul>

            {/* CTAs */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center gap-3 pt-1 w-full sm:w-auto"
            >
              <Button
                onClick={() => navigate("/get-started")}
                size="lg"
                className="w-full sm:w-auto h-12 px-9 text-base font-semibold rounded-xl shadow-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5 transition-all duration-200"
              >
                Request a Demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <Button
                onClick={() => navigate("/#how-it-works")}
                size="lg"
                variant="outline"
                className="w-full sm:w-auto h-12 px-9 text-base font-medium rounded-xl border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white hover:border-white/40 transition-all duration-200 backdrop-blur-sm group"
              >
                <Play className="mr-2 h-4 w-4 fill-current group-hover:scale-110 transition-transform" />
                See How It Works
              </Button>
            </motion.div>

            {/* CTA microcopy */}
            <motion.p
              variants={itemVariants}
              className="text-xs text-slate-400"
            >
              No sales call required • 5-minute walkthrough of InterQ's hiring platform
            </motion.p>

            {/* Trust strip */}
            <motion.div
              variants={itemVariants}
              className="pt-2 w-full"
            >
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4">
                {[
                  { icon: Clock, text: "Reduce hiring time by 40%" },
                  { icon: Users, text: "500+ hiring teams" },
                  { icon: Target, text: "Higher hiring accuracy" },
                ].map((badge, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-slate-300 backdrop-blur-sm"
                  >
                    <badge.icon className="h-3.5 w-3.5 text-cyan-400" />
                    {badge.text}
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="relative w-full hidden md:flex justify-center lg:justify-end items-center"
          >
            <div className="relative w-full max-w-[520px] space-y-6">
              {/* Main image card */}
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-slate-800/50 backdrop-blur-sm">
                <img
                  src={heroImg}
                  alt="Professional technical interview session"
                  className="w-full h-[340px] object-cover"
                  loading="eager"
                />
                <div className="p-4 flex items-center justify-between bg-slate-800/80 border-t border-white/10">
                  <div>
                    <p className="text-sm font-bold text-white">Live Analysis</p>
                    <p className="text-xs text-slate-400">Processing candidate…</p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/20 text-green-400 text-xs font-bold border border-green-500/30">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                    </span>
                    Active
                  </div>
                </div>
              </div>

              {/* KPI Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { icon: Users, value: "2,847", label: "Candidates", color: "cyan" },
                  { icon: Shield, value: "87.3%", label: "Strong Hire", color: "blue" },
                  { icon: TrendingUp, value: "94.2%", label: "Hire Rate", color: "green" },
                  { icon: Clock, value: "24", label: "Active", color: "orange" },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
                    className="bg-slate-800/60 backdrop-blur-sm border border-white/10 p-4 rounded-xl flex items-center gap-3"
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      stat.color === 'cyan' ? 'bg-cyan-500/20 text-cyan-400' :
                      stat.color === 'blue' ? 'bg-blue-500/20 text-blue-400' :
                      stat.color === 'green' ? 'bg-green-500/20 text-green-400' :
                      'bg-orange-500/20 text-orange-400'
                    }`}>
                      <stat.icon size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium">{stat.label}</p>
                      <p className="text-sm font-bold text-white">{stat.value}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
