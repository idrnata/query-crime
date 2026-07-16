export function executeSql(query: string, db: Record<string, any[]>): any[] {
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
    
    // Handle symbols and operators (comma, equals, semicolon, etc.)
    if (/[=,;<>!]/.test(query[i])) {
      let start = i;
      i++;
      while (i < query.length && /[=,;<>!]/.test(query[i])) {
        i++;
      }
      const symbol = query.substring(start, i);
      // Skip statement terminator semicolon if it's separate, but keep operators and commas
      if (symbol !== ';') {
        tokens.push(symbol);
      }
      continue;
    }
    
    // Handle words, numbers, fields with aliases (e.g. c.name), and asterisk (*)
    let start = i;
    while (i < query.length && !/\s/.test(query[i]) && !/[=,;'"<>]/.test(query[i])) {
      i++;
    }
    tokens.push(query.substring(start, i));
  }
  
  let selectIdx = tokens.findIndex(t => t.toUpperCase() === 'SELECT');
  let fromIdx = tokens.findIndex(t => t.toUpperCase() === 'FROM');
  let whereIdx = tokens.findIndex(t => t.toUpperCase() === 'WHERE');
  let orderIdx = tokens.findIndex((t, i) => t.toUpperCase() === 'ORDER' && tokens[i+1] && tokens[i+1].toUpperCase() === 'BY');
  let limitIdx = tokens.findIndex(t => t.toUpperCase() === 'LIMIT');
  
  if (selectIdx === -1 || fromIdx === -1) throw new Error("SYNTAX ERROR: SELECT atau FROM tidak ditemukan");
  
  // Find all JOIN positions
  const joinStarts: { index: number; isLeft: boolean }[] = [];
  for (let k = fromIdx + 1; k < tokens.length; k++) {
    if (tokens[k].toUpperCase() === 'JOIN') {
      if (k > 0 && tokens[k-1].toUpperCase() === 'LEFT') {
        continue; // Already handled when LEFT was checked
      }
      joinStarts.push({ index: k, isLeft: false });
    } else if (tokens[k].toUpperCase() === 'LEFT' && tokens[k+1]?.toUpperCase() === 'JOIN') {
      joinStarts.push({ index: k, isLeft: true });
    }
  }
  
  let mainTableEnd = tokens.length;
  if (joinStarts.length > 0) {
    mainTableEnd = joinStarts[0].index;
  } else if (whereIdx !== -1) {
    mainTableEnd = whereIdx;
  } else if (orderIdx !== -1) {
    mainTableEnd = orderIdx;
  } else if (limitIdx !== -1) {
    mainTableEnd = limitIdx;
  }
  
  let mainTableTokens = tokens.slice(fromIdx + 1, mainTableEnd);
  let mainTable = mainTableTokens[0];
  let mainAlias = mainTableTokens.length > 1 ? mainTableTokens[1] : null;
  
  let results = db[mainTable] ? [...db[mainTable]] : null;
  if (!results) throw new Error(`TABLE NOT FOUND: ${mainTable}`);
  
  // give fields alias prefix if alias exists
  if (mainAlias) {
    results = results.map(row => {
        let prefixed: any = {};
        for(let k in row) {
            prefixed[`${mainAlias}.${k}`] = row[k];
            prefixed[k] = row[k]; // keep original for simple queries
        }
        return prefixed;
    });
  }

  // Process sequential JOINs
  for (let j = 0; j < joinStarts.length; j++) {
    const { index: start, isLeft } = joinStarts[j];
    const nextBoundary = (j + 1 < joinStarts.length) 
      ? joinStarts[j+1].index 
      : ([whereIdx, orderIdx, limitIdx, tokens.length].filter(x => x !== -1).sort((a,b)=>a-b)[0]);
      
    const joinBlock = tokens.slice(start, nextBoundary);
    const onRelIdx = joinBlock.findIndex(t => t.toUpperCase() === 'ON');
    if (onRelIdx === -1) throw new Error("SYNTAX ERROR: JOIN membutuhkan ON");
    
    const joinTableIdx = isLeft ? 2 : 1;
    const joinTable = joinBlock[joinTableIdx];
    const joinAlias = (onRelIdx > joinTableIdx + 1) ? joinBlock[joinTableIdx + 1] : null;
    
    if (!db[joinTable]) throw new Error(`TABLE NOT FOUND: ${joinTable}`);
    
    const onTokens = joinBlock.slice(onRelIdx + 1);
    let joined = [];
    
    for (let r1 of results) {
      let matched = false;
      for (let r2 of db[joinTable]) {
         let r2Prefixed: any = {};
         if (joinAlias) {
             for(let k in r2) {
                 r2Prefixed[`${joinAlias}.${k}`] = r2[k];
                 r2Prefixed[k] = r2[k];
             }
         } else {
             r2Prefixed = r2;
         }

         let combined = {...r1, ...r2Prefixed};
         let left = onTokens[0];
         let op = onTokens[1]; // '='
         let right = onTokens[2];
         if (combined[left] == combined[right]) {
            joined.push(combined);
            matched = true;
         }
      }

      if (!matched && isLeft) {
        // For LEFT JOIN, if no match found, add row with null values for join table columns
        let r2Null: any = {};
        let sampleRow = db[joinTable][0] || {};
        for (let k in sampleRow) {
           if (joinAlias) r2Null[`${joinAlias}.${k}`] = null;
           r2Null[k] = null;
        }
        joined.push({...r1, ...r2Null});
      }
    }
    results = joined;
  }
  
  if (whereIdx !== -1) {
    let whereEnd = [orderIdx, limitIdx, tokens.length].filter(x => x !== -1).sort((a,b)=>a-b)[0];
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
        let val = whereTokens[i+2]?.replace(/['"]/g, '');
        conditions.push({ col, op, val });
        i += 3;
      }
      
      if (whereTokens[i]?.toUpperCase() === 'AND') {
        i++;
      }
    }
    
    for (let cond of conditions) {
       const { col, op, val, start, end } = cond;
       
       if (op === 'BETWEEN') {
         results = results.filter(row => String(row[col]) >= String(start) && String(row[col]) <= String(end));
       } else if (op === 'IS NULL') {
         results = results.filter(row => row[col] === null || row[col] === undefined);
       } else {
         results = results.filter(row => {
            if (op === '=') {
              const sRow = String(row[col]);
              const sVal = String(val);
              if (sRow === sVal) return true;
              return sRow.replace(/\s+/g, '').toUpperCase() === sVal.replace(/\s+/g, '').toUpperCase();
            }
            if (op === '>') return Number(row[col]) > Number(val);
            if (op === '<') return Number(row[col]) < Number(val);
            if (op === 'LIKE') return String(row[col]).includes(String(val).replace(/%/g, ''));
            return false;
         });
       }
    }
  }
  
  if (orderIdx !== -1) {
      let orderCol = tokens[orderIdx + 2];
      let orderDir = tokens[orderIdx + 3]?.toUpperCase();
      let isDesc = orderDir === 'DESC';
      results.sort((a, b) => {
          let valA = a[orderCol];
          let valB = b[orderCol];
          
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
      if (!(f in row)) throw new Error(`COLUMN NOT FOUND: ${f}`);
      // output exactly what the user typed in select e.g. v.plate_number or plate_number
      newRow[f] = row[f];
    }
    return newRow;
  });
}
