import React, { useState, useEffect } from 'react';
import { Layout, Menu, Radio, Button, message, Progress, Row, Col, Typography } from 'antd';
import { 
  TrophyOutlined, 
  BookOutlined, 
  RocketOutlined 
} from '@ant-design/icons';
import { GRADES, DIFFICULTY_LEVELS } from '../config/grades';
import { generateQuestions } from '../utils/questionGenerator';
import * as S from '../styles/QuizApp.styles';

const { Title } = Typography;



function QuizApp() {
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [currentDifficulty, setCurrentDifficulty] = useState(null);
  const [title, setTitle] = useState('');
  const [dynasty, setDynasty] = useState('');
  const [author, setAuthor] = useState('');
  const [contentLines, setContentLines] = useState([]);

  const handleTermSelect = (termId) => {
    setSelectedTerm(termId);
  };

  const startQuiz = async (difficulty) => {
    if (!selectedTerm) {
      message.warning('请先选择学期');
      return;
    }

    try {
      message.loading('正在准备题目...', 0);
      const questions = await generateQuestions(selectedTerm, difficulty);
      
      if (!questions || !questions.length) {
        throw new Error('生成题目失败');
      }
      
      setCurrentQuestions(questions);
      setCurrentDifficulty(difficulty);
      setCurrentIndex(0);
      setScore(0);
      setShowResult(false);
      message.destroy();
      
    } catch (error) {
      console.error('加载题目失败:', error);
      message.error(error.message || '加载题目失败，请重试');
      message.destroy();
    }
  };

  useEffect(() => {
    if (currentQuestions.length > 0) {
      const currentQuestion = currentQuestions[currentIndex];
      const [titleLine, dynastyLine, authorLine, ...poemLines] = currentQuestion.question.split('\n');
      
      setTitle(titleLine);
      setDynasty(dynastyLine);
      setAuthor(authorLine);
      setContentLines(poemLines);
    }
  }, [currentQuestions, currentIndex]);

  const handleAnswer = () => {
    if (selectedAnswer === null) {
      message.warning('请选择一个答案');
      return;
    }

    const isCorrect = selectedAnswer === currentQuestions[currentIndex].answer;
    
    if (isCorrect) {
      message.success('回答正确！');
      setScore(score + 1);
    } else {
      const correctOption = ['A', 'B', 'C', 'D'][currentQuestions[currentIndex].answer];
      message.error(`回答错误，正确答案是 ${correctOption}`);
    }

    setTimeout(() => {
      if (currentIndex < currentQuestions.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  const resetQuiz = () => {
    setSelectedTerm(null);
    setCurrentQuestions([]);
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setCurrentDifficulty(null);
  };

  const currentQuestion = currentQuestions[currentIndex];

  return (
    <S.StyledLayout>
      <S.StyledHeader>
        <div className="logo">语文学习</div>
        <Menu mode="horizontal" defaultSelectedKeys={['1']}>
          <Menu.Item key="1" icon={<BookOutlined />}>
            古诗文学习
          </Menu.Item>
        </Menu>
      </S.StyledHeader>
      
      <S.StyledContent>
        {!currentQuestions.length ? (
          <S.QuizCard>
            <div className="quiz-title">开始你的学习之旅</div>
            
            {GRADES.map(grade => (
              <S.GradeSection key={grade.grade}>
                <h2 className="grade-title">{grade.name}</h2>
                <S.TermButtonGroup>
                  {grade.terms.map(term => (
                    <S.TermButton
                      key={term.id}
                      className={selectedTerm === term.id ? 'selected' : ''}
                      onClick={() => handleTermSelect(term.id)}
                    >
                      {term.name}
                    </S.TermButton>
                  ))}
                </S.TermButtonGroup>
              </S.GradeSection>
            ))}

            {selectedTerm && (
              <div style={{ marginTop: 32 }}>
                <Title level={4}>选择难度</Title>
                <Row gutter={[16, 16]}>
                  {Object.entries(DIFFICULTY_LEVELS).map(([key, level]) => (
                    <Col key={key} span={8}>
                      <S.DifficultyCard
                        onClick={() => startQuiz(key)}
                        selected={currentDifficulty === key}
                        level={key}
                      >
                        <div className="difficulty-header">
                          <div className="difficulty-icon">
                            {key === 'EASY' ? <BookOutlined /> :
                             key === 'MEDIUM' ? <RocketOutlined /> :
                             <TrophyOutlined />}
                          </div>
                          <div className="difficulty-title">{level.name}</div>
                        </div>
                        <p className="difficulty-desc">{level.description}</p>
                        <ul className="difficulty-info">
                          <li>题目数量：{level.questionCount}题</li>
                          <li>时间限制：{level.timeLimit}分钟</li>
                        </ul>
                      </S.DifficultyCard>
                    </Col>
                  ))}
                </Row>
              </div>
            )}
          </S.QuizCard>
        ) : showResult ? (
          <S.ResultCard>
            <div className="result-title">测试结果</div>
            <div className="score-display">
              {score} / {currentQuestions.length}
            </div>
            <Progress 
              percent={score / currentQuestions.length * 100} 
              format={percent => `${percent.toFixed(0)}%`}
              status={score / currentQuestions.length >= 0.6 ? 'success' : 'exception'}
            />
            <div className={`feedback-message ${
              score === currentQuestions.length ? 'perfect' :
              score >= currentQuestions.length * 0.6 ? 'good' : 'needImprove'
            }`}>
              {score === currentQuestions.length && '太棒了！全部回答正确！'}
              {score >= currentQuestions.length * 0.6 && 
               score < currentQuestions.length && '做得不错！继续加油！'}
              {score < currentQuestions.length * 0.6 && '还需要多加练习哦！'}
            </div>
            <div className="action-buttons">
              <Button type="primary" size="large" onClick={resetQuiz}>
                返回主页
              </Button>
              <Button size="large" onClick={() => startQuiz(currentDifficulty)}>
                再次挑战
              </Button>
            </div>
          </S.ResultCard>
        ) : (
          <S.QuestionCard>
            <div className="question-header">
              <div className="question-progress">
                第 {currentIndex + 1}/{currentQuestions.length} 题
              </div>
              <div className="question-prompt">
                请补全下面诗句中的空白处：
              </div>
              <div className="poem-info">
                <div className="poem-title">{title}</div>
                <div className="poem-meta">
                  <span className="dynasty">{dynasty}</span>
                  <span className="author">{author}</span>
                </div>
                <div className="poem-content">
                  {contentLines.map((line, index) => (
                    <div key={index} className="poem-line">
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <S.OptionsWrapper 
              onChange={(e) => setSelectedAnswer(e.target.value)}
              value={selectedAnswer}
            >
              <Row gutter={[24, 16]}>
                {currentQuestion.options.map((option, index) => (
                  <Col span={12} key={index}>
                    <Radio value={index} className="option-radio">
                      <span className="option-text">
                        {['A', 'B', 'C', 'D'][index]}. {option}
                      </span>
                    </Radio>
                  </Col>
                ))}
              </Row>
            </S.OptionsWrapper>
            <Button 
              type="primary" 
              size="large" 
              onClick={handleAnswer}
              block
            >
              {currentIndex === currentQuestions.length - 1 ? '完成' : '下一题'}
            </Button>
          </S.QuestionCard>
        )}
      </S.StyledContent>
    </S.StyledLayout>
  );
}

export default QuizApp;