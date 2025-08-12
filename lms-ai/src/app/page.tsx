'use client';

import React from 'react';
import { courseManifest } from '@/data/courseManifest';
import CourseCard from '@/components/CourseCard';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Apple-like minimalist design */}
      <section className="relative overflow-hidden">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50/30"></div>
        
        {/* Content - Much smaller hero */}
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 pt-12 pb-16 sm:pt-16 sm:pb-20">
          <div className="text-center">
            {/* Main headline with Apple-style typography - much smaller */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-gray-900 mb-4 tracking-tight leading-[1.1]">
              Learn.
              <br />
              <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Transform.
              </span>
              <br />
              Excel.
            </h1>
            
            {/* Subtitle - smaller */}
            <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-2xl mx-auto font-light leading-relaxed">
              Master essential software skills with precision-crafted interactive simulations.
            </p>
            
            {/* Single CTA button - Apple style */}
            <button 
              onClick={() => window.scrollTo({ top: document.querySelector('#courses')?.offsetTop || 0, behavior: 'smooth' })}
              className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-4 rounded-full text-lg transition-all duration-200 ease-out hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Begin Your Journey
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Floating elements - subtle Apple-like */}
        <div className="absolute top-32 left-12 w-2 h-2 bg-blue-400 rounded-full opacity-30 animate-ping"></div>
        <div className="absolute top-48 right-16 w-1 h-1 bg-purple-400 rounded-full opacity-40 animate-pulse"></div>
        <div className="absolute bottom-32 left-20 w-3 h-3 bg-blue-300 rounded-full opacity-20 animate-bounce"></div>
      </section>

      {/* Course Section - Apple-like clean design */}
      <section id="courses" className="py-16 sm:py-20 bg-gray-50/50">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          {/* Section header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-light text-gray-900 mb-6 tracking-tight">
              Master PowerPoint
              <span className="block font-medium text-blue-600">through interactive simulation</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              Experience real software interaction with hands-on SCORM-based simulations that adapt to your learning pace.
            </p>
          </div>
          
          {/* Single course showcase */}
          <div className="max-w-4xl mx-auto">
            {courseManifest.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                className="animate-fade-in"
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
