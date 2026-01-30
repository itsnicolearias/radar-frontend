#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const Jimp = require('jimp-compact');

const exts = ['.png','.jpg','.jpeg','.ico','.webp','.bmp','.gif','.svg'];
const start = process.argv[2] || process.cwd();

const files = [];

function walk(dir){
  let entries = [];
  try { entries = fs.readdirSync(dir); } catch(e){ return; }
  for(const name of entries){
    const full = path.join(dir,name);
    let stat;
    try { stat = fs.statSync(full); } catch(e){ continue; }
    if(stat.isDirectory()){
      if(['node_modules','.git','android','ios','.expo','.next'].includes(name)) continue;
      walk(full);
    } else {
      const ext = path.extname(full).toLowerCase();
      if(exts.includes(ext)) files.push(full);
    }
  }
}

walk(start);
console.log(`Found ${files.length} image files under ${start}`);
let failed = [];

(async()=>{
  for(const f of files){
    try{
      const buf = fs.readFileSync(f);
      if(!buf || buf.length === 0){
        console.error(`EMPTY: ${f}`);
        failed.push({file:f,err:'EMPTY'});
        continue;
      }
      await Jimp.read(buf);
      console.log(`OK: ${f} (${buf.length} bytes)`);
    }catch(err){
      console.error(`ERROR parsing ${f}: ${err && err.message ? err.message : err}`);
      failed.push({file:f,err:err && err.message ? err.message : String(err)});
    }
  }

  if(failed.length){
    console.error('\nSummary: failed files:');
    failed.forEach(x=>console.error(x.file + ' -> ' + x.err));
    process.exit(1);
  } else {
    console.log('\nAll images parse with jimp-compact OK');
    process.exit(0);
  }
})().catch(e=>{
  console.error(e);
  process.exit(2);
});
