import { useContext, useEffect, useState } from 'react'
import { HeroCard } from '../test/HeroCard'
import { AuthContext } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'js-cookie'
import { 
  IconArrowDown, 
  IconSparkles,
  IconChevronRight
} from '@tabler/icons-react'

export default function HeroSection() {
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [charIndex, setCharIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    
    const rotatingTexts = [
        "Empowering the next generation of developers.",
        "Join a global community of coders.",
        "Collaborate. Code. Conquer.",
        "Build. Learn. Excel."
    ];
    
    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            localStorage.setItem('token', token);
        }
        setIsVisible(true);
    }, []);


    // Enhanced typing animation effect
    useEffect(() => {
        const currentText = rotatingTexts[currentTextIndex];
        
        const typingSpeed = isDeleting ? 30 : 80;
        const pauseTime = isDeleting ? 500 : 2000;
        
        const timer = setTimeout(() => {
            if (!isDeleting && charIndex < currentText.length) {
                setDisplayedText(currentText.substring(0, charIndex + 1));
                setCharIndex(charIndex + 1);
            } else if (!isDeleting && charIndex === currentText.length) {
                setTimeout(() => setIsDeleting(true), pauseTime);
            } else if (isDeleting && charIndex > 0) {
                setDisplayedText(currentText.substring(0, charIndex - 1));
                setCharIndex(charIndex - 1);
            } else if (isDeleting && charIndex === 0) {
                setIsDeleting(false);
                setCurrentTextIndex((prevIndex) => (prevIndex + 1) % rotatingTexts.length);
            }
        }, typingSpeed);

        return () => clearTimeout(timer);
    }, [charIndex, isDeleting, currentTextIndex]);

    return (
        <div className='relative min-h-screen w-full overflow-hidden'>
            {/* Exact Background Match */}
            <div className="absolute inset-0" style={{
                '--s': '70px',
                '--_g': '#000000cc 90deg, #133732 0',
                background: 'conic-gradient(from 90deg at 1px 1px, var(--_g)), conic-gradient(from 90deg at 1px 1px, var(--_g))',
                backgroundSize: 'var(--s) var(--s)'
            }}></div>

            {/* Main Content */}
            <div className={`relative z-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="max-w-8xl mx-auto px-14 py-36 pl-20 pr-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
                        
                        {/* Left Content */}
                        <div className="space-y-8 max-w-2xl">
                            {/* Badge */}
                            {/* <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2 text-emerald-400 text-sm font-medium">
                                <IconSparkles className="w-4 h-4" />
                                <span>Join 10,000+ developers worldwide</span>
                            </div> */}

                            {/* Main Heading */}
                            <div className="space-y-6">
                                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                                    <span className="block">Your Journey from</span>
                                    <span className="block bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent leading-tight" style={{WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: '1.3'}}>
                                         Beginner to Pro
                                    </span>
                                    <span className="block">Starts Here</span>
                                </h1>
                                
                                {/* Typing Animation */}
                                <div className="text-2xl md:text-3xl text-gray-300 font-medium min-h-[2rem] flex items-center">
                                    <span className="inline-block">
                                        {displayedText}
                                        <span className="animate-pulse text-emerald-400 ml-1">|</span>
                                    </span>
                                </div>
                            </div>

                            {/* Description */}
                            <p className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-2xl">
                                Discover events, track your progress, and level up your skills with real-time insights, 
                                personalized portfolios, and a thriving community of passionate developers.
                            </p>

                            {/* CTA Button */}
                            <div className="flex justify-start">
                                <GetStarted />
                            </div>
                        </div>

                        {/* Right Content */}
                        <div className="relative max-w-2xl mx-auto lg:mx-0">
                            {/* Hero Card with Enhanced Effects */}
                            <div className="relative group">
                                {/* Glow Effect */}
                                <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                                
                                {/* Card */}
                                <div className="relative bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 hover:border-gray-600/50 transition-all duration-500">
                                    <HeroCard />
                                </div>
                                
                                {/* Floating Elements */}
                                <div className="absolute -top-4 -right-4 w-8 h-8 bg-emerald-400 rounded-full animate-bounce"></div>
                                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-blue-400 rounded-full animate-bounce delay-1000"></div>
                            </div>

                            {/* Floating Code Snippets */}
                            <div className="absolute top-10 -left-10 bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-lg p-3 text-xs text-gray-300 font-mono animate-pulse">
                                <div className="text-emerald-400">const</div>
                                <div className="text-blue-400">developer</div>
                                <div className="text-purple-400">=</div>
                                <div className="text-yellow-400">"awesome"</div>
                            </div>
                            
                            <div className="absolute bottom-10 -right-10 bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-lg p-3 text-xs text-gray-300 font-mono animate-pulse delay-1000">
                                <div className="text-emerald-400">if</div>
                                <div className="text-blue-400">(passion)</div>
                                <div className="text-purple-400">{`{`}</div>
                                <div className="text-yellow-400 ml-4">success()</div>
                                <div className="text-purple-400">{`}`}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <div className="flex flex-col items-center space-y-2 text-gray-400">
                        <span className="text-sm">Scroll to explore</span>
                        <IconArrowDown className="w-5 h-5" />
                    </div>
                </div>
            </div>

        </div>
    )
}

function GetStarted() {
    const {user} = useContext(AuthContext)
    return (
        <Link
            to={user ? '/dashboard' : '/login'}
            className="group relative inline-flex items-center justify-center space-x-3 px-10 py-5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white font-bold text-lg rounded-xl overflow-hidden transition-all duration-500 transform hover:scale-110 hover:shadow-2xl hover:shadow-emerald-500/50 active:scale-95"
        >
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Shimmer Effect */}
            <div className="absolute inset-0 -top-2 -left-2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            
            {/* Ripple Effect */}
            <div className="absolute inset-0 rounded-xl bg-white/20 scale-0 group-active:scale-100 transition-transform duration-300"></div>
            
            {/* Button Content */}
            <span className="relative z-10 group-hover:tracking-wider transition-all duration-300">Get Started</span>
            <IconChevronRight className="relative z-10 w-6 h-6 group-hover:translate-x-2 group-hover:rotate-12 transition-all duration-300" />
            
            {/* Floating Particles */}
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300"></div>
            <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-emerald-200 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping delay-150 transition-opacity duration-300"></div>
            
            {/* Glow Effect */}
            <div className="absolute inset-0 rounded-xl bg-emerald-400/30 blur-xl scale-0 group-hover:scale-110 transition-all duration-500 -z-10"></div>
        </Link>
    )
}