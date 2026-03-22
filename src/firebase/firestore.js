const FB = {
  key: process.env.REACT_APP_FIREBASE_API_KEY,
  pid: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  auth: 'https://identitytoolkit.googleapis.com/v1',
  fs: 'https://firestore.googleapis.com/v1'
};

/**
 * Convert JS object to Firestore value format
 */
export function toFs(val) {
  if (val === null || val === undefined) return { nullValue: null };
  if (typeof val === 'boolean') return { booleanValue: val };
  if (typeof val === 'number') return { doubleValue: val };
  if (typeof val === 'string') return { stringValue: val };
  if (val instanceof Date) return { timestampValue: val.toISOString() };
  if (Array.isArray(val)) return { arrayValue: { values: val.map(toFs) } };
  if (typeof val === 'object') {
    const fields = {};
    for (const k in val) {
      if (val.hasOwnProperty(k)) fields[k] = toFs(val[k]);
    }
    return { mapValue: { fields } };
  }
  return { nullValue: null };
}

/**
 * Convert Firestore value to JS object
 */
export function fromFs(fval) {
  if (!fval) return null;
  if ('nullValue' in fval) return null;
  if ('booleanValue' in fval) return fval.booleanValue;
  if ('doubleValue' in fval) return fval.doubleValue;
  if ('integerValue' in fval) return parseInt(fval.integerValue);
  if ('stringValue' in fval) return fval.stringValue;
  if ('timestampValue' in fval) return new Date(fval.timestampValue);
  if ('arrayValue' in fval) return (fval.arrayValue.values || []).map(fromFs);
  if ('mapValue' in fval) {
    const obj = {};
    const fields = fval.mapValue.fields || {};
    for (const k in fields) {
      if (fields.hasOwnProperty(k)) obj[k] = fromFs(fields[k]);
    }
    return obj;
  }
  return null;
}

/**
 * Get document from Firestore
 */
export async function fsGet(path, idToken) {
  try {
    const url = `${FB.fs}/projects/${FB.pid}/databases/(default)/documents/${path}`;
    const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${idToken}`
      }
    });
    if (!res.ok) {
      if (res.status === 404) return null; // Document doesn't exist
      throw new Error(`HTTP ${res.status}`);
    }
    const doc = await res.json();
    return {
      id: doc.name.split('/').pop(),
      ...Object.entries(doc.fields || {}).reduce((obj, [k, v]) => {
        obj[k] = fromFs(v);
        return obj;
      }, {})
    };
  } catch (err) {
    console.error('fsGet error:', err);
    throw err;
  }
}

/**
 * Set/create document in Firestore
 */
export async function fsSet(path, data, idToken) {
  try {
    const parentPath = path.substring(0, path.lastIndexOf('/'));
    const docId = path.substring(path.lastIndexOf('/') + 1);
    const url = `${FB.fs}/projects/${FB.pid}/databases/(default)/documents/${parentPath}?documentId=${docId}`;
    
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fields: Object.entries(data).reduce((fields, [k, v]) => {
          fields[k] = toFs(v);
          return fields;
        }, {})
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const doc = await res.json();
    return {
      id: doc.name.split('/').pop(),
      ...Object.entries(doc.fields || {}).reduce((obj, [k, v]) => {
        obj[k] = fromFs(v);
        return obj;
      }, {})
    };
  } catch (err) {
    console.error('fsSet error:', err);
    throw err;
  }
}

/**
 * Update fields in document
 */
export async function fsPatch(path, data, idToken) {
  try {
    const url = `${FB.fs}/projects/${FB.pid}/databases/(default)/documents/${path}`;
    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fields: Object.entries(data).reduce((fields, [k, v]) => {
          fields[k] = toFs(v);
          return fields;
        }, {})
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const doc = await res.json();
    return {
      id: doc.name.split('/').pop(),
      ...Object.entries(doc.fields || {}).reduce((obj, [k, v]) => {
        obj[k] = fromFs(v);
        return obj;
      }, {})
    };
  } catch (err) {
    console.error('fsPatch error:', err);
    throw err;
  }
}

/**
 * Add new document to collection (auto-generates ID)
 */
export async function fsAdd(collectionPath, data, idToken) {
  try {
    const url = `${FB.fs}/projects/${FB.pid}/databases/(default)/documents/${collectionPath}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fields: Object.entries(data).reduce((fields, [k, v]) => {
          fields[k] = toFs(v);
          return fields;
        }, {})
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const doc = await res.json();
    return {
      id: doc.name.split('/').pop(),
      ...Object.entries(doc.fields || {}).reduce((obj, [k, v]) => {
        obj[k] = fromFs(v);
        return obj;
      }, {})
    };
  } catch (err) {
    console.error('fsAdd error:', err);
    throw err;
  }
}

/**
 * List documents in collection (with optional query)
 */
export async function fsList(collectionPath, idToken, query = {}) {
  try {
    let url = `${FB.fs}/projects/${FB.pid}/databases/(default)/documents/${collectionPath}`;
    
    // Add simple query params if provided
    const params = new URLSearchParams();
    if (query.orderBy) params.append('orderBy', query.orderBy);
    if (query.pageSize) params.append('pageSize', query.pageSize);
    if (params.toString()) url += '?' + params.toString();

    const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${idToken}`
      }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    
    const data = await res.json();
    return (data.documents || []).map(doc => ({
      id: doc.name.split('/').pop(),
      ...Object.entries(doc.fields || {}).reduce((obj, [k, v]) => {
        obj[k] = fromFs(v);
        return obj;
      }, {})
    }));
  } catch (err) {
    console.error('fsList error:', err);
    throw err;
  }
}

/**
 * Delete document
 */
export async function fsDelete(path, idToken) {
  try {
    const url = `${FB.fs}/projects/${FB.pid}/databases/(default)/documents/${path}`;
    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${idToken}`
      }
    });
    if (!res.ok && res.status !== 404) throw new Error(`HTTP ${res.status}`);
    return true;
  } catch (err) {
    console.error('fsDelete error:', err);
    throw err;
  }
}
