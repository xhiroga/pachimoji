import * as THREE from "three";

/**
 * 既存の色群から、視覚的に最も区別しやすい色を返します。
 * HSL空間で探索を行い、既存の色との最小距離が最大になる色を選定します。
 *
 * @param existingColors 既存の色の配列 (CSS color strings, e.g., "#ff0000", "rgb(255, 0, 0)")
 * @returns 新しい色の16進数文字列 (e.g., "#00ff00")
 */
export function getDistinctColor(existingColors: string[]): string {
    if (existingColors.length === 0) {
        return "#ff0000"; // デフォルト
    }

    // 既存の色をHSLに変換
    const existingHSLs = existingColors.map((colorStr) => {
        const color = new THREE.Color(colorStr);
        const hsl = { h: 0, s: 0, l: 0 };
        color.getHSL(hsl);
        return hsl;
    });

    let bestColor = "#000000";
    let maxMinDistance = -1;

    // 候補色を生成して評価
    // 色相(H)を重点的に探索
    const hueSteps = 36; // 10度刻み
    const satSteps = 2;  // 彩度は高めと中くらい
    const lightSteps = 2; // 輝度は明るめと暗め

    for (let h = 0; h < 1; h += 1 / hueSteps) {
        for (let s = 0.5; s <= 1.0; s += 0.5) {
            for (let l = 0.4; l <= 0.8; l += 0.4) {
                let minDistance = Number.MAX_VALUE;

                for (const existing of existingHSLs) {
                    // HSL空間での距離を計算
                    // 色相は環状なので、最短距離をとる
                    let hDiff = Math.abs(h - existing.h);
                    if (hDiff > 0.5) hDiff = 1.0 - hDiff;

                    // 色相の違いを重視する重み付け
                    const dist = Math.sqrt(
                        (hDiff * 2) ** 2 +
                        (s - existing.s) ** 2 +
                        (l - existing.l) ** 2
                    );

                    if (dist < minDistance) {
                        minDistance = dist;
                    }
                }

                if (minDistance > maxMinDistance) {
                    maxMinDistance = minDistance;
                    const color = new THREE.Color().setHSL(h, s, l);
                    bestColor = "#" + color.getHexString();
                }
            }
        }
    }

    return bestColor;
}
