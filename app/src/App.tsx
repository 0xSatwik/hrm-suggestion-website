import { useState, useEffect, useRef } from 'react';
import { ThemeProvider, useTheme } from './hooks/useTheme';
import { finalSuggestionMCQs } from './data/finalSuggestionMCQs';
import { classNotesMCQs } from './data/classNotesMCQs';
import { finalSuggestionSummary } from './data/finalSuggestionSummary';
import { classNotesSummary, classNotesQuickRevision } from './data/classNotesSummary';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  BookOpen, 
  Brain, 
  FileText, 
  Moon, 
  Sun, 
  Home, 
  CheckCircle, 
  XCircle, 
  Clock,
  BarChart3,
  ChevronRight,
  RotateCcw,
  Play,
  Trophy,
  Target,
  Lightbulb,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Types
type Page = 'home' | 'reading-mcq' | 'test-mcq' | 'summary' | 'analytics';
type PDFType = 'final' | 'notes';

const READING_BATCH_SIZE = 12;

// Navigation Component
function Navigation({ 
  currentPage, 
  setPage 
}: { 
  currentPage: Page; 
  setPage: (page: Page) => void;
}) {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: Page; label: string; icon: React.ElementType }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'reading-mcq', label: 'Reading MCQs', icon: BookOpen },
    { id: 'test-mcq', label: 'Test Mode', icon: Brain },
    { id: 'summary', label: 'Summaries', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg hidden sm:block">HRM 5021 Study Hub</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setPage(item.id)}
                  className="gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-2 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.id}
                      variant={currentPage === item.id ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => {
                        setPage(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full justify-start gap-2"
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

// Home Page Component
function HomePage({ setPage }: { setPage: (page: Page) => void }) {
  const features = [
    {
      title: 'Reading Mode MCQs',
      description: 'Study with 200+ MCQs. Click to reveal answers with detailed explanations.',
      icon: BookOpen,
      page: 'reading-mcq' as Page,
      color: 'from-blue-500 to-cyan-500',
      stats: `${finalSuggestionMCQs.length + classNotesMCQs.length} Questions`
    },
    {
      title: 'Test Mode',
      description: 'Take timed tests with customizable question ranges. Track your progress.',
      icon: Brain,
      page: 'test-mcq' as Page,
      color: 'from-purple-500 to-pink-500',
      stats: 'Custom Tests'
    },
    {
      title: 'Detailed Summaries',
      description: 'Quick revision notes covering all topics from both PDFs.',
      icon: FileText,
      page: 'summary' as Page,
      color: 'from-green-500 to-emerald-500',
      stats: '2 PDFs Covered'
    },
    {
      title: 'Progress Analytics',
      description: 'Track your learning progress and identify weak areas.',
      icon: BarChart3,
      page: 'analytics' as Page,
      color: 'from-orange-500 to-red-500',
      stats: 'Detailed Stats'
    }
  ];

  const stats = [
    { label: 'Total MCQs', value: finalSuggestionMCQs.length + classNotesMCQs.length, icon: Target },
    { label: 'Topics Covered', value: '80+', icon: Lightbulb },
    { label: 'PDF Materials', value: '2', icon: FileText },
    { label: 'Study Modes', value: '4', icon: Trophy }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          HRM 5021 Study Hub
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Your comprehensive learning platform for Human Resource Management. 
          Master recruitment, selection, and organizational concepts with interactive MCQs and detailed summaries.
        </p>
      </motion.div>

      {/* Stats Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <Icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          );
        })}
      </motion.div>

      {/* Features Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid md:grid-cols-2 gap-6"
      >
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className="cursor-pointer h-full hover:shadow-lg transition-shadow"
                onClick={() => setPage(feature.page)}
              >
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <Badge variant="secondary">{feature.stats}</Badge>
                  </div>
                  <p className="text-muted-foreground">{feature.description}</p>
                  <div className="mt-4 flex items-center text-primary">
                    <span className="text-sm font-medium">Get Started</span>
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Quick Tips */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-12"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              Quick Study Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <span>Start with Reading Mode to understand concepts before taking tests</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <span>Use Test Mode with custom ranges to focus on weak areas</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <span>Review summaries regularly for quick revision before exams</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <span>Track your progress in Analytics to identify improvement areas</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

// Reading Mode MCQ Component
function ReadingModeMCQ() {
  const [selectedPDF, setSelectedPDF] = useState<PDFType>('final');
  const [revealedAnswers, setRevealedAnswers] = useState<Map<number, Set<number>>>(new Map());
  const [showAllAnswers, setShowAllAnswers] = useState(false);
  const [visibleCount, setVisibleCount] = useState(READING_BATCH_SIZE);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const mcqs = selectedPDF === 'final' ? finalSuggestionMCQs : classNotesMCQs;
  const visibleMCQs = mcqs.slice(0, visibleCount);
  const hasMoreQuestions = visibleCount < mcqs.length;
  const loadingProgress = Math.min((visibleCount / mcqs.length) * 100, 100);

  useEffect(() => {
    const trigger = loadMoreRef.current;

    if (!trigger || !hasMoreQuestions) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((previous) => Math.min(previous + READING_BATCH_SIZE, mcqs.length));
        }
      },
      { rootMargin: '240px 0px' }
    );

    observer.observe(trigger);

    return () => {
      observer.disconnect();
    };
  }, [hasMoreQuestions, mcqs.length]);

  const resetReadingMode = (pdfType: PDFType) => {
    setSelectedPDF(pdfType);
    setVisibleCount(READING_BATCH_SIZE);
    setRevealedAnswers(new Map());
    setShowAllAnswers(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleReveal = (questionIndex: number, optionIndex: number) => {
    setRevealedAnswers((previous) => {
      const next = new Map(previous);
      const currentQuestionAnswers = new Set(next.get(questionIndex) ?? []);

      if (currentQuestionAnswers.has(optionIndex)) {
        currentQuestionAnswers.delete(optionIndex);
      } else {
        currentQuestionAnswers.add(optionIndex);
      }

      if (currentQuestionAnswers.size === 0) {
        next.delete(questionIndex);
      } else {
        next.set(questionIndex, currentQuestionAnswers);
      }

      return next;
    });
  };

  const revealAll = () => {
    setShowAllAnswers(true);
  };

  const hideAll = () => {
    setShowAllAnswers(false);
    setRevealedAnswers(new Map());
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Reading Mode MCQs</h1>
            <p className="text-muted-foreground">Scroll continuously through the question bank and reveal answers as needed</p>
          </div>
        </div>

        <Card className="mb-6 border bg-background">
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">Showing {visibleMCQs.length} of {mcqs.length} questions</Badge>
                  <Badge variant="secondary">
                    {showAllAnswers ? 'All visible answers revealed' : 'Tap any option to reveal it'}
                  </Badge>
                </div>
                <Progress value={loadingProgress} className="w-full max-w-md" />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Select value={selectedPDF} onValueChange={(value: PDFType) => resetReadingMode(value)}>
                  <SelectTrigger className="w-full sm:w-[220px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="final">Final Suggestion PDF</SelectItem>
                    <SelectItem value="notes">Class Notes PDF</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant={showAllAnswers ? 'secondary' : 'default'}
                  onClick={showAllAnswers ? hideAll : revealAll}
                  className="sm:min-w-[170px]"
                >
                  {showAllAnswers ? 'Hide All Answers' : 'Reveal All Answers'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {visibleMCQs.map((mcq, questionIndex) => {
            const questionAnswers = revealedAnswers.get(questionIndex) ?? new Set<number>();
            const explanationVisible = showAllAnswers || questionAnswers.has(mcq.correctAnswer);

            return (
              <motion.div
                key={`${selectedPDF}-${mcq.id}-${questionIndex}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline">Question {questionIndex + 1}</Badge>
                        <Badge variant="secondary">{mcq.topic}</Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {questionAnswers.size > 0 || showAllAnswers ? 'Answer visible' : 'Answer hidden'}
                      </span>
                    </div>

                    <h2 className="text-xl font-medium mb-6">{mcq.question}</h2>

                    <div className="space-y-3">
                      {mcq.options.map((option, optionIndex) => {
                        const isRevealed = showAllAnswers || questionAnswers.has(optionIndex);
                        const isCorrect = optionIndex === mcq.correctAnswer;

                        return (
                          <button
                            key={optionIndex}
                            onClick={() => toggleReveal(questionIndex, optionIndex)}
                            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                              isRevealed
                                ? isCorrect
                                  ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
                                  : 'border-red-500 bg-red-50 dark:bg-red-950/20'
                                : 'border-border hover:border-primary'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                isRevealed
                                  ? isCorrect
                                    ? 'bg-green-500 text-white'
                                    : 'bg-red-500 text-white'
                                  : 'bg-muted'
                              }`}>
                                {String.fromCharCode(65 + optionIndex)}
                              </div>
                              <span className="flex-1">{option}</span>
                              {isRevealed && (
                                isCorrect ? (
                                  <CheckCircle className="h-5 w-5 text-green-500" />
                                ) : (
                                  <XCircle className="h-5 w-5 text-red-500" />
                                )
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {explanationVisible && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-950/20"
                      >
                        <div className="flex items-start gap-2">
                          <Lightbulb className="h-5 w-5 text-blue-500 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-blue-900 dark:text-blue-100">Explanation</h4>
                            <p className="mt-1 text-blue-800 dark:text-blue-200">{mcq.explanation}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div ref={loadMoreRef} className="py-8">
          {hasMoreQuestions ? (
            <div className="flex items-center justify-center">
              <Badge variant="outline">Scroll down to load more questions</Badge>
            </div>
          ) : (
            <div className="text-center text-sm text-muted-foreground">
              You have reached the end of this question bank.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Test Mode Component
function TestModeMCQ() {
  const [selectedPDF, setSelectedPDF] = useState<PDFType>('final');
  const [startQuestion, setStartQuestion] = useState(1);
  const [endQuestion, setEndQuestion] = useState(10);
  const [timePerQuestion, setTimePerQuestion] = useState(2);
  const [testStarted, setTestStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Map<number, number>>(new Map());
  const [timeLeft, setTimeLeft] = useState(0);
  const [testCompleted, setTestCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const mcqs = selectedPDF === 'final' ? finalSuggestionMCQs : classNotesMCQs;
  const testQuestions = mcqs.slice(startQuestion - 1, endQuestion);
  const currentQuestion = testQuestions[currentQuestionIndex];

  useEffect(() => {
    if (testStarted && !testCompleted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleNextQuestion();
            return timePerQuestion * 60;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [testStarted, testCompleted, timeLeft]);

  const startTest = () => {
    setTestStarted(true);
    setTimeLeft(timePerQuestion * 60);
    setCurrentQuestionIndex(0);
    setSelectedAnswers(new Map());
    setTestCompleted(false);
    setShowResults(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = new Map(selectedAnswers);
    newAnswers.set(currentQuestionIndex, answerIndex);
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < testQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTimeLeft(timePerQuestion * 60);
    } else {
      completeTest();
    }
  };

  const completeTest = () => {
    setTestCompleted(true);
    setShowResults(true);
  };

  const calculateScore = () => {
    let correct = 0;
    selectedAnswers.forEach((answer, questionIndex) => {
      if (answer === testQuestions[questionIndex].correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const resetTest = () => {
    setTestStarted(false);
    setTestCompleted(false);
    setShowResults(false);
    setSelectedAnswers(new Map());
    setCurrentQuestionIndex(0);
  };

  if (!testStarted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Test Mode Configuration</h1>
          
          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <Label>Select PDF</Label>
                <Select value={selectedPDF} onValueChange={(v: PDFType) => setSelectedPDF(v)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="final">Final Suggestion PDF ({finalSuggestionMCQs.length} questions)</SelectItem>
                    <SelectItem value="notes">Class Notes PDF ({classNotesMCQs.length} questions)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Start Question</Label>
                  <Input
                    type="number"
                    min={1}
                    max={mcqs.length}
                    value={startQuestion}
                    onChange={(e) => setStartQuestion(Math.max(1, Math.min(mcqs.length, parseInt(e.target.value) || 1)))}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>End Question</Label>
                  <Input
                    type="number"
                    min={startQuestion}
                    max={mcqs.length}
                    value={endQuestion}
                    onChange={(e) => setEndQuestion(Math.max(startQuestion, Math.min(mcqs.length, parseInt(e.target.value) || startQuestion)))}
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label>Time per Question (minutes)</Label>
                <div className="flex items-center gap-4 mt-2">
                  <Input
                    type="number"
                    min={1}
                    max={10}
                    value={timePerQuestion}
                    onChange={(e) => setTimePerQuestion(Math.max(1, Math.min(10, parseInt(e.target.value) || 2)))}
                  />
                  <span className="text-muted-foreground whitespace-nowrap">
                    Total: {((endQuestion - startQuestion + 1) * timePerQuestion)} minutes
                  </span>
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <Target className="h-4 w-4" />
                  <span>Test Summary: {endQuestion - startQuestion + 1} questions, {timePerQuestion} min each</span>
                </div>
              </div>

              <Button onClick={startTest} className="w-full" size="lg">
                <Play className="h-5 w-5 mr-2" />
                Start Test
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const total = testQuestions.length;
    const percentage = Math.round((score / total) * 100);

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Test Results</h1>
          
          <Card className="mb-6">
            <CardContent className="p-8 text-center">
              <div className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {score}/{total}
              </div>
              <Progress value={percentage} className="mb-4" />
              <p className="text-2xl font-medium mb-2">{percentage}%</p>
              <Badge className={percentage >= 70 ? 'bg-green-500' : percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'}>
                {percentage >= 70 ? 'Excellent!' : percentage >= 50 ? 'Good Job!' : 'Keep Practicing!'}
              </Badge>
            </CardContent>
          </Card>

          <div className="space-y-4 mb-6">
            <h2 className="text-xl font-semibold">Question Review</h2>
            {testQuestions.map((mcq, index) => {
              const selectedAnswer = selectedAnswers.get(index);
              const isCorrect = selectedAnswer === mcq.correctAnswer;
              
              return (
                <Card key={index} className={isCorrect ? 'border-green-500' : 'border-red-500'}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium mb-2">{mcq.question}</p>
                        <p className="text-sm text-muted-foreground">
                          Your answer: {selectedAnswer !== undefined ? mcq.options[selectedAnswer] : 'Not answered'}
                        </p>
                        {!isCorrect && (
                          <p className="text-sm text-green-600 mt-1">
                            Correct answer: {mcq.options[mcq.correctAnswer]}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground mt-2">{mcq.explanation}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Button onClick={resetTest} className="w-full">
            <RotateCcw className="h-5 w-5 mr-2" />
            Take Another Test
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Timer and Progress */}
        <div className="flex items-center justify-between mb-6">
          <Badge variant="outline">
            Question {currentQuestionIndex + 1} of {testQuestions.length}
          </Badge>
          <div className={`flex items-center gap-2 font-mono text-lg ${timeLeft < 30 ? 'text-red-500' : ''}`}>
            <Clock className="h-5 w-5" />
            {formatTime(timeLeft)}
          </div>
        </div>

        <Progress 
          value={(currentQuestionIndex / testQuestions.length) * 100} 
          className="mb-6"
        />

        <Card className="mb-6">
          <CardContent className="p-6">
            <Badge className="mb-4">{currentQuestion.topic}</Badge>
            <h2 className="text-xl font-medium mb-6">{currentQuestion.question}</h2>

            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    selectedAnswers.get(currentQuestionIndex) === index
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      selectedAnswers.get(currentQuestionIndex) === index
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={completeTest}
          >
            End Test
          </Button>
          <Button
            onClick={handleNextQuestion}
            disabled={selectedAnswers.get(currentQuestionIndex) === undefined}
          >
            {currentQuestionIndex === testQuestions.length - 1 ? 'Finish' : 'Next'}
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Summary Component
function SummaryPage() {
  const [selectedPDF, setSelectedPDF] = useState<PDFType>('final');
  const summary = selectedPDF === 'final' ? finalSuggestionSummary : classNotesSummary;
  const quickNotes = selectedPDF === 'final' ? [] : classNotesQuickRevision;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Detailed Summaries</h1>
            <p className="text-muted-foreground">Quick revision notes for exam preparation</p>
          </div>
          <Select value={selectedPDF} onValueChange={(v: PDFType) => setSelectedPDF(v)}>
            <SelectTrigger className="w-[250px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="final">Final Suggestion PDF</SelectItem>
              <SelectItem value="notes">Class Notes PDF</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Quick Notes */}
        {selectedPDF === 'notes' && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                Quick Revision Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {quickNotes.map((note, index) => (
                  <div key={index} className="p-3 bg-muted rounded-lg">
                    <h4 className="font-semibold text-sm">{note.term}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{note.meaning}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Detailed Summary */}
        <div className="space-y-6">
          {summary.map((section, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {section.content.map((paragraph, pIndex) => (
                    <p key={pIndex} className="text-muted-foreground">{paragraph}</p>
                  ))}
                </div>
                <Separator className="my-4" />
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    Key Points
                  </h4>
                  <ul className="grid md:grid-cols-2 gap-2">
                    {section.keyPoints.map((point, kIndex) => (
                      <li key={kIndex} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// Analytics Component
function AnalyticsPage() {
  const totalQuestions = finalSuggestionMCQs.length + classNotesMCQs.length;
  const finalTopics = [...new Set(finalSuggestionMCQs.map(m => m.topic))].length;
  const notesTopics = [...new Set(classNotesMCQs.map(m => m.topic))].length;

  const stats = [
    { label: 'Final Suggestion MCQs', value: finalSuggestionMCQs.length, color: 'bg-blue-500' },
    { label: 'Class Notes MCQs', value: classNotesMCQs.length, color: 'bg-purple-500' },
    { label: 'Final Topics', value: finalTopics, color: 'bg-green-500' },
    { label: 'Class Notes Topics', value: notesTopics, color: 'bg-orange-500' }
  ];

  const topicDistribution = [
    { name: 'Recruitment Process', count: 35 },
    { name: 'Organizational Structure', count: 25 },
    { name: 'HR Management', count: 30 },
    { name: 'Client Management', count: 20 },
    { name: 'Compliance', count: 15 },
    { name: 'Technology', count: 15 }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Learning Analytics</h1>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-4 text-center">
                <div className={`text-3xl font-bold ${stat.color.replace('bg-', 'text-')}`}>
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Progress Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Content Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Final Suggestion PDF</span>
                  <span className="text-sm text-muted-foreground">{finalSuggestionMCQs.length} questions</span>
                </div>
                <Progress value={finalSuggestionMCQs.length / totalQuestions * 100} className="h-3" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Class Notes PDF</span>
                  <span className="text-sm text-muted-foreground">{classNotesMCQs.length} questions</span>
                </div>
                <Progress value={classNotesMCQs.length / totalQuestions * 100} className="h-3" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Topic Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Topic Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topicDistribution.map((topic, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">{topic.name}</span>
                    <span className="text-sm text-muted-foreground">{topic.count} questions</span>
                  </div>
                  <Progress value={topic.count / 35 * 100} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Study Tips */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Study Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <span>Focus on Recruitment Process topics (35 questions) - highest weightage</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <span>Review Organizational Structure concepts thoroughly</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <span>Practice Client Management scenarios for practical application</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <span>Use Test Mode to identify weak areas before the exam</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Main App Component
function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentPage={currentPage} setPage={setCurrentPage} />
      
      <main className="pb-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {currentPage === 'home' && <HomePage setPage={setCurrentPage} />}
            {currentPage === 'reading-mcq' && <ReadingModeMCQ />}
            {currentPage === 'test-mcq' && <TestModeMCQ />}
            {currentPage === 'summary' && <SummaryPage />}
            {currentPage === 'analytics' && <AnalyticsPage />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>HRM 5021 Study Hub - Comprehensive Learning Platform</p>
          <p className="mt-1">Built for exam success with interactive MCQs and detailed summaries</p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
