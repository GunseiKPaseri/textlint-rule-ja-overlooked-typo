import TextLintTester from "textlint-tester";
import rule from "../src/index";

const tester = new TextLintTester();

tester.run("カタカナに混入する漢字", rule, {
  valid: [
    "二つに一つ",
    "二酸化マンガン",
    "二クロム酸カリウム",
    "二センチメートル",
    "入力チェック",
    "簡単な入力チェック",
  ],
  invalid: [
    {
      text: "二クロム線",
      output: "ニクロム線",
      errors: [
        {
          message: "漢字の「二」はカタカナの「ニ」の誤りの可能性があります",
          range: [0, 1],
        },
      ],
    },
    {
      text: "タ二タ",
      output: "タニタ",
      errors: [
        {
          message: "漢字の「二」はカタカナの「ニ」の誤りの可能性があります",
          range: [1, 2],
        },
      ],
    },
    {
      text: "タニ夕",
      output: "タニタ",
      errors: [
        {
          message: "漢字の「夕」はカタカナの「タ」の誤りの可能性があります",
          range: [2, 3],
        },
      ],
    },
    {
      text: "工タニティ",
      output: "エタニティ",
      errors: [
        {
          message: "漢字の「工」はカタカナの「エ」の誤りの可能性があります",
          range: [0, 1],
        },
      ],
    },
    {
      text: "力タストロフィ",
      output: "カタストロフィ",
      errors: [
        {
          message: "漢字の「力」はカタカナの「カ」の誤りの可能性があります",
          range: [0, 1],
        },
      ],
    },
    {
      text: "ライ千",
      output: "ライチ",
      errors: [
        {
          message: "漢字の「千」はカタカナの「チ」の誤りの可能性があります",
          range: [2, 3],
        },
      ],
    },
    {
      text: "卜リニティ",
      output: "トリニティ",
      errors: [
        {
          message: "漢字の「卜」はカタカナの「ト」の誤りの可能性があります",
          range: [0, 1],
        },
      ],
    },
    {
      text: "三ント",
      output: "ミント",
      errors: [
        {
          message: "漢字の「三」はカタカナの「ミ」の誤りの可能性があります",
          range: [0, 1],
        },
      ],
    },
    {
      text: "八ーモニー",
      output: "ハーモニー",
      errors: [
        {
          message: "漢字の「八」はカタカナの「ハ」の誤りの可能性があります",
          range: [0, 1],
        },
      ],
    },
    {
      text: "コー匕ー",
      output: "コーヒー",
      errors: [
        {
          message: "漢字の「匕」はカタカナの「ヒ」の誤りの可能性があります",
          range: [2, 3],
        },
      ],
    },
    {
      text: "口スト",
      output: "ロスト",
      errors: [
        {
          message: "漢字の「口」はカタカナの「ロ」の誤りの可能性があります",
          range: [0, 1],
        },
      ],
    },
  ],
});

tester.run("カタカナに混入するひらがな", rule, {
  valid: [
    "フランスへ行く",
    "文字列のリスト",
    "このリージョン",
    "行ったりキタリ",
    "ハマりまくり",
    "データベースへアクセス",
    "アへン",
  ],
  invalid: [
    {
      text: "アへン",
      output: "アヘン",
      errors: [
        {
          message: "ひらがなの「へ」はカタカナの「ヘ」の誤りの可能性があります",
          range: [1, 2],
        },
      ],
      options: {
        strictMode: true,
      },
    },
    {
      text: "タぺストリー",
      output: "タペストリー",
      errors: [
        {
          message: "ひらがなの「ぺ」はカタカナの「ペ」の誤りの可能性があります",
          range: [1, 2],
        },
      ],
    },
    {
      text: "スべスベ",
      output: "スベスベ",
      errors: [
        {
          message: "ひらがなの「べ」はカタカナの「ベ」の誤りの可能性があります",
          range: [1, 2],
        },
      ],
    },
    {
      text: "アりエール",
      output: "アリエール",
      errors: [
        {
          message: "ひらがなの「り」はカタカナの「リ」の誤りの可能性があります",
          range: [1, 2],
        },
      ],
    },
  ],
});

tester.run("ひらがなに混入するカタカナ", rule, {
  invalid: [
    {
      text: "あヘん",
      output: "あへん",
      errors: [
        {
          message: "カタカナの「ヘ」はひらがなの「へ」の誤りの可能性があります",
          range: [1, 2],
        },
      ],
    },
    {
      text: "とらペじうむ",
      output: "とらぺじうむ",
      errors: [
        {
          message: "カタカナの「ペ」はひらがなの「ぺ」の誤りの可能性があります",
          range: [2, 3],
        },
      ],
    },
    {
      text: "すベすべ",
      output: "すべすべ",
      errors: [
        {
          message: "カタカナの「ベ」はひらがなの「べ」の誤りの可能性があります",
          range: [1, 2],
        },
      ],
    },
    {
      text: "あリえーる",
      output: "ありえーる",
      errors: [
        {
          message: "カタカナの「リ」はひらがなの「り」の誤りの可能性があります",
          range: [1, 2],
        },
      ],
    },
  ],
});
