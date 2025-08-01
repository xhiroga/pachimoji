const fs = require('fs');
const path = require('path');

const fontsDir = path.join(__dirname, '..', 'fonts');

console.log('\n=== フォントグリフ分析 ===\n');

fs.readdirSync(fontsDir).forEach(file => {
  if (file.endsWith('.json')) {
    try {
      const fontPath = path.join(fontsDir, file);
      const fontData = JSON.parse(fs.readFileSync(fontPath, 'utf8'));
      
      const glyphs = fontData.glyphs || {};
      const totalGlyphs = Object.keys(glyphs).length;
      
      // 有効なグリフと無効なグリフをカウント
      let validGlyphs = 0;
      let invalidGlyphs = 0;
      const invalidChars = [];
      
      Object.entries(glyphs).forEach(([char, data]) => {
        // アウトラインが空、または幅が0の場合は無効
        if (!data.o || data.o === "" || (data.x_min === 0 && data.x_max === 0)) {
          invalidGlyphs++;
          if (invalidChars.length < 10) { // 最初の10文字だけ記録
            invalidChars.push(char);
          }
        } else {
          validGlyphs++;
        }
      });
      
      console.log(`📁 ${file.replace('.json', '')}`);
      console.log(`   総グリフ数: ${totalGlyphs.toLocaleString()}文字`);
      console.log(`   ✅ 有効: ${validGlyphs.toLocaleString()}文字`);
      console.log(`   ❌ 無効: ${invalidGlyphs.toLocaleString()}文字`);
      
      if (invalidGlyphs > 0) {
        console.log(`   無効な文字の例: ${invalidChars.join(', ')}${invalidGlyphs > 10 ? '...' : ''}`);
      }
      
      console.log('');
      
    } catch (error) {
      console.error(`Error reading ${file}:`, error.message);
    }
  }
});

console.log('💡 無効なグリフは3D表示されません');
console.log('   アウトラインデータが空、または幅が0の文字は表示できません\n');