import Link from "next/link";

export default function LicensesPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">ライセンス / Licenses</h1>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">生成物（ユーザー作成画像）の取扱い</h2>
        <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
          <p>
            本サービスで利用者が作成した画像に関する著作権は、利用者に帰属します。
          </p>
          <p>
            利用者は、作成した画像について、法令等に反しない限り、商用・非商用を問わず自由に使用・複製・改変・頒布・公開できます。
          </p>
          <p>
            ただし、フォント単体での再配布をはじめとした、フォントのライセンスに違反する行為を固く禁じます。
          </p>
          <p>
            クレジット表記は不要です。ぜひ周囲の方にもパチ文字メーカーをご紹介いただけますと幸いです。
          </p>
          <div className="text-xs text-gray-500">
            免責: 作成した画像およびその利用に起因して生じた一切の事項について、本サービスは保証・責任を負いません。
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">フォントのライセンス / Font Licenses</h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          本サービスにおけるフォントの使用は、それぞれのライセンスに従います。
        </p>

        <ul className="list-disc pl-5 space-y-3 text-sm text-gray-700">
          <li>
            <a
              href="https://fonts.google.com/noto/specimen/Noto+Sans+JP"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-900 font-medium"
            >
              Noto Sans JP
            </a>
            <span> - SILオープンフォントライセンス バージョン1.1に準拠</span>
            <span> （</span>
            <a
              href="https://scripts.sil.org/OFL"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-900"
            >
              ライセンス
            </a>
            <span>）</span>
          </li>
          <li>
            <a
              href="https://flopdesign.booth.pm/items/1028555"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-900 font-medium"
            >
              装甲明朝
            </a>
            <span> - SILオープンフォントライセンス バージョン1.1に準拠</span>
            <span> （</span>
            <a
              href="https://scripts.sil.org/OFL"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-900"
            >
              ライセンス
            </a>
            <span>）</span>
          </li>
          <li>
            <a
              href="https://booth.pm/ja/items/2929647"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-900 font-medium"
            >
              玉ねぎ楷書「激」
            </a>
            <span> - フォントとして再利用できない範囲において、商用・非商用を問わず、加工・変形が可能。ただし作者を騙ることやフォントの再配布・譲渡、排外的な権利の主張は禁止</span>
            <span> （</span>
            <a
              href="https://booth.pm/ja/items/2929647"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-900"
            >
              ライセンス
            </a>
            <span>）</span>
          </li>
        </ul>
      </section>

      <div className="text-sm">
        <Link href="/" className="underline hover:text-gray-900">
          トップに戻る
        </Link>
      </div>
    </main>
  );
}
