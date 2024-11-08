import { DIFFICULTY_LEVELS } from '../config/constants';

// 解析诗词文本数据
const parsePoems = (text) => {
  const poems = [];
  const lines = text.split('\n');
  let currentPoem = null;

  lines.forEach(line => {
    line = line.trim();
    if (line.match(/^\d+$/)) {
      if (currentPoem) {
        poems.push(currentPoem);
      }
      currentPoem = {
        id: line,
        title: '',
        author: '',
        dynasty: '',
        content: []
      };
    } else if (line && currentPoem) {
      if (!currentPoem.title) {
        currentPoem.title = line;
      } else if (line.startsWith('【')) {
        const content = line.replace(/【|】/g, '');
        if (content.includes('】')) {
          const [dynasty, author] = content.split('】');
          currentPoem.dynasty = dynasty;
          currentPoem.author = author;
        } else {
          // 如果只有一个【】，则第一个字为朝代，剩余为作者
          currentPoem.dynasty = content.charAt(0);
          currentPoem.author = content.slice(1).trim();
        }
      } else if (line.length > 0 && !line.includes('年级') && !line.includes('册')) {
        currentPoem.content.push(line);
      }
    }
  });

  if (currentPoem) {
    poems.push(currentPoem);
  }

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
  
  // 如果没有足够的相同字数的诗句，就从相近字数的诗句中选择
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
    question: `${poemInfo}\n${questionLines.join('\n')}`,
    options: shuffledOptions,
    answer: correctIndex,
    correctAnswer
  };
};

// 根据难度生成题目
export const generateQuestions = async (term, difficulty) => {
  try {
    const response = await fetch(`/poetry/${term}.txt`);
    const text = await response.text();
    const poems = parsePoems(text);
    
    const questions = [];
    const questionCount = DIFFICULTY_LEVELS[difficulty]?.questionCount || 5;
    
    while (questions.length < questionCount) {
      const randomPoem = poems[Math.floor(Math.random() * poems.length)];
      questions.push(generateBlankQuestion(randomPoem, poems));
    }
    
    return questions;
  } catch (error) {
    console.error('Error generating questions:', error);
    throw error;
  }
};