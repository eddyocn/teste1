import fs from 'node:fs';
import path from 'node:path';
import archiver from 'archiver';

const repoRoot = path.resolve('.');
const src = path.join(repoRoot, 'extension-src');
const dist = path.join(repoRoot, 'dist');

function ensureDir(p){ if(!fs.existsSync(p)) fs.mkdirSync(p, { recursive:true }); }

// limpa dist
fs.rmSync(dist, { recursive: true, force: true });
ensureDir(dist);

// verifica existência
if(!fs.existsSync(src)){
  console.error('Pasta extension-src/ não encontrada. Coloque os arquivos da extensão em extension-src/ e rode novamente.');
  process.exit(1);
}

// arquivos essenciais (manifest.json)
const manifestSrc = path.join(src, 'manifest.json');
if(!fs.existsSync(manifestSrc)){
  console.error('Arquivo manifest.json não encontrado em extension-src/');
  process.exit(1);
}

// copia recursiva de src para dist
function copyRecursive(from, to){
  const stat = fs.statSync(from);
  if(stat.isDirectory()){
    ensureDir(to);
    for(const name of fs.readdirSync(from)){
      copyRecursive(path.join(from, name), path.join(to, name));
    }
  } else {
    ensureDir(path.dirname(to));
    fs.copyFileSync(from, to);
  }
}

// copiar manifest
fs.copyFileSync(manifestSrc, path.join(dist, 'manifest.json'));

// copiar pastas comuns
const folders = ['src','icons','_locales'];
for(const f of folders){
  const p = path.join(src, f);
  if(fs.existsSync(p)){
    copyRecursive(p, path.join(dist, f));
  }
}

// copia quaisquer arquivos soltos na raiz de extension-src
for(const file of fs.readdirSync(src)){
  const full = path.join(src, file);
  if(fs.statSync(full).isFile() && file !== 'manifest.json'){
    fs.copyFileSync(full, path.join(dist, file));
  }
}

// gerar zip
const output = fs.createWriteStream(path.join(dist, 'extension.zip'));
const archive = archiver('zip', { zlib: { level: 9 } });
archive.pipe(output);
archive.directory(dist, false);

archive.finalize().then(()=>{
  console.log('Build da extensão pronto: dist/ e dist/extension.zip');
}).catch(err=>{
  console.error('Erro ao gerar zip:', err);
  process.exit(1);
});
