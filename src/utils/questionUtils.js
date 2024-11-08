const generateOptions = (correctAnswer, pool) => {
  const options = [correctAnswer];
  const availablePool = pool.filter(item => item !== correctAnswer);
  
  while (options.length < 4 && availablePool.length > 0) {
    const randomIndex = Math.floor(Math.random() * availablePool.length);
    const option = availablePool[randomIndex];
    if (!options.includes(option)) {
      options.push(option);
    }
    availablePool.splice(randomIndex, 1);
  }
  
  // 随机打乱选项顺序
  return options.sort(() => Math.random() - 0.5);
};

export const generateBasicQuestion = (poem) => ({
  type: 'basic',
  question: `《${poem.title}》的作者是谁？`,
  options: generateOptions(poem.author, [
    '李白', '杜甫', '白居易', '王维', 
    '苏轼', '陆游', '骆宾王', '孟浩然'
  ]),
  answer: 0
});

export const generateSimpleContentQuestion = (poem) => {
  const firstLine = poem.content[0];
  const secondLine = poem.content[1];
  return {
    type: 'content',
    question: `《${poem.title}》中"${firstLine}"的下一句是什么？`,
    options: generateOptions(secondLine, [
      '明月松间照', '疑是银河落九天',
      '江南可采莲', '红掌拨清波',
      '处处闻啼鸟', '白云回望合'
    ]),
    answer: 0
  };
};

// 添加其他题型生成函数... 