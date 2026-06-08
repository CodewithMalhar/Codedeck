import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import preparationData from "../json/preparationData.json";
import {
  IconRocket,
  IconCode,
  IconTrophy,
  IconBulb,
  IconBook,
  IconTools,
  IconChevronDown,
  IconChevronUp,
  IconExternalLink,
  IconUsers,
  IconClock,
  IconTarget,
} from "@tabler/icons-react";

const Preparation = () => {
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [expandedTip, setExpandedTip] = useState(null);

  useEffect(() => {
    document.title = "Preparation | CodeDeck";
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "hard":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <div className="min-h-screen text-white">
      {/* Hero Section */}
      <section className="relative pt-28 pb-8 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#5eead4]/10 to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-[#5eead4]/10 border border-[#5eead4]/30 rounded-full px-4 py-2 mb-6">
              <IconRocket size={20} className="text-[#5eead4]" />
              <span className="text-sm text-[#5eead4]">Level Up Your Skills</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
              Prepare for{" "}
              <span className="bg-gradient-to-r from-[#5eead4] to-[#2dd4bf] bg-clip-text text-transparent">
                Contests
              </span>{" "}
              &{" "}
              <span className="bg-gradient-to-r from-[#2dd4bf] to-[#5eead4] bg-clip-text text-transparent">
                Hackathons
              </span>
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
              Sharpen your problem-solving skills and get ready to ace coding
              competitions with our comprehensive preparation resources.
            </p>
            <button
              onClick={() => scrollToSection("dsa-section")}
              className="bg-[#5eead4] text-black px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#2dd4bf] transition-all duration-300 shadow-[0_0_30px_rgba(94,234,212,0.3)] hover:shadow-[0_0_40px_rgba(94,234,212,0.5)] active:scale-95"
            >
              Start Practicing
            </button>
          </motion.div>
        </div>
      </section>

      {/* DSA Preparation Section */}
      <section id="dsa-section" className="px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <IconCode size={32} className="text-[#5eead4]" />
            <h2 className="text-4xl font-bold">DSA Preparation</h2>
          </div>
          <p className="text-gray-400 mb-6 text-lg">
            Master data structures and algorithms topic by topic
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
            {preparationData.topics.map((topic, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-[#1a1a1a] border rounded-xl overflow-visible transition-all duration-500 ${
                  expandedTopic === index
                    ? 'border-[#5eead4] border-b-0 rounded-b-none shadow-2xl shadow-[#5eead4]/30 z-[9999] transform scale-[1.02]'
                    : 'border-[#2a2a2a] hover:border-[#5eead4]/50 z-0'
                }`}
                style={{ 
                  minHeight: expandedTopic === index ? 'auto' : 'fit-content',
                  height: expandedTopic === index ? 'auto' : 'fit-content',
                  position: expandedTopic === index ? 'relative' : 'relative',
                  marginBottom: expandedTopic === index ? '20px' : '0px'
                }}
              >
                <div
                  className="p-6 cursor-pointer hover:bg-[#1f1f1f]/30 transition-colors duration-300"
                  onClick={() => setExpandedTopic(expandedTopic === index ? null : index)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-2xl font-semibold text-[#5eead4]">
                      {topic.name}
                    </h3>
                    {expandedTopic === index ? (
                      <IconChevronUp size={24} className="text-[#5eead4] transition-colors duration-300" />
                    ) : (
                      <IconChevronDown size={24} className="text-gray-400 transition-colors duration-300" />
                    )}
                  </div>
                  <p className="text-gray-400">{topic.summary}</p>
                </div>

                {expandedTopic === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="absolute top-full -left-px -right-px z-[9999] px-6 pb-6 space-y-4 bg-[#1a1a1a] border-l border-r border-b border-[#5eead4] rounded-b-xl shadow-2xl shadow-[#5eead4]/20"
                  >
                    {topic.problems.map((problem, pIndex) => (
                      <div
                        key={pIndex}
                        className="p-4 bg-[#222222] rounded-lg border border-[#2a2a2a] hover:border-[#5eead4]/30 transition-all duration-200"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-lg font-semibold text-white">
                            {problem.title}
                          </h4>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(
                              problem.difficulty
                            )}`}
                          >
                            {problem.difficulty}
                          </span>
                        </div>
                        
                        <div className="mb-3">
                          <p className="text-sm text-gray-400 mb-1 font-medium">
                            💡 Approach:
                          </p>
                          <p className="text-sm text-gray-300 leading-relaxed">
                            {problem.approach}
                          </p>
                        </div>

                        <a
                          href={problem.youtubeLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 rounded-lg text-red-400 text-sm font-medium transition-all duration-200 group"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                          </svg>
                          Watch Solution
                          <IconExternalLink
                            size={14}
                            className="group-hover:translate-x-1 transition-transform"
                          />
                        </a>
                      </div>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mock Contests Section */}
      <section className="py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <IconTrophy size={32} className="text-[#5eead4]" />
            <h2 className="text-4xl font-bold">Mock Contests</h2>
          </div>
          <p className="text-gray-400 mb-8 text-lg">
            Practice with timed contests to simulate real competition experience
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {preparationData.mockContests.map((contest, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 hover:border-[#5eead4]/50 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white">
                    {contest.name}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(
                      contest.difficulty
                    )}`}
                  >
                    {contest.difficulty}
                  </span>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-gray-400">
                    <IconClock size={18} />
                    <span>{contest.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <IconTarget size={18} />
                    <span>{contest.problems} Problems</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <IconUsers size={18} />
                    <span>{contest.participants.toLocaleString()} Participants</span>
                  </div>
                </div>

                <button className="w-full bg-[#5eead4] text-black py-3 rounded-lg font-semibold hover:bg-[#2dd4bf] transition-all duration-300 active:scale-95">
                  Start Contest
                </button>
              </motion.div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-[#5eead4]/10 to-[#2dd4bf]/10 border border-[#5eead4]/30 rounded-xl p-6 text-center">
            <h3 className="text-2xl font-bold mb-3">Create Your Own Contest</h3>
            <p className="text-gray-400 mb-6">
              Challenge your friends or community with custom problem sets
            </p>
            <button className="bg-[#5eead4] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#2dd4bf] transition-all duration-300 active:scale-95">
              Coming Soon
            </button>
          </div>
        </div>
      </section>

      {/* Hackathon Zone Section */}
      <section className="py-2 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <IconBulb size={32} className="text-[#5eead4]" />
            <h2 className="text-4xl font-bold">Hackathon Zone</h2>
          </div>
          <p className="text-gray-400 mb-8 text-lg">
            Get inspired and build winning projects
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 hover:border-[#5eead4]/50 transition-all duration-300">
              <div className="w-12 h-12 bg-[#5eead4]/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">💡</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Top Hackathon Ideas</h3>
              <p className="text-gray-400 mb-4">
                Explore trending project ideas that judges love
              </p>
              <button className="text-[#5eead4] hover:text-[#2dd4bf] font-medium flex items-center gap-2">
                Explore Ideas <IconExternalLink size={16} />
              </button>
            </div>

            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 hover:border-[#5eead4]/50 transition-all duration-300">
              <div className="w-12 h-12 bg-[#5eead4]/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Build a Winning Project
              </h3>
              <p className="text-gray-400 mb-4">
                Learn strategies to create impressive hackathon submissions
              </p>
              <button className="text-[#5eead4] hover:text-[#2dd4bf] font-medium flex items-center gap-2">
                Learn More <IconExternalLink size={16} />
              </button>
            </div>

            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 hover:border-[#5eead4]/50 transition-all duration-300">
              <div className="w-12 h-12 bg-[#5eead4]/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🔌</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">
                API Resources
              </h3>
              <p className="text-gray-400 mb-4">
                Discover free APIs to supercharge your hackathon projects
              </p>
              <button className="text-[#5eead4] hover:text-[#2dd4bf] font-medium flex items-center gap-2">
                View APIs <IconExternalLink size={16} />
              </button>
            </div>
          </div>

          {/* Idea Bank */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-6">💡 Idea Bank</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {preparationData.hackathonIdeas.map((idea, index) => (
                <div
                  key={index}
                  className="bg-[#222222] rounded-lg p-5 hover:bg-[#2a2a2a] transition-all duration-200"
                >
                  <h4 className="text-lg font-semibold mb-2 text-[#5eead4]">
                    {idea.title}
                  </h4>
                  <p className="text-gray-400 text-sm mb-3">
                    {idea.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {idea.tags.map((tag, tIndex) => (
                      <span
                        key={tIndex}
                        className="px-2 py-1 bg-[#5eead4]/10 text-[#5eead4] rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <IconBook size={32} className="text-[#5eead4]" />
            <h2 className="text-4xl font-bold">Problem-Solving Tips</h2>
          </div>
          <p className="text-gray-400 mb-8 text-lg">
            Master the art of tackling coding challenges
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {preparationData.tips.map((tip, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden hover:border-[#5eead4]/50 transition-all duration-300"
              >
                <div
                  className="p-6 cursor-pointer"
                  onClick={() =>
                    setExpandedTip(expandedTip === index ? null : index)
                  }
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-semibold text-white">
                      {tip.title}
                    </h3>
                    {expandedTip === index ? (
                      <IconChevronUp size={24} className="text-gray-400" />
                    ) : (
                      <IconChevronDown size={24} className="text-gray-400" />
                    )}
                  </div>
                </div>

                {expandedTip === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-6 pb-6"
                  >
                    <ul className="space-y-3">
                      {tip.points.map((point, pIndex) => (
                        <li
                          key={pIndex}
                          className="flex items-start gap-3 text-gray-400"
                        >
                          <span className="text-[#5eead4] mt-1">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Roadmaps Section */}
      <section className="py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <IconTarget size={32} className="text-[#5eead4]" />
            <h2 className="text-4xl font-bold">Learning Roadmaps</h2>
          </div>
          <p className="text-gray-400 mb-8 text-lg">
            Follow structured paths to achieve your goals
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {preparationData.roadmaps.map((roadmap, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 hover:border-[#5eead4]/50 transition-all duration-300"
              >
                <h3 className="text-2xl font-semibold mb-3 text-[#5eead4]">
                  {roadmap.title}
                </h3>
                <p className="text-gray-400 mb-6">{roadmap.description}</p>

                <div className="space-y-4">
                  {roadmap.milestones.map((milestone, mIndex) => (
                    <div key={mIndex}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-300">
                          {milestone.name}
                        </span>
                        <span className="text-sm text-[#5eead4] font-medium">
                          {milestone.progress}%
                        </span>
                      </div>
                      <div className="w-full bg-[#222222] rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-[#5eead4] to-[#2dd4bf] h-full rounded-full transition-all duration-500"
                          style={{ width: `${milestone.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Resources & Tools Section */}
      <section className="py-2 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <IconTools size={32} className="text-[#5eead4]" />
            <h2 className="text-4xl font-bold">Resources & Tools</h2>
          </div>
          <p className="text-gray-400 mb-6 text-lg">
            Essential tools and platforms for your coding journey
          </p>

          <div className="space-y-6">
            {preparationData.resources.map((category, index) => (
              <div key={index}>
                <h3 className="text-2xl font-semibold mb-4 text-white">
                  {category.category}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                  {category.items.map((item, iIndex) => (
                    <a
                      key={iIndex}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 hover:border-[#5eead4]/50 hover:bg-[#222222] transition-all duration-300 group text-center"
                    >
                      <div className="text-4xl mb-3">{item.icon}</div>
                      <h4 className="text-lg font-semibold text-white group-hover:text-[#5eead4] transition-colors">
                        {item.name}
                      </h4>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-6 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Level Up?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Start your preparation journey today and become a competitive
            programming champion!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => scrollToSection("dsa-section")}
              className="bg-[#5eead4] text-black px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#2dd4bf] transition-all duration-300 shadow-[0_0_30px_rgba(94,234,212,0.3)] active:scale-95"
            >
              Start Practicing Now
            </button>
            <button className="border border-[#5eead4] text-[#5eead4] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#5eead4]/10 transition-all duration-300 active:scale-95">
              View All Contests
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Preparation;
