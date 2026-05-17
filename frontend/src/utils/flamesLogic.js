export const calculateFLAMES = (n1, n2) => {
  let name1 = n1.toLowerCase().replace(/\s/g, '').split('');
  let name2 = n2.toLowerCase().replace(/\s/g, '').split('');

  name1.forEach((char, index) => {
    let foundIndex = name2.indexOf(char);
    if (foundIndex !== -1) {
      name1[index] = null;
      name2[foundIndex] = null;
    }
  });

  const count = [...name1, ...name2].filter(c => c !== null).length;
  if (count === 0) return 'S';

  let flames = ['F', 'L', 'A', 'M', 'E', 'S'];
  let pos = 0;

  while (flames.length > 1) {
    pos = (pos + count - 1) % flames.length;
    flames.splice(pos, 1);
  }

  return flames[0];
};

export const getFlamesAnimationSteps = (n1, n2) => {
  const name1Array = n1.toLowerCase().replace(/\s/g, '').split('');
  const name2Array = n2.toLowerCase().replace(/\s/g, '').split('');
  
  const commonIndices1 = [];
  const commonIndices2 = [];
  
  let tempName1 = [...name1Array];
  let tempName2 = [...name2Array];

  tempName1.forEach((char, index) => {
    let foundIndex = tempName2.indexOf(char);
    if (foundIndex !== -1) {
      commonIndices1.push(index);
      commonIndices2.push(foundIndex);
      tempName1[index] = null;
      tempName2[foundIndex] = null;
    }
  });

  const count = [...tempName1, ...tempName2].filter(c => c !== null).length;

  let flames = ['F', 'L', 'A', 'M', 'E', 'S'];
  let pos = 0;
  const eliminationSteps = [];

  if (count === 0) {
    return {
      name1Array,
      name2Array,
      commonIndices1,
      commonIndices2,
      count: 0,
      eliminationSteps: ['F', 'L', 'A', 'M', 'E'],
      finalResult: 'S'
    };
  }

  while (flames.length > 1) {
    pos = (pos + count - 1) % flames.length;
    eliminationSteps.push(flames[pos]);
    flames.splice(pos, 1);
  }

  return {
    name1Array,
    name2Array,
    commonIndices1,
    commonIndices2,
    count,
    eliminationSteps,
    finalResult: flames[0]
  };
};

export const FLAMES_MEANINGS = {
  F: { title: 'Friends', emoji: '🤝', color: '#3498db', description: 'A bond that lasts forever.' },
  L: { title: 'Love', emoji: '❤️', color: '#e74c3c', description: 'A deep and passionate connection.' },
  A: { title: 'Affection', emoji: '😊', color: '#f1c40f', description: 'Genuine care and fondness.' },
  M: { title: 'Marriage', emoji: '💍', color: '#9b59b6', description: 'A lifetime of togetherness.' },
  E: { title: 'Enemy', emoji: '🔥', color: '#e67e22', description: 'A spicy and intense rivalry.' },
  S: { title: 'Sister', emoji: '👧', color: '#2ecc71', description: 'A protective and sibling-like bond.' }
};
