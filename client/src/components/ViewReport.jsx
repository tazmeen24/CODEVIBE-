import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config/api";
import { 
  FaGraduationCap, 
  FaBookOpen, 
  FaBullseye, 
  FaChartBar, 
  FaChartLine, 
  FaCode, 
  FaRegFileAlt, 
  FaFont, 
  FaLink, 
  FaImage, 
  FaListUl, 
  FaTable, 
  FaWpforms, 
  FaFlag,
  FaSun
} from "react-icons/fa";
import './ViewReport.css';

// Known course totals based on available lesson files
const COURSE_TOTALS = {
  html: 10,
  css: 14,
  js: 29,
  javascript: 29,
  react: 13,
  node: 12,
  nodejs: 12,
  express: 10,
  mongo: 8,
  mongodb: 8,
  dbms: 12,
  oop: 14,
  c: 17,
  dsa: 12
};

const HTML_LESSONS = [
  { id: "html lesson 1", name: "1. Introduction to HTML", icon: FaCode },
  { id: "html lesson 2", name: "2. HTML Basic Structure", icon: FaRegFileAlt },
  { id: "html lesson 3", name: "3. Headings & Paragraphs", icon: FaFont },
  { id: "html lesson 4", name: "4. Links & Anchor Tags", icon: FaLink },
  { id: "html lesson 5", name: "5. Images in HTML", icon: FaImage },
  { id: "html lesson 6", name: "6. Lists in HTML", icon: FaListUl },
  { id: "html lesson 7", name: "7. Tables in HTML", icon: FaTable },
  { id: "html lesson 8", name: "8. Forms in HTML", icon: FaWpforms },
  { id: "html lesson 9", name: "9. Semantic HTML", icon: FaCode },
  { id: "html lesson 10", name: "10. HTML Project", icon: FaFlag }
];

// Component for rendering a circular progress ring using SVG
const CircularProgress = ({ percentage }) => {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const validPercentage = isNaN(percentage) || percentage === "—" ? 0 : percentage;
  const strokeDashoffset = circumference - (validPercentage / 100) * circumference;

  return (
    <div className="vr-circular">
      <svg>
        <circle
          cx="80"
          cy="80"
          r={radius}
          strokeWidth="8"
          fill="transparent"
          className="vr-circular-track"
        />
        <circle
          cx="80"
          cy="80"
          r={radius}
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="vr-circular-fill"
          strokeLinecap="round"
        />
      </svg>
      <div className="vr-circular-text">
        <span className="vr-circle-val">
          {percentage === "—" ? "0%" : `${percentage}%`}
        </span>
        <span className="vr-circle-label">Completed</span>
      </div>
    </div>
  );
};

export default function ViewReport() {
  const { email } = useParams();
  const [search] = useSearchParams();
  const course = search.get("course") || "";
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!email) return;
    axios
      .get(`${API_BASE_URL}/api/progress/${email}`)
      .then((res) => setProgress(res.data))
      .catch((err) => console.error("Error fetching progress:", err))
      .finally(() => setLoading(false));
  }, [email]);

  if (loading) {
    return (
      <div className="vr-loading">
        <div className="vr-spinner"></div>
        <p className="vr-loading-text">Loading Report...</p>
      </div>
    );
  }

  // Fallback to empty progress if null
  const progressData = progress || { scores: {}, completedLessons: [] };
  const coursePrefix = course.toLowerCase();
  
  // Get all known lessons for this course, fallback to HTML lessons if course is HTML
  let lessonsList = [];
  if (coursePrefix === "html") {
    lessonsList = HTML_LESSONS;
  } else {
    // Just map from recorded scores if we don't have a hardcoded list
    const recorded = Object.keys(progressData.scores || {}).filter(k => k.toLowerCase().startsWith(coursePrefix));
    lessonsList = recorded.map((name, i) => ({ id: name, name: `${i+1}. ${name}`, icon: FaCode }));
    // If empty, generate placeholders
    if (lessonsList.length === 0) {
      const total = COURSE_TOTALS[coursePrefix] || 10;
      for (let i=1; i<=total; i++) {
        lessonsList.push({ id: `${coursePrefix} lesson ${i}`, name: `${i}. ${coursePrefix.toUpperCase()} Lesson ${i}`, icon: FaCode });
      }
    }
  }

  const totalCourseLessons = COURSE_TOTALS[coursePrefix] || lessonsList.length || 10;
  
  const lessonScores = Object.entries(progressData.scores || {})
    .filter(([lessonId]) => lessonId.toLowerCase().startsWith(coursePrefix))
    .map(([_, val]) => val);

  const completedCourseLessons = lessonScores.length;
  const quizzesAttempted = lessonScores.length; // assuming 1 quiz per lesson
  
  const completionPercentage = Math.round((completedCourseLessons / totalCourseLessons) * 100);
  const boundedCompletion = completionPercentage > 100 ? 100 : completionPercentage;

  const avgCourseScore = lessonScores.length
    ? Math.round(lessonScores.reduce((a, b) => a + b, 0) / lessonScores.length)
    : "—";

  return (
    <div className="vr-container">
      <div className="vr-content">
        
        {/* Header Section */}
        <div className="vr-header">
          <div className="vr-title">
            {course ? `${course.toUpperCase()} Progress Report` : 'Progress Report'}
          </div>
          <div className="vr-email">
            {email}
            <FaGraduationCap />
          </div>
        </div>

        {/* Top Summary Card */}
        <div className="vr-card vr-summary-card">
          
          <div className="vr-summary-left">
            <CircularProgress percentage={boundedCompletion} />
          </div>

          <div className="vr-summary-right">
            
            <div className="vr-stat-item">
              <div className="vr-stat-icon">
                <FaBookOpen />
              </div>
              <p className="vr-stat-label">Course Completion</p>
              <div className="vr-stat-value">
                {completedCourseLessons} <span>/ {totalCourseLessons}</span>
              </div>
              <p className="vr-stat-sub">Lessons Completed</p>
            </div>

            <div className="vr-stat-item">
              <div className="vr-stat-icon">
                <FaBullseye />
              </div>
              <p className="vr-stat-label">Average Accuracy</p>
              <div className="vr-stat-value">
                {avgCourseScore}
              </div>
              <p className="vr-stat-sub">
                {avgCourseScore === "—" ? "Not available yet" : "Overall Score"}
              </p>
            </div>

            <div className="vr-stat-item">
              <div className="vr-stat-icon">
                <FaChartBar />
              </div>
              <p className="vr-stat-label">Quizzes Attempted</p>
              <div className="vr-stat-value">
                {quizzesAttempted}
              </div>
              <p className="vr-stat-sub">Total Quizzes</p>
            </div>

          </div>
        </div>

        {/* Bottom Card: Lesson-by-Lesson Progress */}
        <div className="vr-card">
          <div className="vr-card-header">
            <FaChartLine />
            <span className="vr-card-header-title">Lesson-by-Lesson Progress</span>
          </div>
          
          <div className="vr-lessons-list">
            {lessonsList.map((lesson) => {
              let score = 0;
              const foundKey = Object.keys(progressData.scores || {}).find(k => k.toLowerCase() === lesson.id.toLowerCase());
              if (foundKey) {
                score = progressData.scores[foundKey];
              }

              const Icon = lesson.icon;

              return (
                <div key={lesson.id} className="vr-lesson-row">
                  <div className="vr-lesson-icon">
                    <Icon />
                  </div>
                  
                  <div className="vr-lesson-name">
                    {lesson.name}
                  </div>
                  
                  <div className="vr-lesson-bar-container">
                    <div 
                      className="vr-lesson-bar-fill"
                      style={{ width: `${Math.max(score, 0)}%`, minWidth: score > 0 ? '8px' : '0' }}
                    ></div>
                  </div>

                  <div className="vr-lesson-score">
                    {score}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Empty State / Bottom Note */}
        {completedCourseLessons === 0 && (
          <div className="vr-empty-state">
            <div className="vr-empty-icon">
              <FaSun />
            </div>
            <p className="vr-empty-title">No lesson scores recorded yet.</p>
            <p className="vr-empty-sub">Finish lessons and quizzes to see your progress here!</p>
          </div>
        )}

      </div>
    </div>
  );
}
