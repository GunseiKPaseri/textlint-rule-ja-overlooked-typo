import { type matchPatternResult, matchPatterns } from "@textlint/regexp-string-matcher";
import type { TextlintRuleContext, TextlintRuleModule } from "@textlint/types";
import { type MatchCaptureGroup, matchCaptureGroupAll } from "match-index";

/**
 * global matchを利用してMatchCaptureGroup[] を返す
 * @param text 
 * @param regexp 
 * @returns 
 */
const matchAll = (text: string, regexp: RegExp):MatchCaptureGroup[] =>
  [...text.matchAll(regexp)].map(mached => ({text: mached[0], index: mached.index}));

type RuleOpts = {
  allow?: string[];
};

type ReportFunction = (node: Parameters<TextlintRuleContext['report']>[0], text: string, context: TextlintRuleContext, ignoreMatch: matchPatternResult[]) => void;

// 漢字 + カタカナ
const unnaturalKanjiWithKatakana = /[工力夕卜二八三口](?=[ァ-ヿ])|(?<=[ァ-ヿ])[工力夕卜二八三口]/g;
const kanjiToKatakanaTable: { [key: string]: string | undefined } = {
  工: "エ",
  力: "カ",
  夕: "タ",
  卜: "ト",
  二: "ニ",
  八: "ハ",
  三: "ミ",
  口: "ロ",
};

const reportKanjiWithKantakana:ReportFunction = ( node, text, context, ignoreMatch) => {
  for (const actual of matchAll(text, unnaturalKanjiWithKatakana)) {
    const { text, index } = actual;
    if (isIgnoredRange(ignoreMatch, actual)) {
      continue;
    }
    const trueText = kanjiToKatakanaTable[text];
    if (!trueText) {
      continue;
    }
    context.report(
      node,
      new context.RuleError(`漢字の「${text}」はカタカナの「${trueText}」の誤りの可能性があります`, {
        index,
        fix: context.fixer.replaceTextRange([index, index + text.length], trueText),
      }),
    );
  }
}

// ひらがな + カタカナ
const unnaturalHiraganaWithKatakana = /[へべぺり](?=[ァ-ヿ]{2,})|(?<=[ァ-ヿ])[べぺり]{2,}|(?<=[ァ-ヿ])[へ](?=[ァ-ヿ])/g

const reportHiraganaWithKantakana:ReportFunction = ( node, text, context, ignoreMatch) => {
  for (const actual of matchAll(text, unnaturalHiraganaWithKatakana)) {
    const { text, index } = actual;
    if (isIgnoredRange(ignoreMatch, actual)) {
      continue;
    }
    const trueText = String.fromCharCode(text.charCodeAt(0) + 0x60); // to katakana
    if (!trueText) {
      continue;
    }
    context.report(
      node,
      new context.RuleError(`ひらがなの「${text}」はカタカナの「${trueText}」の誤りの可能性があります`, {
        index,
        fix: context.fixer.replaceTextRange([index, index + text.length], trueText),
      }),
    );
  }
}

// カタカナ + ひらがな
const unnaturalKatakanaWithHiragana = /[ヘベペリ](?=[ぁ-ん])|(?<=[ぁ-ん])[ヘベペリ]/g

const reportKatakanaWithHiragana:ReportFunction = ( node, text, context, ignoreMatch) => {
  for (const actual of matchAll(text, unnaturalKatakanaWithHiragana)) {
    const { text, index } = actual;
    if (isIgnoredRange(ignoreMatch, actual)) {
      continue;
    }
    const trueText = String.fromCharCode(text.charCodeAt(0) - 0x60); // to hiragana
    if (!trueText) {
      continue;
    }
    context.report(
      node,
      new context.RuleError(`カタカナの「${text}」はひらがなの「${trueText}」の誤りの可能性があります`, {
        index,
        fix: context.fixer.replaceTextRange([index, index + text.length], trueText),
      }),
    );
  }
}



// 例外辞書
const builtInAllow = [
  "$num$アール",
  "$num$アト",
  "$num$アンペア",
  "$num$インチ",
  "$num$ウォン",
  "$num$エーカー",
  "$num$エクサ",
  "$num$オーム",
  "$num$オクターブ",
  "$num$オクテット",
  "$num$オングストローム",
  "$num$オンス",
  "$num$ガウス",
  "$num$カラット",
  "$num$カロリー",
  "$num$ガロン",
  "$num$ガウス",
  "$num$カンデラ",
  "$num$ギガ",
  "$num$キュビット",
  "$num$キロ",
  "$num$クーロン",
  "$num$クエクト",
  "$num$クエタ",
  "$num$グラム",
  "$num$クローネ",
  "$num$クロム酸",
  "$num$ケルビン",
  "$num$シーベルト",
  "$num$ジュール",
  "$num$スタディオン",
  "$num$ステラジアン",
  "$num$ゼタ",
  "$num$ゼプト",
  "$num$センチ",
  "$num$セント",
  "$num$デカ",
  "$num$デシ",
  //"$num$デシベル",
  "$num$テラ",
  "$num$ドゥカート",
  "$num$ドット",
  "$num$ドル",
  "$num$トン",
  "$num$ナット",
  "$num$ナノ",
  "$num$ニュートン",
  "$num$ノット",
  "$num$パーセク",
  "$num$パーセント",
  "$num$バーツ",
  "$num$バイト",
  "$num$パスカル",
  "$num$ピース",
  "$num$ビット",
  "$num$ピクセル",
  "$num$ピコ",
  "$num$フィート",
  "$num$フェムト",
  "$num$フローリン",
  "$num$フラン",
  "$num$ページ",
  "$num$ヘクタール",
  "$num$ヘクト",
  "$num$ベクレル",
  "$num$ペソ",
  "$num$ペタ",
  "$num$ベルスタ",
  "$num$ヘルツ",
  "$num$ポイント",
  "$num$ボルト",
  "$num$ポンド",
  "$num$マイル",
  "$num$マイクロ",
  "$num$ミリ",
  "$num$メートル",
  "$num$メガ",
  "$num$モル",
  "$num$ヤード",
  "$num$ユーロ",
  "$num$ヨクト",
  "$num$ヨタ",
  "$num$ライン",
  "$num$ラジアン",
  "$num$リットル",
  "$num$リラ",
  "$num$ルーメン",
  "$num$ルクス",
  "$num$ルピー",
  "$num$ロナ",
  "$num$ロント",
  "$num$ワード",
  "$num$ワット",
  "マッハ$num$",
];
const extend = (x: string[]) => x.flatMap(y => y.indexOf("$num$")  !== -1 ? [y.replaceAll("$num$", "二"), y.replaceAll("$num$", "三"), y.replaceAll("$num$", "八")] : [y])

/**
 * if actual is in the `matchPatternResults`, return true
 */
const isIgnoredRange = (matchPatternResults: matchPatternResult[], actual: MatchCaptureGroup) => {
  return matchPatternResults.some((result) => {
    return result.startIndex <= actual.index && actual.index <= result.endIndex;
  });
};

const report: TextlintRuleModule = (context, options) => {
  const { Syntax, RuleError, report, getSource, fixer } = context;
  const { allow } = options as RuleOpts;
  return {
    [Syntax.Str](node) {
      const text = getSource(node);
      const allowList = extend(allow ? [...(allow.includes("recommend") ? builtInAllow : []), ...allow] : builtInAllow);
      const ignoreMatch = matchPatterns(text, allowList);
      reportKanjiWithKantakana(node, text, context, ignoreMatch);
      reportHiraganaWithKantakana(node, text, context, ignoreMatch);
      reportKatakanaWithHiragana(node, text, context, ignoreMatch);
    },
  };
};

export default {
  linter: report,
  fixer: report,
};
