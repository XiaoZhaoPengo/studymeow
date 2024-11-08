export const parsePoetry = (content) => {
  const poems = [];
  let currentPoem = null;
  
  content.split('\n').forEach(line => {
    line = line.trim();
    if (!line || line.includes('年级')) return;
    
    if (/^\d{2}$/.test(line)) {
      if (currentPoem) poems.push(currentPoem);
      currentPoem = {
        id: line,
        title: '',
        author: '',
        dynasty: '',
        content: []
      };
    } else if (currentPoem) {
      if (!currentPoem.title) {
        currentPoem.title = line;
      } else if (line.includes('【') && line.includes('】')) {
        const match = line.match(/【(.+)】(.+)/);
        if (match) {
          currentPoem.dynasty = match[1];
          currentPoem.author = match[2].trim();
        }
      } else if (!line.includes('注：')) {
        currentPoem.content.push(line);
      }
    }
  });
  
  if (currentPoem) poems.push(currentPoem);
  return poems;
}; 