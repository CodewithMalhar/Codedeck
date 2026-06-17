import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import GitHubContributionGraph from "../components/GitHubContributionGraph";
import SettingsModal from "../components/Dashboard/Settings";
import LinkModal from "../components/Dashboard/LinkAccounts";
import NewBlogModal from "../components/Dashboard/NewBlogModal";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  ResponsiveContainer,
} from "recharts";
import { IconClockHour5, IconQuote, IconUser } from "@tabler/icons-react";

import {
  IconFlame,
  IconCalendarCheck,
  IconTimelineEvent,
  IconArticle,
  IconEye,
} from "@tabler/icons-react";

import {
  IconEdit,
  IconLink,
  IconPencil,
  IconLogout,
} from "@tabler/icons-react";
import LeetCodeHeatmap from "../components/LeetCodeHeatMap";
import Loader from "../components/loader";
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL; 
export default function Dashboard() {
  const { user, logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [heatMapData, setHeatMapData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const closeLinkModal = () => {
    setIsLinkModalOpen(false);
  };

  useEffect(() => {
    if (!user?._id) return;

    const getHeatMapData = async () => {
      const response = await axios.get(`${apiBaseUrl}/blog/contributions/${user._id}`)
      setHeatMapData(response.data);
    }
    getHeatMapData();
  }, [user?._id])

  let initdata = {
    profile: {
      name: "",
      username: "",
      avatar: "",
      ranking: 0,
    },
    badges: {},
    solved: {
      totalsolved: 0,
      easy: 0,
      medium: 0,
      hard: 0,
    },
    contest: {
      totalattended: 0,
      contestRating: 0.0,
      contestGlobalRanking: 0,
    },
  };

  const initCodeforcesData = {
    profile: {
      handle: "",
      avatar: "",
      maxRank: "",
      maxRating: 0,
      currentRating: "Unrated",
      rank: "Unranked",
    },
    contest: {
      contestsParticipated: 0,
      maxRating: 0,
      recentContest: "N/A",
      recentContestRank: "N/A",
      recentContests: [], // New field to store recent contests
    },
    solved: {
      totalSolved: 0,
      problemTags: {},
    },
  };

  const initGeeksforGeeksData = {
    profile: {
      username: "",
      avatar: "default_avatar.png",
      instituteRank: "N/A",
      score: 0,
    },
    solved: {
      totalSolved: 0,
      easy: 0,
      medium: 0,
      hard: 0,
    },
    currentStreak: [],
  };

  const [leetcodedata, setLeetcodedata] = useState(initdata);
  const [codeforcesdata, setCodeforcesData] = useState(initCodeforcesData);
  const [gfgdata, setGeeksforGeeksData] = useState(initGeeksforGeeksData);

  async function getLeetcodeProfile(username) {
    try {
      const response = await axios.get(
        `https://alfa-leetcode-api.onrender.com/${username}`
      );
      console.log("leetcode init");
      const response2 = await axios.get(
        `https://alfa-leetcode-api.onrender.com/${username}/badges`
      );
      const response3 = await axios.get(
        `https://alfa-leetcode-api.onrender.com/${username}/solved`
      );
      const response4 = await axios.get(
        `https://alfa-leetcode-api.onrender.com/${username}/contest`
      );

      console.log("User Profile:", response.data);
      console.log("Badges:", response2.data);
      console.log("Solved:", response3.data);
      console.log("Contest:", response4.data);
      const profileData = response.data;
      const badgesData = response2.data;
      const solvedData = response3.data;
      const contestData = response4.data;

      const newleetcodedata = {
        profile: {
          name: profileData.name,
          username: profileData.username,
          avatar: profileData.avatar,
          ranking: profileData.ranking,
        },
        badges: badgesData,
        solved: {
          totalsolved: solvedData.solvedProblem,
          easy: solvedData.easySolved,
          medium: solvedData.mediumSolved,
          hard: solvedData.hardSolved,
        },
        contest: {
          totalattended: contestData.contestAttend,
          contestRating: contestData.contestRating,
          contestGlobalRanking: contestData.contestGlobalRanking,
        },
      };
      setLeetcodedata(newleetcodedata);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  }

  async function getCodeforcesProfile(handle) {
    try {
      const [response, response2, response3] = await Promise.all([
        axios.get(`https://codeforces.com/api/user.info?handles=${handle}`),
        axios.get(`https://codeforces.com/api/user.rating?handle=${handle}`),
        axios.get(`https://codeforces.com/api/user.status?handle=${handle}`),
      ]);

      const profileData = response.data.result[0];
      const ratingsData = response2.data.result;
      const solvedProblemsData = response3.data.result;

      // Get the last 5 contests or less
      const recentContests = ratingsData.slice(-5).map((contest) => ({
        contestName: contest.contestName,
        rank: contest.rank,
        newRating: contest.newRating,
        oldRating: contest.oldRating,
        change: contest.newRating - contest.oldRating,
      }));

      const newCodeforcesData = {
        profile: {
          handle: profileData.handle,
          avatar: profileData.avatar || "default_avatar.png",
          maxRank: profileData.maxRank,
          maxRating: profileData.maxRating,
          currentRating: profileData.rating || "Unrated",
          rank: profileData.rank || "Unranked",
        },
        contest: {
          contestsParticipated: ratingsData.length,
          maxRating: Math.max(
            ...ratingsData.map((contest) => contest.newRating),
            0
          ),
          recentContest:
            ratingsData[ratingsData.length - 1]?.contestName || "N/A",
          recentContestRank: ratingsData[ratingsData.length - 1]?.rank || "N/A",
          recentContests: recentContests,
        },
        solved: {
          totalSolved: solvedProblemsData.filter(
            (problem) => problem.verdict === "OK"
          ).length,
          problemTags: solvedProblemsData
            .filter((problem) => problem.verdict === "OK")
            .map((problem) => problem.problem.tags)
            .flat()
            .reduce((acc, tag) => {
              acc[tag] = (acc[tag] || 0) + 1;
              return acc;
            }, {}),
        },
      };

      setCodeforcesData(newCodeforcesData);
    } catch (error) {
      console.error("Error fetching Codeforces profile:", error);
    }
  }

  async function getGeeksforGeeksProfile(username) {
    // try {
    // const requestOptions = {
    //     method: "GET",
    //     url: `https://geeks-for-geeks-api.vercel.app/atharvpatil73`
    // };

    // const response = await axios(requestOptions);
    // const profileData = response.data;

    // console.log('GeeksforGeeks Profile:', profileData);

    // const newGeeksforGeeksData = {
    //     profile: {
    //         username: profileData.info.userName,
    //         avatar: profileData.info.profilePicture || 'default_avatar.png',
    //         instituteRank: profileData.info.instituteRank || "N/A",
    //         score: profileData.info.codingScore || 0,
    //     },
    //     solved: {
    //         totalSolved: profileData.totalProblemsSolved,
    //         easy: profileData.solvedStats.easy.count,
    //         medium: profileData.solvedStats.medium.count,
    //         hard: profileData.solvedStats.hard.count,
    //     },
    //     currentStreak: profileData.currentStreak || [],
    // };

    //     setGeeksforGeeksData(newGeeksforGeeksData);
    // } catch (error) {
    //     console.error('Error fetching GeeksforGeeks profile:', error);
    // }
    console.log(
      "GeeksforGeeks API is not working. Please check the API endpoint."
    );

    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(
      "https://geeks-for-geeks-api.vercel.app/atharvpatil73",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  }

  useEffect(() => {
    if (!user?._id) return;

    const loadData = async () => {
      const response = await axios.put(
        `${apiBaseUrl}/portfolio/getupdateportfolio`,
        null,
        { params: { _id: user._id } }
      );
      console.log(response?.data?.lcStats);
      console.log(response?.data?.cfStats);
      setLeetcodedata(response?.data?.lcStats);
      setCodeforcesData(response?.data?.cfStats);
      // getLeetcodeProfile(response?.data?.lcStats);
      // getCodeforcesProfile(response?.data?.cfStats);
      // getGeeksforGeeksProfile("atharvpatil73");
    };
    loadData();
  }, [user?._id]);

  const data = [
    { day: "Mon", value: 480 },
    { day: "Tue", value: 500 },
    { day: "Wed", value: 730 },
    { day: "Thu", value: 750 },
    { day: "Fri", value: 650 },
    { day: "Sat", value: 770 },
    { day: "Sun", value: 920 },
  ];


  const [time, setTime] = useState("");
  const [greeting, setGreeting] = useState("");
  const quotes = [
    "Write. Share. Inspire.",
    "Keep the streak alive 💪",
    "One blog at a time.",
    "Create with purpose ✍️",
    "Digitomize your thoughts!",
  ];
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const mins = now.getMinutes().toString().padStart(2, "0");
      const formattedTime = `${(hours % 12 || 12)}:${mins} ${hours >= 12 ? "PM" : "AM"}`;

      setTime(formattedTime);

      if (hours < 12) setGreeting("Good Morning");
      else if (hours < 18) setGreeting("Good Afternoon");
      else setGreeting("Good Evening");
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // update every minute

    return () => clearInterval(interval);
  }, []);


  if (loading) return <Loader />;
  if (!user) return null;

  return (
      <div className="w-full h-full">
        {isModalOpen && (
          <SettingsModal isOpen={isModalOpen} onRequestClose={closeModal} />
        )}
        {isLinkModalOpen && (
          <LinkModal isOpen={isLinkModalOpen} onRequestClose={closeLinkModal} />
        )}
        {isBlogModalOpen && (
          <NewBlogModal
            isOpen={isBlogModalOpen}
            onRequestClose={() => setIsBlogModalOpen(false)}
          />
        )}

        <div className="pt-24 px-6 md:px-10 pb-10 my-10 grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="w-full md:col-span-3 md:mr-0 md:sticky md:top-28 h-fit">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="bg-[#1a1a1a]/70 backdrop-blur-lg border border-[#2a2a2a] text-gray-300 rounded-t-xl shadow-[0_10px_28px_rgba(0,0,0,0.55)] hover:shadow-[0_22px_48px_rgba(0,0,0,0.7)] ring-2 ring-[#2a2a2a]/70 hover:ring-4 hover:ring-[#5eead4]/40 transition-all duration-300 hover:-translate-y-[3px] hover:scale-[1.02] px-5 py-6 flex flex-col items-center gap-4"
            >

              {/* Profile Pic */}
              <img
                src={user?.profileUrl}
                alt="Profile"
                className="rounded-full w-24 h-24 object-cover border border-[#2bb359]"
              />

              {/* User Info */}
              <div className="text-center space-y-1">
                <p className="text-lg md:text-base font-semibold">{user?.username}</p>
                <p className="text-base md:text-sm text-gray-400">{user?.email}</p>
                <p className="text-base md:text-xs text-gray-500">{user?.bio}</p>
              </div>

              {/* Divider */}
              <div className="h-px w-full bg-[#2a2a2a] my-2"></div>

              {/* Actions */}
              <SidebarAction
                icon={<IconEdit size={16} />}
                label="Edit Profile"
                onClick={() => setIsModalOpen(true)}
                color="text-[#2bb359]"
                bg="bg-[#283a2e]"
              />
              <SidebarAction
                icon={<IconLink size={16} />}
                label="Link Account"
                onClick={() => setIsLinkModalOpen(true)}
                color="text-blue-300"
                bg="bg-[#1f2e2c]"
              />
              <SidebarAction
                icon={<IconPencil size={16} />}
                label="New Blog"
                onClick={() => setIsBlogModalOpen(true)}
                color="text-yellow-200"
                bg="bg-[#2e2a1f]"
              />
              <SidebarAction
                icon={<IconUser size={16} />}
                label="View Public Profile"
                onClick={() => navigate(`/profile/${user?._id}`)}
                color="text-[#5eead4]"
                bg="bg-[#1a2e2e]"
              />
              {/* Uncomment this if you don't have logout elsewhere */}
              {/* <SidebarAction
                    icon={<IconLogout size={16} />}
                    label="Logout"
                    onClick={() => {
                      logout();
                      navigate("/");
                    }}
                    color="text-red-300"
                    bg="bg-[#2a1e1e]"
                  /> */}
            </motion.div>



            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.05 }}
              className="bg-[#1a1a1a]/70 backdrop-blur-lg border border-[#2a2a2a] border-t-0 -mt-px rounded-b-xl rounded-t-none shadow-[0_10px_28px_rgba(0,0,0,0.55)] hover:shadow-[0_22px_48px_rgba(0,0,0,0.7)] ring-2 ring-[#2a2a2a]/70 hover:ring-4 hover:ring-[#5eead4]/40 transition-all duration-300 px-6 py-6 space-y-4"
            >
              <StatRow icon={<IconFlame size={22} />} label="Streak" value="0" />
              <StatRow icon={<IconCalendarCheck size={22} />} label="Active Days" value="0" />
              <StatRow icon={<IconTimelineEvent size={22} />} label="Longest Streak" value="0" />
              <StatRow icon={<IconArticle size={22} />} label="Total Blogs" value={`${user?.blogs? user?.blogs?.length : 0}`} />
              <StatRow icon={<IconEye size={22} />} label="Profile Views" value={`${user?.views? Object.keys(user?.views).length : 0}`} />
            </motion.div>

          </div>

          <div className="w-full md:col-span-9">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
              <GlowCard className="md:col-span-8 min-h-[260px]">
                <SectionTitle icon={<IconUser size={22} className="text-[#5eead4]" />} title={greeting} subtitle="" />
                <p className="text-4xl md:text-5xl text-[#5eead4] mb-1 font-semibold">
                  {greeting},
                </p>
                <p className="text-2xl md:text-4xl text-white font-bold mt-4 flex items-center gap-3">
                  <IconUser size={36} className="text-[#5eead4]" />
                  {/* {user?.username || "Harshvardhan"} 👋 */}
                  {user?.firstname} {user?.lastname}👋
                </p>

                <span className=" flex md:w-1/3 items-center justify-center gap-2 bg-[#12342f] text-white text-lg md:text-xl rounded-full mt-6 px-6 py-2 border border-[#5eead4]">
                  <IconClockHour5 size={22} />
                  {time}
                </span>


                <p className="mt-6 text-gray-400 italic text-base md:text-lg flex items-center gap-2">
                  <IconQuote size={20} className="text-[#5eead4]" />
                  {randomQuote}
                </p>
              </GlowCard>


              <GlowCard className="md:col-span-4 min-h-[260px]">
                <div className="mb-6">
                  <p className="text-2xl md:text-3xl font-semibold text-[#5eead4]">CodeDeck Rank</p>
                  <p className="text-3xl md:text-5xl font-bold text-white">#830</p>
                </div>

                {/* Line Graph */}
                <div className="w-full h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                      {/* Gradient definition */}
                      <defs>
                        <linearGradient id="primaryGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#5eead4" stopOpacity={0.4} />
                          <stop offset="100%" stopColor="#5eead4" stopOpacity={0} />
                        </linearGradient>
                      </defs>

                      <XAxis dataKey="day" stroke="#334155" />
                      <YAxis hide />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1a1a1a",
                          border: "1px solid #5eead4",
                          color: "white",
                          borderRadius: "8px",
                        }}
                        cursor={{ stroke: "#334155", strokeWidth: 1 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#5eead4"
                        strokeWidth={3}
                        dot={{ r: 4, stroke: "#1a1a1a", strokeWidth: 2, fill: "#5eead4" }}
                        activeDot={{ r: 6, stroke: "#5eead4", strokeWidth: 2, fill: "#0b0b0b" }}
                      />
                      {/* Gradient fill area under line */}
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="none"
                        fill="url(#primaryGradient)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* <a
                    href="#"
                    className="mt-6 inline-block bg-[#12342f] border border-[#5eead4] text-white text-lg rounded-full px-6 py-2 hover:bg-[#1f403d] transition duration-300"
                  >
                    View More Stats
                  </a> */}
              </GlowCard>

            </div>
            <div className="space-y-8 mt-6">
              {/* Row 1: Leetcode Card (Full Width) */}
              <GlowCard>
                <h2 className="text-2xl md:text-3xl font-semibold text-yellow-500 mb-3">
                  Leetcode
                </h2>

                {/* Profile Section with Badges Inline */}
                <div className="flex gap-4 items-center mb-6">
                  <img
                    src={leetcodedata?.profile?.avatar}
                    alt="profileImage"
                    className="w-16 h-16 rounded-full border-2 border-yellow-500 shadow-md"
                  />
                  <div className="flex-1">
                    <p className="text-xl font-semibold">
                      {leetcodedata?.profile?.username}
                    </p>
                    <p className="text-gray-400 text-sm">
                      Rank: {leetcodedata?.profile?.ranking}
                    </p>
                  </div>
                  {/* Inline Badges */}
                  <div className="flex gap-3">
                    {leetcodedata?.badges?.badges
                      ?.slice(0, 4)
                      .map((badge, index) => (
                        <img
                          key={index}
                          src={badge.icon}
                          alt={badge.name}
                          className="w-12 h-12"
                          title={badge.displayName}
                        />
                      ))}
                  </div>
                </div>

                {/* Main Content: Pie Chart and Contest Stats Side by Side */}
                <div className="flex gap-8 mt-4">
                  {/* Circular Chart with Total Solved and Difficulty Breakdown */}
                  <div className="flex flex-col items-center w-1/2">
                    <div className="relative w-32 h-32">
                      <svg
                        viewBox="0 0 36 36"
                        className="w-full h-full transform -rotate-90"
                      >
                        <circle
                          className="text-gray-700"
                          strokeWidth="3"
                          stroke="currentColor"
                          fill="transparent"
                          r="16"
                          cx="18"
                          cy="18"
                        />
                        <circle
                          className="text-green-400"
                          strokeWidth="3"
                          strokeDasharray={`${(leetcodedata?.solved?.easy /
                            leetcodedata?.solved?.totalsolved) *
                            100
                            }, 100`}
                          stroke="currentColor"
                          fill="transparent"
                          r="16"
                          cx="18"
                          cy="18"
                          strokeDashoffset="0"
                        />
                        <circle
                          className="text-yellow-400"
                          strokeWidth="3"
                          strokeDasharray={`${(leetcodedata?.solved?.medium /
                            leetcodedata?.solved?.totalsolved) *
                            100
                            }, 100`}
                          stroke="currentColor"
                          fill="transparent"
                          r="16"
                          cx="18"
                          cy="18"
                          strokeDashoffset={`-${(leetcodedata?.solved?.easy /
                            leetcodedata?.solved?.totalsolved) *
                            100
                            }`}
                        />
                        <circle
                          className="text-red-400"
                          strokeWidth="3"
                          strokeDasharray={`${(leetcodedata?.solved?.hard /
                            leetcodedata?.solved?.totalsolved) *
                            100
                            }, 100`}
                          stroke="currentColor"
                          fill="transparent"
                          r="16"
                          cx="18"
                          cy="18"
                          strokeDashoffset={`-${((leetcodedata?.solved?.easy +
                            leetcodedata?.solved?.medium) /
                            leetcodedata?.solved?.totalsolved) *
                            100
                            }`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                        <p className="font-bold text-xl">
                          {leetcodedata?.solved?.totalsolved}
                        </p>
                        <p className="text-xs text-gray-400">Total Solved</p>
                      </div>
                    </div>
                    <div className="flex gap-4 mt-4 text-xs bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2 text-gray-200">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-green-400"></span>
                        <p className="whitespace-nowrap">Easy</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                        <p className="whitespace-nowrap">Medium</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-red-400"></span>
                        <p className="whitespace-nowrap">Hard</p>
                      </div>
                    </div>
                  </div>

                  {/* Contest Info Section */}
                  <div className="bg-[#222222]/80 backdrop-blur-md border border-[#2a2a2a] rounded-lg py-6 px-4 w-1/2 text-xs text-gray-300 shadow-[0_10px_24px_rgba(0,0,0,0.4)] hover:shadow-[0_18px_34px_rgba(0,0,0,0.55)] transition-all duration-300">
                    <p className="font-semibold text-lg md:text-xl text-yellow-500 mb-4">
                      Contest Stats
                    </p>
                    <div className="flex flex-col space-y-4 text-md">
                      <div className="flex justify-between items-center font-bold">
                        <p>Total Attended</p>
                        <span className="mx-1 text-yellow-500">
                          {leetcodedata?.contest?.totalattended}
                        </span>
                      </div>
                      <div className="flex justify-between items-center font-bold">
                        <p>Rating</p>
                        <span className="mx-1 text-yellow-500">
                          {leetcodedata?.contest?.contestRating}
                        </span>
                      </div>
                      <div className="flex justify-between items-center font-bold">
                        <p>Global Rank</p>
                        <span className="mx-1 text-yellow-500">
                          {leetcodedata?.contest?.contestGlobalRanking}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </GlowCard>

              {/* Row 2: Codeforces Card */}
              <GlowCard>
                <h2 className="text-2xl md:text-3xl font-semibold text-blue-500 mb-4">
                  Codeforces
                </h2>

                {/* Profile Section */}
                <div className="flex gap-4 items-center mb-6">
                  <img
                    src={codeforcesdata?.profile?.avatar}
                    alt="profileImage"
                    className="w-16 h-16 rounded-full shadow-md border-2 border-blue-500"
                  />
                  <div>
                    <p className="text-xl font-semibold">
                      {codeforcesdata?.profile?.handle}
                    </p>
                    <p className="text-gray-400 text-sm">
                      Rank: {codeforcesdata?.profile?.rank}
                    </p>
                    <p className="text-gray-400 text-sm">
                      Max Rating: {codeforcesdata?.profile?.maxRating}
                    </p>
                  </div>
                </div>

                {/* Contest Stats */}
                <div className="bg-[#222222]/80 backdrop-blur-md rounded-lg py-4 px-3 text-sm text-gray-300 shadow-[0_10px_24px_rgba(0,0,0,0.4)] hover:shadow-[0_18px_34px_rgba(0,0,0,0.55)] transition-all duration-300 border border-[#2a2a2a]">
                  <p className="font-semibold text-lg md:text-xl text-blue-500 mb-4">
                    Contest Stats
                  </p>
                  <div className="flex flex-col space-y-4 text-md">
                    <div className="flex justify-between items-center font-bold">
                      <p>Contests Participated</p>
                      <span className="text-blue-500">
                        {codeforcesdata?.contest?.contestsParticipated}
                      </span>
                    </div>
                    <div className="flex justify-between items-center font-bold">
                      <p>Recent Contest</p>
                      <span className="text-blue-500">
                        {codeforcesdata?.contest?.recentContest}
                      </span>
                    </div>
                    <div className="flex justify-between items-center font-bold">
                      <p>Recent Rank</p>
                      <span className="text-blue-500">
                        {codeforcesdata?.contest?.recentContestRank}
                      </span>
                    </div>
                    <div className="flex justify-between items-center font-bold">
                      <p>Max Rating</p>
                      <span className="text-blue-500">
                        {codeforcesdata?.contest?.maxRating}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Total Solved Problems & Problem Tags */}
                <div className="my-4">
                  <p className="text-xl font-semibold text-gray-300">
                    Total Solved:{" "}
                    <span className="text-blue-400">
                      {codeforcesdata?.solved?.totalSolved}
                    </span>
                  </p>
                  <p className="font-semibold text-gray-200 mb-2">
                    Problem Tags:
                  </p>
                  <div className="flex flex-wrap gap-3 text-sm">
                    {Object.entries(
                      codeforcesdata?.solved?.problemTags || {}
                    ).map(([tag, count], index) => (
                      <span
                        key={index}
                        className="bg-[#1e293b] text-blue-400 px-3 py-2 rounded-full shadow-sm transition-colors duration-200 hover:bg-[#24364a]"
                      >
                        {tag} x{count}
                      </span>
                    ))}
                  </div>
                </div>
              </GlowCard>

              {/* Row 3: GeeksforGeeks Card */}
              {/* <div className="bg-[#1a1a1a] rounded-xl shadow-lg p-6 w-full overflow-auto text-white">
                <h2 className="text-2xl font-bold text-green-500 mb-3">
                  GeeksforGeeks
                </h2> */}

              {/* Profile Section */}
              {/* <div className="flex gap-4 items-center mb-6">
                  <img
                    src={gfgdata?.profile?.avatar}
                    alt="profileImage"
                    className="w-16 h-16 rounded-full shadow-md border-2 border-green-500"
                  />
                  <div>
                    <p className="text-xl font-semibold">
                      {gfgdata?.profile?.username}
                    </p>
                    <p className="text-gray-400 text-sm">
                      Rank: {gfgdata?.profile?.ranking}
                    </p>
                  </div>
                </div> */}

              {/* Stats Section */}
              {/* <div className="bg-[#222222] rounded-lg py-4 px-3 text-sm text-gray-300 shadow-md">
                  <p className="font-semibold text-lg text-green-500 mb-4">
                    Stats
                  </p>
                  <div className="flex flex-col space-y-4 text-md">
                    <div className="flex justify-between items-center font-bold">
                      <p>Total Problems Solved</p>
                      <span className="text-green-500">
                        {gfgdata?.stats?.totalSolved}
                      </span>
                    </div>
                    <div className="flex justify-between items-center font-bold">
                      <p>Level of Expertise</p>
                      <span className="text-green-500">
                        {gfgdata?.stats?.expertiseLevel}
                      </span>
                    </div>
                  </div>
                </div> */}

              {/* Tags Section */}
              {/* <div className="my-4">
                  <p className="text-xl font-semibold text-gray-300">
                    Popular Tags:
                  </p>
                  <div className="flex flex-wrap gap-3 text-sm">
                    {gfgdata?.tags?.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-[#1e293b] text-green-400 px-3 py-2 rounded-full shadow-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div> */}
              {/* </div> */}
            </div>

            {/* <GitHubContributionGraph data={heatMapData} /> */}
            <LeetCodeHeatmap username={user.lcUsername} />
          </div>
        </div>
      </div>
    );
}

// 👇 Below component for cleaner layout
const StatRow = ({ icon, label, value }) => (
  <div className="flex items-center justify-between hover:bg-[#222] px-4 py-2 rounded-md transition duration-200 group">
    <div className="flex items-center space-x-3 text-white">
      <div className="text-[#5eead4] group-hover:text-[#3dd1bc]">{icon}</div>
      <span className="text-sm">{label}</span>
    </div>
    <span className="text-gray-400 font-mono">{value}</span>
  </div>
);


// 👇 Component for Reusability
const SidebarAction = ({ icon, label, onClick, color, bg }) => (
  <p
    className={`flex items-center gap-2 justify-center w-full text-sm font-medium py-2 px-4 rounded-md cursor-pointer shadow-[0_2px_10px_rgba(0,0,0,0.3)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.45)] active:translate-y-[1px] transition-all duration-200 hover:opacity-90 ${bg} ${color}`}
    onClick={onClick}
  >
    {icon}
    {label}
  </p>
);

// Futuristic glowing card with animated border and glassmorphism
const GlowCard = ({ className = "", children }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className={`relative ${className}`}
  >
    <div className="p-[1.5px] rounded-2xl bg-gradient-to-br from-[#5eead4]/35 via-transparent to-yellow-400/25 animate-[pulse_6s_ease-in-out_infinite] h-full">
      <div className="rounded-2xl bg-[#111111]/80 backdrop-blur-xl border border-[#2a2a2a] shadow-[0_10px_28px_rgba(0,0,0,0.55)] hover:shadow-[0_22px_48px_rgba(0,0,0,0.7)] ring-2 ring-[#2a2a2a]/70 hover:ring-4 hover:ring-[#5eead4]/40 transition-all duration-300 hover:-translate-y-[3px] hover:scale-[1.015] p-6 h-full">
        {children}
      </div>
    </div>
  </motion.div>
);

const SectionTitle = ({ icon, title, subtitle }) => (
  <div className="flex items-center gap-3 mb-2">
    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#5eead4]/10 ring-1 ring-[#5eead4]/40">
      {icon}
    </span>
    <div>
      <p className="text-sm text-gray-400 tracking-wide">{subtitle}</p>
      <h3 className="text-xl font-semibold text-white">{title}</h3>
    </div>
  </div>
);