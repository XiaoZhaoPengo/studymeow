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
    question: `请补全下面诗句中的空白处：\n\n${poemInfo}\n${questionLines.join('\n')}`,
    options: shuffledOptions,
    answer: correctIndex,
    correctAnswer
  };
};

// 生成诗词理解题
const generateUnderstandingQuestion = (poem, allPoems) => {
  // 根据诗词内容和年级特点生成题目
  const questionTemplates = {
    // 低年级(1-2年级)题目模板
    lower: [
      {
        question: '这首诗描写了什么？',
        getOptions: (poem) => {
          const options = {
            '咏鹅': ['大白鹅的样子', '小鸭子游泳', '小鸟飞翔', '鱼儿游戏'],
            '江南': ['采莲和鱼儿嬉戏的景象', '下雨天的景色', '春天的景色', '冬天的景色'],
            '画': ['山水景色', '花鸟虫鱼', '日月星辰', '亭台楼阁'],
            '悯农': ['农民劳作的辛苦', '田园风光', '收获的喜悦', '春天播种']
          };
          return options[poem.title] || generateDefaultOptions();
        }
      }
    ],
    // 中年级(3-4年级)题目模板
    middle: [
      {
        question: '这首诗运用了什么写作手法？',
        getOptions: (poem) => {
          const options = {
            '绝句': ['拟人、衬托', '比喻、夸���', '对比、借景', '象征、暗示'],
            '清明': ['比喻、拟人', '夸张、对比', '借景抒情', '象征、衬托']
          };
          return options[poem.title] || generateDefaultOptions();
        }
      }
    ],
    // 高年级(5-6年级)题目模板
    higher: [
      {
        question: '这首诗表达了作者怎样的思想感情？',
        getOptions: (poem) => {
          const options = {
            '示儿': ['勉励儿子勤奋学习的期望', '对儿子的深深思念', '对人生的感悟', '对未来的憧憬'],
            '过故人庄': ['对友情的珍惜和怀念', '对仕途的无奈', '对理想的追求', '对生活的感慨']
          };
          return options[poem.title] || generateDefaultOptions();
        }
      }
    ]
  };

  // 根据年级选择题目模板
  const gradeLevel = getGradeLevel(poem.id);
  const templates = questionTemplates[gradeLevel];
  const template = templates[Math.floor(Math.random() * templates.length)];
  
  const options = template.getOptions(poem);
  const correctAnswer = options[0];
  const shuffledOptions = options.sort(() => Math.random() - 0.5);
  const correctIndex = shuffledOptions.indexOf(correctAnswer);

  const poemInfo = [
    `《${poem.title || '无题'}》`,
    `【${poem.dynasty || '朝代不详'}】`,
    `${poem.author ? poem.author.trim() : '佚名'}`,
    ...poem.content
  ].join('\n');

  return {
    type: 'understanding',
    question: template.question,
    poemInfo: {
      title: poem.title,
      dynasty: poem.dynasty,
      author: poem.author,
      content: poem.content
    },
    options: shuffledOptions,
    answer: correctIndex,
    correctAnswer
  };
};

// 根据诗词ID判断年级等级
const getGradeLevel = (poemId) => {
  const grade = Math.ceil(poemId / 20); // 假设每个年级20首诗
  if (grade <= 2) return 'lower';
  if (grade <= 4) return 'middle';
  return 'higher';
};

// 生成默认选项
const generateDefaultOptions = () => [
  '描写自然景色',
  '表达思乡之情',
  '歌颂友情',
  '赞美人物'
];

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
    
    const questions = [];
    const availablePoems = [...poems];
    
    switch(difficulty) {
      case 'EASY':
        // 简单模式：10道填空题
        while (questions.length < 10 && availablePoems.length > 0) {
          const randomIndex = Math.floor(Math.random() * availablePoems.length);
          const selectedPoem = availablePoems[randomIndex];
          questions.push(generateBlankQuestion(selectedPoem, poems));
          availablePoems.splice(randomIndex, 1);
        }
        break;
        
      case 'MEDIUM':
        // 中等模式：10道填空题 + 10道理解题
        while (questions.length < 20 && availablePoems.length > 0) {
          const randomIndex = Math.floor(Math.random() * availablePoems.length);
          const selectedPoem = availablePoems[randomIndex];
          if (questions.length < 10) {
            questions.push(generateBlankQuestion(selectedPoem, poems));
          } else {
            questions.push(generateUnderstandingQuestion(selectedPoem, poems));
          }
          availablePoems.splice(randomIndex, 1);
        }
        break;
        
      case 'HARD':
        // 困难模式：30道理解题
        while (questions.length < 30 && availablePoems.length > 0) {
          const randomIndex = Math.floor(Math.random() * availablePoems.length);
          const selectedPoem = availablePoems[randomIndex];
          questions.push(generateUnderstandingQuestion(selectedPoem, poems));
          availablePoems.splice(randomIndex, 1);
        }
        break;
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