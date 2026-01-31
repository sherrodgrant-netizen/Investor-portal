"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [propertiesContract, setPropertiesContract] = useState(0);
  const [propertiesClosed, setPropertiesClosed] = useState(0);

  const targetPropertiesContract = 5;
  const targetPropertiesClosed = 12;

  // Animated counter effect
  useEffect(() => {
    setMounted(true);

    const animateValue = (
      setter: (value: number) => void,
      target: number,
      duration: number
    ) => {
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const value = Math.floor(progress * target);
        setter(value);
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      animate();
    };

    setTimeout(() => {
      animateValue(setPropertiesContract, targetPropertiesContract, 1500);
      animateValue(setPropertiesClosed, targetPropertiesClosed, 1500);
    }, 300);
  }, []);

  const summaryCards = [
    {
      title: "Properties Under Contract",
      value: propertiesContract,
      target: targetPropertiesContract,
      description: "Properties currently in contract",
      icon: "📝",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Properties Closed",
      value: propertiesClosed,
      target: targetPropertiesClosed,
      description: "Successfully closed properties",
      icon: "✅",
      gradient: "from-green-500 to-emerald-500",
    },
  ];

  const salesAgent = {
    name: "Sarah Johnson",
    email: "sarah.johnson@diamondacquisitions.com",
    phone: "(512) 555-0123",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
  };

  // Gamification: Investment Progress
  const totalInvestmentGoal = 20;
  const currentInvestments = targetPropertiesContract + targetPropertiesClosed;
  const progressPercentage = (currentInvestments / totalInvestmentGoal) * 100;

  // Achievement badges
  const achievements = [
    { name: "First Investment", icon: "🌟", unlocked: true },
    { name: "5 Properties", icon: "🏆", unlocked: currentInvestments >= 5 },
    { name: "10 Properties", icon: "💎", unlocked: currentInvestments >= 10 },
    { name: "20 Properties", icon: "👑", unlocked: currentInvestments >= 20 },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header with fade-in animation */}
      <div
        className={`transition-all duration-700 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        }`}
      >
        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600 mt-2">
          Welcome to your investor dashboard overview
        </p>
      </div>

      {/* Investment Progress Section - Gamified */}
      <div
        className={`transition-all duration-700 delay-100 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        }`}
      >
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Investment Journey</h3>
            <span className="text-2xl">🚀</span>
          </div>
          <div className="mb-3">
            <div className="flex justify-between text-sm mb-2">
              <span>
                {currentInvestments} of {totalInvestmentGoal} properties
              </span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-white bg-opacity-30 rounded-full h-4 overflow-hidden">
              <div
                className="bg-white h-full rounded-full transition-all duration-1000 ease-out shadow-lg"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
          <p className="text-sm opacity-90">
            {totalInvestmentGoal - currentInvestments} more to reach your goal!
          </p>
        </div>
      </div>

      {/* Achievement Badges */}
      <div
        className={`transition-all duration-700 delay-200 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        }`}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Achievements
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {achievements.map((achievement, index) => (
            <div
              key={achievement.name}
              className={`bg-white rounded-lg shadow-md p-4 border-2 text-center transition-all duration-500 ${
                achievement.unlocked
                  ? "border-blue-400 scale-100 hover:scale-105"
                  : "border-gray-200 opacity-50 grayscale"
              }`}
              style={{
                transitionDelay: `${300 + index * 100}ms`,
              }}
            >
              <div className="text-4xl mb-2">{achievement.icon}</div>
              <p className="text-xs font-medium text-gray-700">
                {achievement.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Cards with stagger animation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {summaryCards.map((card, index) => (
          <div
            key={card.title}
            className={`bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{
              transitionDelay: `${400 + index * 150}ms`,
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                  {card.title}
                </p>
                <div className="flex items-baseline gap-2 mt-2">
                  <p className="text-5xl font-bold bg-gradient-to-r bg-clip-text text-transparent from-gray-900 to-gray-600">
                    {card.value}
                  </p>
                  <span className="text-gray-400 text-2xl animate-pulse">
                    {card.icon}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {card.description}
                </p>
              </div>
            </div>
            {/* Mini progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className={`bg-gradient-to-r ${card.gradient} h-full rounded-full transition-all duration-1000 ease-out`}
                style={{
                  width: mounted
                    ? `${(card.value / card.target) * 100}%`
                    : "0%",
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Sales Agent Card with animation */}
      <div
        className={`bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-xl transition-all duration-700 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
        style={{ transitionDelay: "700ms" }}
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Your Sales Agent
        </h3>
        <div className="flex items-start gap-6">
          <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 ring-4 ring-blue-200 transition-all hover:ring-blue-400 hover:scale-105 duration-300">
            <img
              src={salesAgent.photo}
              alt={salesAgent.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
          </div>
          <div className="flex-1">
            <h4 className="text-2xl font-bold text-gray-900 mb-3">
              {salesAgent.name}
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3 group">
                <span className="text-gray-600 group-hover:scale-125 transition-transform">
                  📧
                </span>
                <a
                  href={`mailto:${salesAgent.email}`}
                  className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                >
                  {salesAgent.email}
                </a>
              </div>
              <div className="flex items-center gap-3 group">
                <span className="text-gray-600 group-hover:scale-125 transition-transform">
                  📞
                </span>
                <a
                  href={`tel:${salesAgent.phone}`}
                  className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                >
                  {salesAgent.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
