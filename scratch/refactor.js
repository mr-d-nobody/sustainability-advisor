const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.jsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('e:/ProjectsDS/sustainability_advisor/sustainability-advisor/src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('http://localhost:5000')) {
    const relativeDepth = file.split(path.sep).length - 5; // e:/ProjectsDS/sustainability_advisor/sustainability-advisor/src is 5 parts on windows depending on how it's split. Let's compute exact relative path:
    
    // get relative path from file dir to src
    let srcPath = 'e:/ProjectsDS/sustainability_advisor/sustainability-advisor/src'.replace(/\//g, path.sep);
    let relativeToSrc = path.relative(path.dirname(file), srcPath);
    let relativePath = relativeToSrc === '' ? './config' : relativeToSrc.replace(/\\/g, '/') + '/config';
    
    let newContent = content;
    
    if (file.endsWith('Dashboard.jsx')) {
      newContent = newContent.replace(/const API_URL = [^\n]+\n/, '');
    }
    
    newContent = 'import { API_URL } from "' + relativePath + '";\n' + newContent;
    newContent = newContent.replace(/"http:\/\/localhost:5000\/([^"]+)"/g, '`${API_URL}/$1`');
    newContent = newContent.replace(/"http:\/\/localhost:5000"/g, 'API_URL');
    
    fs.writeFileSync(file, newContent);
    console.log('Updated ' + file);
  }
});
