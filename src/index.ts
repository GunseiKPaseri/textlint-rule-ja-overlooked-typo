import { type matchPatternResult, matchPatterns } from "@textlint/regexp-string-matcher";
import type { TextlintRuleContext, TextlintRuleModule } from "@textlint/types";
import type { MatchCaptureGroup } from "match-index";
import { builtInAllowList } from "./assets/dictionary";

/**
 * global matchを利用してMatchCaptureGroup[] を返す
 * @param text
 * @param regexp
 * @returns
 */
const matchAll = (text: string, regexp: RegExp): MatchCaptureGroup[] =>
  [...text.matchAll(regexp)].map((mached) => ({ text: mached[0], index: mached.index }));

// ルールのオプション
type RuleOpts = {
  allow?: string[];
  strictMode?: true;
};

// 例外オプションの数値を展開
const extend = (x: string[]) =>
  x.flatMap((y) =>
    y.indexOf("$num$") !== -1
      ? [y.replaceAll("$num$", "二"), y.replaceAll("$num$", "三"), y.replaceAll("$num$", "八")]
      : [y],
  );

// レポート出力用関数
type ReportFunction = (
  node: Parameters<TextlintRuleContext["report"]>[0],
  text: string,
  context: TextlintRuleContext,
  ignoreMatch: matchPatternResult[],
  strictMode?: boolean,
) => void;

// レポートジェネレータ
const genReport = (
  lintTarget: MatchCaptureGroup[] | RegExp,
  replacer: (text: string) => string | undefined,
  message: (text: string, trueText: string) => string,
): ReportFunction => {
  return (node, text, context, ignoreMatch, strictMode) => {
    const matchGroups: MatchCaptureGroup[] = Array.isArray(lintTarget) ? lintTarget : matchAll(text, lintTarget);
    for (const actual of matchGroups) {
      const { text, index } = actual;
      if (isIgnoredRange(ignoreMatch, actual)) {
        continue;
      }
      const trueText = replacer(text);
      if (!trueText) {
        continue;
      }
      context.report(
        node,
        new context.RuleError(message(text, trueText), {
          index,
          fix: context.fixer.replaceTextRange([index, index + text.length], trueText),
        }),
      );
    }
  };
};

// カタカナに混じる漢字
const unnaturalKanjiWithKatakana =
  /^[工力夕千卜二八匕三口](?=[ァ-ヿ])|(?<=[ァ-ヿ])[工力夕千卜二八匕三口](?=[ァ-ヿ])|(?<=[ァ-ヿ])[工力夕千卜二八匕三口]$/g;
// 変換テーブル
const kanjiToKatakanaTable: { [key: string]: string | undefined } = {
  工: "エ",
  力: "カ",
  夕: "タ",
  千: "チ",
  卜: "ト",
  二: "ニ",
  八: "ハ",
  匕: "ヒ",
  三: "ミ",
  口: "ロ",
};

// カタカナに混じるひらがな
const unnaturalHiraganaWithKatakana =
  /[べぺ](?=[ァ-・ヽ-ヿ]{2})|(?<=[ァ-・ヽ-ヿ]{2})[べぺり]|(?<=[ァ-・ヽ-ヿ])[り](?=[ァ-・ヽ-ヿ])/g;
const optionalHWK = /(?<=[ァ-・ヽ-ヿ])[へ](?=[ァ-・ヽ-ヿ])/g;

// ひらがなに混じるカタカナ
const unnaturalKatakanaWithHiragana =
  /(?<=[^ァ-ヿ])[ヘベペリ](?=[ぁ-ゟ]{2})|(?<=[ぁ-ゟ]{2})[ヘベペリ](?=[^ァ-ヿ])|(?<=[ぁ-ゟ])[ヘベペリ](?=[ぁ-ゟ])/g;

/**
 * if actual is in the `matchPatternResults`, return true
 */
const isIgnoredRange = (matchPatternResults: matchPatternResult[], actual: MatchCaptureGroup) => {
  return matchPatternResults.some((result) => {
    return result.startIndex <= actual.index && actual.index <= result.endIndex;
  });
};

/**
 * 見分けのつかない誤字の検出
 */
const report: TextlintRuleModule = (context, options) => {
  const { Syntax, getSource } = context;
  const { allow, strictMode } = options as RuleOpts;
  return {
    [Syntax.Str](node) {
      const text = getSource(node);
      const allowList = extend(
        allow ? [...(allow.includes("recommend") ? builtInAllowList : []), ...allow] : builtInAllowList,
      );
      const ignoreMatch = matchPatterns(text, allowList);
      const checkFunctions: Parameters<typeof genReport>[] = [
        [
          unnaturalKanjiWithKatakana,
          (text) => kanjiToKatakanaTable[text],
          (text, trueText) => `漢字の「${text}」はカタカナの「${trueText}」の誤りの可能性があります`,
        ],
        [
          [...matchAll(text, unnaturalHiraganaWithKatakana), ...(strictMode ? matchAll(text, optionalHWK) : [])],
          (text) => String.fromCharCode(text.charCodeAt(0) + 0x60),
          (text, trueText) => `ひらがなの「${text}」はカタカナの「${trueText}」の誤りの可能性があります`,
        ],
        [
          unnaturalKatakanaWithHiragana,
          (text) => String.fromCharCode(text.charCodeAt(0) - 0x60),
          (text, trueText) => `カタカナの「${text}」はひらがなの「${trueText}」の誤りの可能性があります`,
        ],
      ];
      for (const params of checkFunctions) {
        genReport(...params)(node, text, context, ignoreMatch, strictMode);
      }
    },
  };
};

export default {
  linter: report,
  fixer: report,
};
