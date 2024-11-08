export const parsePoetryData = (rawData) => {
  const gradeMap = {
    '一年级上册': 'grade1_1',
    '一年级下册': 'grade1_2',
    // ... 其他年级
  };

  const poetryData = {};
  let currentGrade = '';
  let currentPoem = null;

  rawData.split('\n').forEach(line => {
    if (line.includes('年级')) {
      currentGrade = gradeMap[line.trim()];
      poetryData[currentGrade] = [];
    } else if (line.match(/^\d{2}$/)) {
      if (currentPoem) {
        poetryData[currentGrade].push(currentPoem);
      }
      currentPoem = {
        id: line,
        title: '',
        author: '',
        content: [],
        questions: []
      };
    } else if (currentPoem) {
      // 处理诗词内容
      // ... 解析逻辑
    }
  });

  return poetryData;
};

export const generateQuestions = (poem, difficulty) => {
  const questions = [];
  
  // 根据难度生成不同类型的题目
  switch (difficulty) {
    case 'EASY':
      questions.push(
        generateBasicQuestion(poem),
        generateSimpleContentQuestion(poem)
      );
      break;
    case 'MEDIUM':
      questions.push(
        generateBasicQuestion(poem),
        generateContentQuestion(poem),
        generateUnderstandingQuestion(poem)
      );
      break;
    case 'HARD':
      questions.push(
        generateAdvancedQuestion(poem),
        generateAnalysisQuestion(poem),
        generateComprehensiveQuestion(poem)
      );
      break;
  }
  
  return questions;
}; 