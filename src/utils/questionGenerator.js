import { DIFFICULTY_LEVELS } from '../config/constants';

// 解析诗词文本数据
const parsePoems = (content, termId) => {
  const poems = [];
  let currentPoem = null;
  let isCurrentGrade = false;
  
  // 将 grade 转换为中文数字
  const gradeMap = {
    1: '一',
    2: '二',
    3: '三',
    4: '四',
    5: '五',
    6: '六'
  };
  
  // 使用正则表达式提取年级和学期
  const matches = termId.match(/grade(\d+)_(\d+)/);
  if (!matches) {
    throw new Error('无效的学期ID格式');
  }
  
  const [, grade, term] = matches;
  const gradeNum = parseInt(grade);
  const targetGrade = `${gradeMap[gradeNum]}年级${term === '1' ? '上册' : '下册'}`;
  
  console.log('termId:', termId);
  console.log('grade:', gradeNum);
  console.log('目标年级:', targetGrade);
  
  const lines = content.split('\n')
    .map(line => line.replace(/^\d+\|/, '').trim())
    .filter(line => line);
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    console.log('当前处理行:', line);
    
    if (line === targetGrade) {
      console.log('找到目标年级:', line);
      isCurrentGrade = true;
      continue;
    } else if (line.endsWith('年级上册') || line.endsWith('年级下册')) {
      if (line !== targetGrade) {
        isCurrentGrade = false;
      }
      continue;
    }
    
    if (!isCurrentGrade) continue;
    
    if (/^\d{2}$/.test(line)) {
      if (currentPoem && currentPoem.content.length > 0) {
        poems.push(currentPoem);
      }
      currentPoem = {
        id: parseInt(line),
        title: '',
        dynasty: '',
        author: '',
        content: []
      };
    } else if (currentPoem) {
      if (!currentPoem.title && !line.includes('【') && !line.includes('】')) {
        currentPoem.title = line.replace(/[《》]/g, '');
      } else if (line.includes('【') && line.includes('】')) {
        const match = line.match(/【(.+)】(.+)/);
        if (match) {
          currentPoem.dynasty = match[1];
          currentPoem.author = match[2].trim();
        }
      } else if (currentPoem.title && line.length >= 2) {
        currentPoem.content.push(line);
      }
    }
  }
  
  if (currentPoem && currentPoem.content.length > 0) {
    poems.push(currentPoem);
  }
  
  console.log(`解析到的诗词数量: ${poems.length}, 目标年级: ${targetGrade}`);
  return poems;
};

// 生成填空题
const generateBlankQuestion = (poem, allPoems) => {
  if (!poem || !poem.content || !Array.isArray(poem.content)) {
    throw new Error('诗词数据格式错误');
  }

  const poemLines = poem.content.filter(line => 
    line && line.length >= 4 && !line.includes('【') && !line.includes('】')
  );
  
  if (poemLines.length < 2) {
    throw new Error('诗词内容不足');
  }

  const blankIndex = Math.floor(Math.random() * poemLines.length);
  const correctAnswer = poemLines[blankIndex].replace(/[，。、？！；：]/g, '');
  const correctAnswerLength = correctAnswer.length;
  
  const questionLines = [...poemLines];
  questionLines[blankIndex] = '________';
  
  // 添加标题、朝代和作者信息，分三行显示，并处理 undefined
  const poemInfo = [
    `《${poem.title || '无题'}》`,
    `【${poem.dynasty || '朝代不详'}】`,
    `${poem.author ? poem.author.trim() : '佚名'}`
  ].join('\n');
  
  // 从其他诗中收集字数相同的诗句作为干扰项
  const otherPoemLines = allPoems
    .filter(p => p.id !== poem.id)
    .flatMap(p => p.content.filter(line => {
      const cleanLine = line.replace(/[，。、？！；：]/g, '');
      return line && 
        cleanLine.length === correctAnswerLength && 
        !line.includes('【') && 
        !line.includes('】');
    }));
  
  // 生成选项
  const options = [correctAnswer];
  
  // 如果没有足够的相同字数的诗句，就从相近字数诗句中选择
  if (otherPoemLines.length < 3) {
    const similarLengthLines = allPoems
      .filter(p => p.id !== poem.id)
      .flatMap(p => p.content.filter(line => {
        const cleanLine = line.replace(/[，。、？！；：]/g, '');
        return line && 
          Math.abs(cleanLine.length - correctAnswerLength) <= 1 && 
          !line.includes('【') && 
          !line.includes('】');
      }));
    
    while (options.length < 4 && similarLengthLines.length > 0) {
      const randomIndex = Math.floor(Math.random() * similarLengthLines.length);
      const option = similarLengthLines[randomIndex].replace(/[，。、？！；：]/g, '');
      if (!options.includes(option)) {
        options.push(option);
      }
      similarLengthLines.splice(randomIndex, 1);
    }
  } else {
    while (options.length < 4) {
      const randomIndex = Math.floor(Math.random() * otherPoemLines.length);
      const option = otherPoemLines[randomIndex].replace(/[，。、？！；：]/g, '');
      if (!options.includes(option)) {
        options.push(option);
      }
      otherPoemLines.splice(randomIndex, 1);
    }
  }

  const shuffledOptions = options.sort(() => Math.random() - 0.5);
  const correctIndex = shuffledOptions.indexOf(correctAnswer);
  
  return {
    type: 'blank',
    question: `${poemInfo}\n请补全下面诗句中的空白处：\n${questionLines.join('\n')}`,
    options: shuffledOptions,
    answer: correctIndex,
    correctAnswer
  };
};

// 根据难度生成题目
export const generateQuestions = async (termId, difficulty) => {
  try {
    const gradeMatch = termId.match(/(\d+)_(\d+)/);
    if (!gradeMatch) {
      throw new Error('无效的学期ID');
    }
    
    // 从统一的诗词文件读取
    const response = await fetch('/poetry/all_poems.txt');
    if (!response.ok) {
      throw new Error('诗词文件加载失败');
    }
    
    const content = await response.text();
    const poems = parsePoems(content, termId);
    
    if (!poems.length) {
      throw new Error(`未找到年级 ${termId} 的诗词`);
    }
    
    const questionCount = DIFFICULTY_LEVELS[difficulty].questionCount;
    const questions = [];
    
    const availablePoems = [...poems];
    while (questions.length < Math.min(questionCount, availablePoems.length)) {
      const randomIndex = Math.floor(Math.random() * availablePoems.length);
      const selectedPoem = availablePoems[randomIndex];
      questions.push(generateBlankQuestion(selectedPoem, poems));
      availablePoems.splice(randomIndex, 1);
    }
    
    console.log('termId:', termId);
    console.log('difficulty:', difficulty);
    console.log('解析到的内容:', content);
    console.log('生成的题目:', questions);
    
    return questions;
  } catch (error) {
    console.error('生成题目失败:', error);
    throw error;
  }
};