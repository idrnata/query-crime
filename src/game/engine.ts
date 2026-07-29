export function executeSql(query: string, db: Record<string, any[]>): any[] {
  const normalized = query.trim();
  
  // Basic CTE support: WITH name AS (subquery) mainquery
  if (normalized.toUpperCase().startsWith('WITH')) {
    const withMatch = normalized.match(/WITH\s+(\w+)\s+AS\s*\(([\s\S]+)\)\s*(SELECT[\s\S]+)/i);
    if (withMatch) {
      const cteName = withMatch[1];
      const cteSubQuery = withMatch[2];
      const mainQuery = withMatch[3];
      
      try {
        const cteResult = executeSql(cteSubQuery, db);
        const virtualDb = { ...db, [cteName]: cteResult };
        return executeSql(mainQuery, virtualDb);
      } catch (e) {
        throw e;
      }
    }
  }

  const tokens: string[] = [];
  let i = 0;
  while (i < query.length) {
    // Skip whitespace
    if (/\s/.test(query[i])) {
      i++;
      continue;
    }
    
    // Handle single quotes
    if (query[i] === "'") {
      let start = i;
      i++; // skip quote
      while (i < query.length && query[i] !== "'") {
        i++;
      }
      if (i < query.length) i++; // skip end quote
      tokens.push(query.substring(start, i));
      continue;
    }
    
    // Handle double quotes
    if (query[i] === '"') {
      let start = i;
      i++; // skip quote
      while (i < query.length && query[i] !== '"') {
        i++;
      }
      if (i < query.length) i++; // skip end quote
      tokens.push(query.substring(start, i));
      continue;
    }
    
    // Handle symbols and operators (comma, equals, semicolon, parentheses, etc.)
    if (/[=,;<>!()\-]/.test(query[i])) {
      let start = i;
      const char = query[i];
      i++;
      // Don't group parentheses with other symbols
      if (char !== '(' && char !== ')') {
        while (i < query.length && /[=,;<>!\-]/.test(query[i])) {
          i++;
        }
      }
      const symbol = query.substring(start, i);
      // Skip statement terminator semicolon if it's separate, but keep operators, commas, parentheses
      if (symbol !== ';') {
        tokens.push(symbol);
      }
      continue;
    }
    
    // Handle words, numbers, fields with aliases (e.g. c.name), and asterisk (*)
    let start = i;
    while (i < query.length && !/\s/.test(query[i]) && !/[=,;'"<>()\-]/.test(query[i])) {
      i++;
    }
    tokens.push(query.substring(start, i));
  }
  
  const findKeyword = (keyword: string, startFrom: number = 0) => {
    let parenLevel = 0;
    for (let k = startFrom; k < tokens.length; k++) {
      if (tokens[k] === '(') parenLevel++;
      if (tokens[k] === ')') parenLevel--;
      if (parenLevel === 0 && tokens[k].toUpperCase() === keyword) {
        return k;
      }
    }
    return -1;
  };

  const findCompoundKeyword = (k1: string, k2: string, startFrom: number = 0) => {
    let parenLevel = 0;
    for (let k = startFrom; k < tokens.length - 1; k++) {
      if (tokens[k] === '(') parenLevel++;
      if (tokens[k] === ')') parenLevel--;
      if (parenLevel === 0 && tokens[k].toUpperCase() === k1 && tokens[k+1].toUpperCase() === k2) {
        return k;
      }
    }
    return -1;
  };

  let selectIdx = findKeyword('SELECT');
  let fromIdx = findKeyword('FROM');
  let whereIdx = findKeyword('WHERE');
  let groupByIdx = findCompoundKeyword('GROUP', 'BY');
  let havingIdx = findKeyword('HAVING');
  let orderIdx = findCompoundKeyword('ORDER', 'BY');
  let limitIdx = findKeyword('LIMIT');
  
  if (selectIdx === -1 || fromIdx === -1) throw new Error("SYNTAX ERROR: SELECT or FROM not found");
  
  // Find all JOIN positions (at top level only)
  const joinStarts: { index: number; isLeft: boolean }[] = [];
  let parenLevel = 0;
  for (let k = fromIdx + 1; k < tokens.length; k++) {
    if (tokens[k] === '(') parenLevel++;
    if (tokens[k] === ')') parenLevel--;
    if (parenLevel !== 0) continue;

    if (tokens[k].toUpperCase() === 'JOIN') {
      let startIndex = k;
      let isLeft = false;
      if (k > 0) {
        const prev = tokens[k - 1].toUpperCase();
        if (prev === 'LEFT') {
          startIndex = k - 1;
          isLeft = true;
        } else if (['INNER', 'RIGHT', 'FULL', 'CROSS'].includes(prev)) {
          startIndex = k - 1;
        }
      }
      if (!joinStarts.some(j => j.index === startIndex)) {
        joinStarts.push({ index: startIndex, isLeft });
      }
    }
  }
  
  let mainTableEnd = tokens.length;
  if (joinStarts.length > 0) {
    mainTableEnd = joinStarts[0].index;
  } else if (whereIdx !== -1) {
    mainTableEnd = whereIdx;
  } else if (groupByIdx !== -1) {
    mainTableEnd = groupByIdx;
  } else if (havingIdx !== -1) {
    mainTableEnd = havingIdx;
  } else if (orderIdx !== -1) {
    mainTableEnd = orderIdx;
  } else if (limitIdx !== -1) {
    mainTableEnd = limitIdx;
  }
  
  const getRowVal = (row: any, colName: string) => {
    if (!row) return undefined;
    const keys = Object.keys(row);
    let exactKey = keys.find(k => k.toLowerCase() === colName.toLowerCase());
    if (!exactKey && colName.includes('.')) {
      const fieldName = colName.split('.')[1];
      exactKey = keys.find(k => k.toLowerCase() === fieldName.toLowerCase());
    }
    return exactKey ? row[exactKey] : undefined;
  };

  let mainTableTokens = tokens.slice(fromIdx + 1, mainTableEnd).filter(t => t.toUpperCase() !== 'AS');
  let mainTable = mainTableTokens[0];
  let mainAlias = mainTableTokens.length > 1 ? mainTableTokens[1] : null;
  
  const exactTableName = Object.keys(db).find(k => k.toLowerCase() === mainTable.toLowerCase());
  let results = exactTableName ? [...db[exactTableName]] : null;
  if (!results) throw new Error(`TABLE NOT FOUND: ${mainTable}`);
  
  // give fields table prefix and alias prefix
  results = results.map(row => {
      let prefixed: any = {};
      for (let k in row) {
          prefixed[`${mainTable}.${k}`] = row[k];
          if (mainAlias) {
              prefixed[`${mainAlias}.${k}`] = row[k];
          }
          prefixed[k] = row[k]; // keep original for simple queries
      }
      return prefixed;
  });

  // Process sequential JOINs
  for (let j = 0; j < joinStarts.length; j++) {
    const { index: start, isLeft } = joinStarts[j];
    const nextBoundary = (j + 1 < joinStarts.length) 
      ? joinStarts[j+1].index 
      : ([whereIdx, groupByIdx, havingIdx, orderIdx, limitIdx, tokens.length].filter(x => x !== -1).sort((a,b)=>a-b)[0]);
      
    const joinBlock = tokens.slice(start, nextBoundary);
    const onRelIdx = joinBlock.findIndex(t => t.toUpperCase() === 'ON');
    if (onRelIdx === -1) throw new Error("SYNTAX ERROR: JOIN requires ON");
    
    const tokensBeforeOn = joinBlock.slice(0, onRelIdx)
      .filter(t => !['INNER', 'LEFT', 'RIGHT', 'FULL', 'CROSS', 'JOIN', 'OUTER', 'AS'].includes(t.toUpperCase()));
    
    const joinTable = tokensBeforeOn[0];
    const joinAlias = tokensBeforeOn.length > 1 ? tokensBeforeOn[1] : null;
    
    const exactJoinTableName = Object.keys(db).find(k => k.toLowerCase() === joinTable.toLowerCase());
    if (!exactJoinTableName) throw new Error(`TABLE NOT FOUND: ${joinTable}`);
    const joinRows = db[exactJoinTableName];
    
    const onTokens = joinBlock.slice(onRelIdx + 1);
    let joined = [];
    
    for (let r1 of results) {
      let matched = false;
      for (let r2 of joinRows) {
         let r2Prefixed: any = {};
         for (let k in r2) {
             r2Prefixed[`${joinTable}.${k}`] = r2[k];
             if (joinAlias) {
                 r2Prefixed[`${joinAlias}.${k}`] = r2[k];
             }
             r2Prefixed[k] = r2[k];
         }

         let combined = {...r1, ...r2Prefixed};
         let left = onTokens[0];
         let op = onTokens[1]; // '='
         let right = onTokens[2];
         let valLeft = getRowVal(combined, left);
         let valRight = getRowVal(combined, right);
         if (valLeft == valRight) {
            joined.push(combined);
            matched = true;
         }
      }

      if (!matched && isLeft) {
        // For LEFT JOIN, if no match found, add row with null values for join table columns
        let r2Null: any = {};
        let sampleRow = joinRows[0] || {};
        for (let k in sampleRow) {
           r2Null[`${joinTable}.${k}`] = null;
           if (joinAlias) r2Null[`${joinAlias}.${k}`] = null;
           r2Null[k] = null;
        }
        joined.push({...r1, ...r2Null});
      }
    }
    results = joined;
  }
  
  if (whereIdx !== -1) {
    let whereEnd = [groupByIdx, havingIdx, orderIdx, limitIdx, tokens.length].filter(x => x !== -1).sort((a,b)=>a-b)[0];
    let whereTokens = tokens.slice(whereIdx + 1, whereEnd);
    
    // Simple parser that handles AND but respects BETWEEN ... AND
    let conditions = [];
    let i = 0;
    while (i < whereTokens.length) {
      let col = whereTokens[i];
      let op = whereTokens[i+1]?.toUpperCase();
      
      if (op === 'BETWEEN') {
        let start = whereTokens[i+2].replace(/['"]/g, '');
        // i+3 is 'AND'
        let end = whereTokens[i+4].replace(/['"]/g, '');
        conditions.push({ col, op: 'BETWEEN', start, end });
        i += 5;
      } else if (op === 'IS') {
        // Assume IS NULL
        conditions.push({ col, op: 'IS NULL' });
        i += 3;
      } else {
        let val: any = whereTokens[i+2]?.replace(/['"]/g, '');
        
        // Handle subquery: col = (SELECT ...)
        if (whereTokens[i+2] === '(') {
          let openParens = 1;
          let subQueryTokens = [];
          let j = i + 3;
          while (j < whereTokens.length && openParens > 0) {
            if (whereTokens[j] === '(') openParens++;
            if (whereTokens[j] === ')') openParens--;
            if (openParens > 0) subQueryTokens.push(whereTokens[j]);
            j++;
          }
          const subQueryStr = subQueryTokens.join(' ');
          const subResult = executeSql(subQueryStr, db);
          if (subResult && subResult.length > 0) {
            const firstRow = subResult[0];
            const firstColKey = Object.keys(firstRow)[0];
            val = firstRow[firstColKey];
          } else {
            val = null;
          }
          i = j;
        } else {
          i += 3;
        }
        conditions.push({ col, op, val });
      }
      
      if (whereTokens[i]?.toUpperCase() === 'AND') {
        i++;
      }
    }
    
    for (let cond of conditions) {
       const { col, op, val, start, end } = cond;
       
       if (op === 'BETWEEN') {
         results = results.filter(row => {
           const valCol = getRowVal(row, col);
           return String(valCol) >= String(start) && String(valCol) <= String(end);
         });
       } else if (op === 'IS NULL') {
         results = results.filter(row => {
           const valCol = getRowVal(row, col);
           return valCol === null || valCol === undefined;
         });
       } else {
         results = results.filter(row => {
            const valCol = getRowVal(row, col);
            if (op === '=') {
              const sRow = String(valCol);
              const sVal = String(val);
              if (sRow === sVal) return true;
              return sRow.replace(/\s+/g, '').toUpperCase() === sVal.replace(/\s+/g, '').toUpperCase();
            }
            if (op === '>') return Number(valCol) > Number(val);
            if (op === '<') return Number(valCol) < Number(val);
            if (op === 'LIKE') return String(valCol).includes(String(val).replace(/%/g, ''));
            return false;
         });
       }
    }
  }

  if (groupByIdx !== -1) {
    let groupByCol = tokens[groupByIdx + 2];
    const groups: Record<string, any[]> = {};
    for (let row of results) {
      const val = getRowVal(row, groupByCol);
      const key = val === undefined || val === null ? 'NULL' : String(val);
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(row);
    }
    
    let groupedResults = [];
    for (let key in groups) {
      const groupRows = groups[key];
      const representative = { ...groupRows[0] };
      representative['count(*)'] = groupRows.length;
      representative['COUNT(*)'] = groupRows.length;
      representative['count'] = groupRows.length;
      representative['Count'] = groupRows.length;
      representative['COUNT'] = groupRows.length;
      groupedResults.push(representative);
    }
    results = groupedResults;
  }

  if (havingIdx !== -1) {
    let havingEnd = [orderIdx, limitIdx, tokens.length].filter(x => x !== -1).sort((a,b)=>a-b)[0];
    let havingTokens = tokens.slice(havingIdx + 1, havingEnd);
    let havingCol = havingTokens[0];
    let havingOp = havingTokens[1];
    let havingVal = havingTokens[2];
    
    let isCountHaving = havingTokens.some(t => t.toUpperCase().includes('COUNT'));
    if (isCountHaving) {
      let opIdx = havingTokens.findIndex(t => ['>', '<', '=', '!='].includes(t));
      if (opIdx !== -1) {
        havingOp = havingTokens[opIdx];
        havingVal = havingTokens[opIdx + 1]?.replace(/['"]/g, '');
      }
      results = results.filter(row => {
        const countVal = row['COUNT(*)'] || row['count(*)'] || row['count'] || 0;
        if (havingOp === '>') return Number(countVal) > Number(havingVal);
        if (havingOp === '<') return Number(countVal) < Number(havingVal);
        if (havingOp === '=') return Number(countVal) === Number(havingVal);
        if (havingOp === '!=') return Number(countVal) !== Number(havingVal);
        return false;
      });
    } else {
      results = results.filter(row => {
        const valCol = getRowVal(row, havingCol);
        const cleanVal = havingVal?.replace(/['"]/g, '');
        if (havingOp === '=') return String(valCol) === String(cleanVal);
        if (havingOp === '>') return Number(valCol) > Number(cleanVal);
        if (havingOp === '<') return Number(valCol) < Number(cleanVal);
        return false;
      });
    }
  }
  
  if (orderIdx !== -1) {
      let orderCol = tokens[orderIdx + 2];
      let orderDir = tokens[orderIdx + 3]?.toUpperCase();
      let isDesc = orderDir === 'DESC';
      results.sort((a, b) => {
          let valA = getRowVal(a, orderCol);
          let valB = getRowVal(b, orderCol);
          
          let numA = Number(valA);
          let numB = Number(valB);
          if (!isNaN(numA) && !isNaN(numB)) {
              return isDesc ? numB - numA : numA - numB;
          }
          
          if (valA < valB) return isDesc ? 1 : -1;
          if (valA > valB) return isDesc ? -1 : 1;
          return 0;
      });
  }

  if (limitIdx !== -1) {
      let limitVal = parseInt(tokens[limitIdx + 1], 10);
      if (!isNaN(limitVal)) {
          results = results.slice(0, limitVal);
      }
  }

  // Handle Window Functions in SELECT list
  // Note: This is a simplified implementation for the game's requirements
  const selectPart = tokens.slice(selectIdx + 1, fromIdx);
  const processedResults = [...results];
  
  // Check for window function patterns
  const windowFnRegex = /(ROW_NUMBER|LEAD|LAG)\s*\((.*?)\)\s*OVER\s*\((.*?)\)(?:\s*AS\s*(\w+))?/i;
  const selectStr = selectPart.join(' ');
  
  // We'll handle multiple window functions if present
  const windowFns: { fn: string, args: string[], over: string, alias: string }[] = [];
  let currentSelectStr = selectStr;
  let match;
  while ((match = windowFnRegex.exec(currentSelectStr)) !== null) {
    const [full, fn, argsStr, overStr, alias] = match;
    windowFns.push({
      fn: fn.toUpperCase(),
      args: argsStr.split(',').map(s => s.trim()).filter(Boolean),
      over: overStr.trim(),
      alias: alias || `window_col_${windowFns.length}`
    });
    currentSelectStr = currentSelectStr.replace(full, '');
  }

  // Calculate window functions
  for (const win of windowFns) {
    const { fn, args, over, alias } = win;
    
    // Sort logic for OVER clause
    const overTokens = over.split(/\s+/);
    const partitionIdx = overTokens.findIndex(t => t.toUpperCase() === 'PARTITION');
    const orderIdx = overTokens.findIndex(t => t.toUpperCase() === 'ORDER');
    
    const partitionCol = partitionIdx !== -1 ? overTokens[partitionIdx + 2] : null;
    const winOrderCol = orderIdx !== -1 ? overTokens[orderIdx + 2] : null;
    
    // Create a copy to sort for calculation
    let calcResults = [...processedResults].map((r, idx) => ({ ...r, __original_idx: idx }));
    
    // Sort by partition and order
    calcResults.sort((a, b) => {
      if (partitionCol) {
        const valA = getRowVal(a, partitionCol);
        const valB = getRowVal(b, partitionCol);
        if (valA < valB) return -1;
        if (valA > valB) return 1;
      }
      if (winOrderCol) {
        const valA = getRowVal(a, winOrderCol);
        const valB = getRowVal(b, winOrderCol);
        if (valA < valB) return -1;
        if (valA > valB) return 1;
      }
      return 0;
    });

    // Calculate values
    let rowNum = 0;
    let lastPartitionVal: any = undefined;
    
    for (let k = 0; k < calcResults.length; k++) {
      const row = calcResults[k];
      
      if (fn === 'ROW_NUMBER') {
        if (partitionCol) {
          const currentPartitionVal = getRowVal(row, partitionCol);
          if (currentPartitionVal !== lastPartitionVal) {
            rowNum = 1;
            lastPartitionVal = currentPartitionVal;
          } else {
            rowNum++;
          }
        } else {
          rowNum++;
        }
        processedResults[row.__original_idx][alias] = rowNum;
        processedResults[row.__original_idx][fn + '()'] = rowNum; // fallback
      } else if (fn === 'LEAD') {
        const targetCol = args[0];
        const nextRow = calcResults[k + 1];
        let val = null;
        if (nextRow) {
          if (partitionCol) {
             if (getRowVal(row, partitionCol) === getRowVal(nextRow, partitionCol)) {
               val = getRowVal(nextRow, targetCol);
             }
          } else {
            val = getRowVal(nextRow, targetCol);
          }
        }
        processedResults[row.__original_idx][alias] = val;
        processedResults[row.__original_idx][`${fn}(${targetCol})`] = val;
      } else if (fn === 'LAG') {
        const targetCol = args[0];
        const prevRow = calcResults[k - 1];
        let val = null;
        if (prevRow) {
           if (partitionCol) {
             if (getRowVal(row, partitionCol) === getRowVal(prevRow, partitionCol)) {
               val = getRowVal(prevRow, targetCol);
             }
          } else {
            val = getRowVal(prevRow, targetCol);
          }
        }
        processedResults[row.__original_idx][alias] = val;
        processedResults[row.__original_idx][`${fn}(${targetCol})`] = val;
      }
    }
  }

  // Re-map results to final selection
  results = processedResults;

  let selectTokens = tokens.slice(selectIdx + 1, fromIdx).filter(t => t !== ',');
  let fields = selectTokens;
  
  if (fields.length === 1 && fields[0] === '*') {
      // clear alias prefix keys for clean output
      return results.map(row => {
          let cleanRow: any = {};
          for (let k in row) {
              if (!k.includes('.')) cleanRow[k] = row[k];
          }
          return cleanRow;
      });
  }
  
  return results.map(row => {
    let newRow: any = {};
    for (let f of fields) {
      const keys = Object.keys(row);
      let exactKey = keys.find(k => k.toLowerCase() === f.toLowerCase());
      if (!exactKey && f.toUpperCase().includes('COUNT')) {
        exactKey = keys.find(k => k.toUpperCase() === 'COUNT(*)');
      }
      if (!exactKey) throw new Error(`COLUMN NOT FOUND: ${f}`);
      // output exactly what the user typed in select e.g. v.plate_number or plate_number
      newRow[f] = row[exactKey];
    }
    return newRow;
  });
}
