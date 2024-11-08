export const DIFFICULTY_LEVELS = {
  EASY: {
    name: '简易模式',
    questionCount: 10,
    timeLimit: 900,
    description: '适合初学者，题目简单，时间充裕'
  },
  MEDIUM: {
    name: '一般模式',
    questionCount: 20,
    timeLimit: 1500,
    description: '适合熟练掌握者，题目适中，需要认真思考'
  },
  HARD: {
    name: '困难模式',
    questionCount: 30,
    timeLimit: 1800,
    description: '挑战级难度，题目较难，需要深入理解'
  }
};

export const GRADES = {
  GRADE1_1: {
    id: 'grade1_1',
    name: '一年级上册',
    difficulty: DIFFICULTY_LEVELS
  },
  GRADE1_2: {
    id: 'grade1_2',
    name: '一年级下册',
    difficulty: DIFFICULTY_LEVELS
  }
}; 