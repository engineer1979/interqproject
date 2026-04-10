import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import EnhancedNavigation from "@/components/EnhancedNavigation";
import EnhancedFooter from "@/components/EnhancedFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, Clock, FileQuestion, Code, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/SimpleAuthContext";

interface CodingTest {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  duration_minutes: number;
}

const DUMMY_CODING_TESTS: CodingTest[] = [
  { id: "ct_frontend_1", title: "Frontend UI/UX Challenges", description: "Complex scenario-based challenges for React and DOM manipulation.", category: "Frontend", difficulty: "medium", duration_minutes: 25 },
  { id: "ct_backend_1", title: "Backend API Logic", description: "Design scalable API logic and solve performance bottlenecks.", category: "Backend", difficulty: "hard", duration_minutes: 25 },
  { id: "ct_ai_1", title: "AI Model Fine-tuning Scenarios", description: "Answer scenario logic questions on data pipelining and AI optimization.", category: "AI", difficulty: "medium", duration_minutes: 25 },
  { id: "ct_dsa_1", title: "Data Structures & Algorithms", description: "Core algorithm scenario tests utilizing optimal time/space complexity.", category: "Data Structures", difficulty: "hard", duration_minutes: 25 }
];

export default function CodingTests() {
  const navigate = useNavigate();
  const authUser = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", ...Array.from(new Set(DUMMY_CODING_TESTS.map(t => t.category)))];

  const filteredTests = DUMMY_CODING_TESTS.filter((test) =>
    (selectedCategory === "All" || test.category === selectedCategory) &&
    (test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-50">
      <EnhancedNavigation />
      
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Header */}
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-slate-900">
                Coding <span className="text-gradient-brand">Tests</span>
              </h1>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Test your logic and problem-solving skills with 25-minute scenario-based challenges.
              </p>
            </div>

            {/* Coding Tests List */}
            <div className="space-y-6">
              <div className="flex flex-col gap-4 border-b border-slate-200 pb-4">
                <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                  <h3 className="text-2xl font-bold text-slate-900">
                    Available Tests
                    <span className="text-slate-400 text-lg font-normal ml-2">({filteredTests.length})</span>
                  </h3>
                  <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      placeholder="Search topics..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 bg-white border-slate-200 text-slate-900"
                    />
                  </div>
                </div>
                {/* Category Filter Pills */}
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        selectedCategory === cat
                          ? 'bg-cyan-500 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTests.map((test) => (
                  <Card key={test.id} className="group p-6 hover:shadow-lg transition-all duration-300 bg-white border-slate-200 hover:border-cyan-300 cursor-pointer" onClick={() => navigate(`/coding-test/${test.id}`)}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Code className="w-6 h-6 text-cyan-600" />
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide ${
                        test.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                        test.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {test.difficulty}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-1 text-slate-900 group-hover:text-cyan-600 transition-colors">{test.title}</h3>
                    <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 mb-2">{test.category}</span>
                    <p className="text-slate-500 text-sm mb-4 line-clamp-2">
                      {test.description}
                    </p>
                    <div className="flex items-center justify-between text-sm mt-auto border-t border-slate-100 pt-4">
                      <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                        <Clock className="w-4 h-4" />
                        {test.duration_minutes} min / 10 Qs
                      </span>
                      <span className="text-cyan-600 font-bold flex items-center gap-1">
                        Start <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <EnhancedFooter />
    </div>
  );
}
