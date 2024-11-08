export const GRADES = [
  {
    grade: 1,
    name: '一年级',
    terms: [
      {
        id: 'grade1_1',
        name: '上册',
        poems: ['咏鹅', '江南', '画', '悯农', '古朗月行']
      },
      {
        id: 'grade1_2',
        name: '下册',
        poems: ['春晓', '赠汪伦', '登鹳雀楼', '望庐山瀑布']
      }
    ]
  },
  {
    grade: 2,
    name: '二年级',
    terms: [
      {
        id: 'grade2_1',
        name: '上册',
        poems: ['村居', '绝句', '咏柳', '塞下曲']
      },
      {
        id: 'grade2_2',
        name: '下册',
        poems: ['夜宿山寺', '敕勒歌', '四时田园杂兴']
      }
    ]
  },
  {
    grade: 3,
    name: '三年级',
    terms: [
      {
        id: 'grade3_1',
        name: '上册',
        poems: ['望天门山', '饮湖上初晴后雨', '山行']
      },
      {
        id: 'grade3_2',
        name: '下册',
        poems: ['赋得古原草送别', '望洞庭', '浪淘沙']
      }
    ]
  },
  {
    grade: 4,
    name: '四年级',
    terms: [
      {
        id: 'grade4_1',
        name: '上册',
        poems: ['暮江吟', '题西林壁', '游山西村']
      },
      {
        id: 'grade4_2',
        name: '下册',
        poems: ['清平乐·村居', '牧童', '敕勒歌']
      }
    ]
  },
  {
    grade: 5,
    name: '五年级',
    terms: [
      {
        id: 'grade5_1',
        name: '上册',
        poems: ['送杜少府之任蜀州', '望岳', '忆江南']
      },
      {
        id: 'grade5_2',
        name: '下册',
        poems: ['夜雨寄北', '泊船瓜洲', '游子吟']
      }
    ]
  },
  {
    grade: 6,
    name: '六年级',
    terms: [
      {
        id: 'grade6_1',
        name: '上册',
        poems: ['独坐敬亭山', '示儿', '菩萨蛮']
      },
      {
        id: 'grade6_2',
        name: '下册',
        poems: ['书湖阴先生壁', '过故人庄', '诗经·关雎']
      }
    ]
  }
];

export const DIFFICULTY_LEVELS = {
  EASY: {
    name: '简易模式',
    description: '适合初学者，题目简单，时间充裕',
    questionCount: 10,
    timeLimit: 15
  },
  MEDIUM: {
    name: '一般模式',
    description: '适合熟练掌握者，题目适中，需要认真思考',
    questionCount: 20,
    timeLimit: 25
  },
  HARD: {
    name: '困难模式',
    description: '挑战级难度，题目较难，需要深入理解',
    questionCount: 30,
    timeLimit: 30
  }
};