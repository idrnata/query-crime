export function executeSql(query: string, db: Record<string, any[]>): any[] {
  let safeQuery = query.replace(/,/g, ' , ').replace(/=/g, ' = ').replace(/;/g, ' ');
  const tokens = safeQuery.split(/\s+/).filter(Boolean);
  
  let selectIdx = tokens.findIndex(t => t.toUpperCase() === 'SELECT');
  let fromIdx = tokens.findIndex(t => t.toUpperCase() === 'FROM');
  let joinIdx = tokens.findIndex(t => t.toUpperCase() === 'JOIN');
  let leftJoinIdx = tokens.findIndex((t, i) => t.toUpperCase() === 'LEFT' && tokens[i+1] && tokens[i+1].toUpperCase() === 'JOIN');
  let whereIdx = tokens.findIndex(t => t.toUpperCase() === 'WHERE');
  let orderIdx = tokens.findIndex((t, i) => t.toUpperCase() === 'ORDER' && tokens[i+1] && tokens[i+1].toUpperCase() === 'BY');
  
  if (selectIdx === -1 || fromIdx === -1) throw new Error("SYNTAX ERROR: SELECT atau FROM tidak ditemukan");
  
  let effectiveJoinIdx = leftJoinIdx !== -1 ? leftJoinIdx : joinIdx;
  let mainTableEnd = [effectiveJoinIdx, whereIdx, orderIdx, tokens.length].filter(x => x !== -1).sort((a,b)=>a-b)[0];
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

  if (effectiveJoinIdx !== -1) {
    let onIdx = tokens.findIndex(t => t.toUpperCase() === 'ON');
    if (onIdx === -1) throw new Error("SYNTAX ERROR: JOIN membutuhkan ON");
    
    let joinTableTokens = tokens.slice(effectiveJoinIdx + (leftJoinIdx !== -1 ? 2 : 1), onIdx);
    let joinTable = joinTableTokens[0];
    let joinAlias = joinTableTokens.length > 1 ? joinTableTokens[1] : null;

    if (!db[joinTable]) throw new Error(`TABLE NOT FOUND: ${joinTable}`);
    
    let onConditionEnd = [whereIdx, orderIdx, tokens.length].filter(x => x !== -1).sort((a,b)=>a-b)[0];
    let onTokens = tokens.slice(onIdx + 1, onConditionEnd);
    
    let joined = [];
    let isLeftJoin = leftJoinIdx !== -1;

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
         let op = onTokens[1]; // should be '='
         let right = onTokens[2];
         if (combined[left] == combined[right]) {
            joined.push(combined);
            matched = true;
         }
      }

      if (!matched && isLeftJoin) {
        // For LEFT JOIN, if no match found, add row with null values for join table columns
        let r2Null: any = {};
        // Sample a row from the join table to get its keys
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
    let whereEnd = [orderIdx, tokens.length].filter(x => x !== -1).sort((a,b)=>a-b)[0];
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
            if (op === '=') return String(row[col]) === String(val);
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
      results.sort((a, b) => {
          if (a[orderCol] < b[orderCol]) return -1;
          if (a[orderCol] > b[orderCol]) return 1;
          return 0;
      });
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
