import React, { useState } from 'react';
import { Feather } from 'lucide-react';

export default function Onboarding({ isDark, onComplete }) {
    const [selectedTopics, setSelectedTopics] = useState([]);

    const topicCategories = [
        {
            category: 'Technology',
            topics: [
                'Technology', 'AI', 'Artificial Intelligence', 'Cybersecurity', 'AWS',
                'Machine Learning', 'ChatGPT', 'UX', 'UX Design', 'Android',
                'iOS', 'Apple', 'AI Agent', 'Future Tech', 'Tech', 'Kubernetes',
                'Web Development', 'Cloud Computing', 'DevOps', 'Data Science'
            ]
        },
        {
            category: 'Programming',
            topics: [
                'Programming', 'Data Science', 'Software Development', 'Python',
                'JavaScript', 'React', 'Node.js', 'Java', 'C++', 'Rust',
                'Go', 'TypeScript', 'PHP', 'Ruby', 'Swift', 'Kotlin'
            ]
        },
        {
            category: 'Business & Finance',
            topics: [
                'Business', 'Entrepreneurship', 'Startup', 'Finance', 'Investing',
                'Marketing', 'Sales', 'Leadership', 'Management', 'Economics',
                'Cryptocurrency', 'Blockchain', 'Stock Market', 'Real Estate'
            ]
        },
        {
            category: 'Health & Wellness',
            topics: [
                'Health', 'Fitness', 'Mental Health', 'Nutrition', 'Wellness',
                'Meditation', 'Yoga', 'Self-Care', 'Psychology', 'Mindfulness',
                'Exercise', 'Diet', 'Sleep', 'Stress Management'
            ]
        },
        {
            category: 'Creative & Arts',
            topics: [
                'Writing', 'Design', 'Photography', 'Art', 'Music',
                'Film', 'Literature', 'Poetry', 'Creative Writing', 'Drawing',
                'Painting', 'Illustration', 'Animation', 'Video Production'
            ]
        },
        {
            category: 'Lifestyle',
            topics: [
                'Travel', 'Food', 'Fashion', 'Lifestyle', 'Productivity',
                'Personal Development', 'Relationships', 'Parenting', 'Home',
                'Cooking', 'Beauty', 'Sports', 'Gaming', 'Books'
            ]
        }
    ];

    const toggleTopic = (topic) => {
        setSelectedTopics(prev =>
            prev.includes(topic)
                ? prev.filter(t => t !== topic)
                : [...prev, topic]
        );
    };

    const handleContinue = () => {
        if (selectedTopics.length >= 3) {
            // Save preferences to localStorage
            localStorage.setItem('userTopics', JSON.stringify(selectedTopics));
            localStorage.setItem('onboardingComplete', 'true');
            onComplete(selectedTopics);
        }
    };

    return (
        <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-white'} flex items-center justify-center p-6`}>
            <div className="max-w-4xl w-full">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            {/* Animated atom-like icon */}
                            <div className="relative w-32 h-32">
                                <Feather className={`w-32 h-32 ${isDark ? 'text-scribe-sage' : 'text-scribe-green'} animate-pulse`} />
                                {/* Orbiting dots */}
                                <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
                                    <div className="absolute top-0 left-1/2 w-2 h-2 bg-scribe-mint rounded-full -translate-x-1/2"></div>
                                </div>
                                <div className="absolute inset-0 animate-spin" style={{ animationDuration: '4s', animationDirection: 'reverse' }}>
                                    <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-scribe-sage rounded-full -translate-x-1/2"></div>
                                </div>
                                <div className="absolute inset-0 animate-spin" style={{ animationDuration: '5s' }}>
                                    <div className="absolute top-1/2 right-0 w-2 h-2 bg-scribe-green rounded-full -translate-y-1/2"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        What would you like to read?
                    </h1>
                    <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Choose {selectedTopics.length >= 3 ? selectedTopics.length : '3'} topics or more to continue.
                    </p>
                </div>

                {/* Topics Grid */}
                <div className="space-y-8 mb-12">
                    {topicCategories.map((category, idx) => (
                        <div key={idx}>
                            <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                {category.category}
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {category.topics.map((topic, topicIdx) => (
                                    <button
                                        key={topicIdx}
                                        onClick={() => toggleTopic(topic)}
                                        className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${selectedTopics.includes(topic)
                                                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 scale-105 shadow-lg'
                                                : isDark
                                                    ? 'bg-slate-800 text-gray-300 hover:bg-slate-700 border border-slate-700'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                                            }`}
                                    >
                                        {topic}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Continue Button */}
                <div className="flex justify-center">
                    <button
                        onClick={handleContinue}
                        disabled={selectedTopics.length < 3}
                        className={`px-12 py-4 rounded-full text-lg font-semibold transition-all duration-300 ${selectedTopics.length >= 3
                                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 hover:scale-105 shadow-xl cursor-pointer'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        Continue {selectedTopics.length >= 3 && `(${selectedTopics.length} selected)`}
                    </button>
                </div>

                {/* Progress indicator */}
                {selectedTopics.length > 0 && selectedTopics.length < 3 && (
                    <p className={`text-center mt-4 text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        Select {3 - selectedTopics.length} more topic{3 - selectedTopics.length !== 1 ? 's' : ''} to continue
                    </p>
                )}
            </div>
        </div>
    );
}
