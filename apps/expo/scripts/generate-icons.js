const Jimp = require('jimp-compact');
const path = require('path');
(async()=>{
  try{
    const files = [
      {w:1024,h:1024,path:path.join(__dirname,'..','assets','radar-app-icon-1024x1024.png')},
      {w:64,h:64,path:path.join(__dirname,'..','assets','radar-app-icon-64x64.png')},
      {w:64,h:64,path:path.join(__dirname,'..','assets','favicon.png')},
      {w:512,h:1024,path:path.join(__dirname,'..','assets','radar-splash.png')},
    ];
    for(const f of files){
      const image = await new Promise((res,rej)=>{
        new Jimp(f.w,f.h, 0x000000FF, (err,img)=> err?rej(err):res(img));
      });
      await image.writeAsync(f.path);
      console.log('Wrote', f.path);
    }
    process.exit(0);
  }catch(err){
    console.error(err);
    process.exit(1);
  }
})();