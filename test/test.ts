import TextLintTester from "textlint-tester";
import rule from "../src/index";

const tester = new TextLintTester();

tester.run("カタカナに混入する漢字", rule, {
  valid: ["二つに一つ", "二酸化マンガン", "二クロム酸カリウム", "二センチメートル"],
  invalid: [
    {
      text: "二クロム線",
      output: "ニクロム線",
      errors: [
        {
          message: "漢字の「二」はカタカナの「ニ」の誤りの可能性があります",
          range: [0, 1]
        },
      ],
    },
    {
      text: "タ二タ",
      output: "タニタ",
      errors: [
        {
          message: "漢字の「二」はカタカナの「ニ」の誤りの可能性があります",
          range: [1, 2]
        },
      ],
    },
    {
      text: "タニ夕",
      output: "タニタ",
      errors: [
        {
          message: "漢字の「夕」はカタカナの「タ」の誤りの可能性があります",
          range: [2, 3]
        },
      ],
    },
    {
      text: "工タニティ",
      output: "エタニティ",
      errors: [
        {
          message: "漢字の「工」はカタカナの「エ」の誤りの可能性があります",
          range: [0, 1]
        },
      ],
    },
    {
      text: "力タストロフィ",
      output: "カタストロフィ",
      errors: [
        {
          message: "漢字の「力」はカタカナの「カ」の誤りの可能性があります",
          range: [0, 1]
        },
      ],
    },
    {
      text: "卜リニティ",
      output: "トリニティ",
      errors: [
        {
          message: "漢字の「卜」はカタカナの「ト」の誤りの可能性があります",
          range: [0, 1]
        },
      ],
    },
    {
      text: "三ント",
      output: "ミント",
      errors: [
        {
          message: "漢字の「三」はカタカナの「ミ」の誤りの可能性があります",
          range: [0, 1]
        },
      ],
    },
    {
      text: "八ーモニー",
      output: "ハーモニー",
      errors: [
        {
          message: "漢字の「八」はカタカナの「ハ」の誤りの可能性があります",
          range: [0, 1]
        },
      ],
    },
    {
      text: "口スト",
      output: "ロスト",
      errors: [
        {
          message: "漢字の「口」はカタカナの「ロ」の誤りの可能性があります",
          range: [0, 1]
        },
      ],
    },
  ],
});

tester.run("カタカナに混入するひらがな", rule, {
  valid: [
    "フランスへ行く"
  ],
  invalid: [
    {
      text: "へクタール",
      output: "ヘクタール",
      errors: [
        {
          message: "ひらがなの「へ」はカタカナの「ヘ」の誤りの可能性があります",
          range: [0, 1]
        },
      ],
    },
    {
      text: "アへン",
      output: "アヘン",
      errors: [
        {
          message: "ひらがなの「へ」はカタカナの「ヘ」の誤りの可能性があります",
          range: [1, 2]
        },
      ],
    },
    {
      text: "ぺニキュア",
      output: "ペニキュア",
      errors: [
        {
          message: "ひらがなの「ぺ」はカタカナの「ペ」の誤りの可能性があります",
          range: [0, 1]
        },
      ],
    },
    {
      text: "トラぺジウム",
      output: "トラペジウム",
      errors: [
        {
          message: "ひらがなの「ぺ」はカタカナの「ペ」の誤りの可能性があります",
          range: [2, 3]
        },
      ],
    },
    {
      text: "べビーカー",
      output: "ベビーカー",
      errors: [
        {
          message: "ひらがなの「べ」はカタカナの「ベ」の誤りの可能性があります",
          range: [0, 1]
        },
      ],
    },
    {
      text: "スべスベ",
      output: "スベスベ",
      errors: [
        {
          message: "ひらがなの「べ」はカタカナの「ベ」の誤りの可能性があります",
          range: [1, 2]
        },
      ],
    },
    {
      text: "りットル",
      output: "リットル",
      errors: [
        {
          message: "ひらがなの「り」はカタカナの「リ」の誤りの可能性があります",
          range: [0, 1]
        },
      ],
    },
    {
      text: "アりエール",
      output: "アリエール",
      errors: [
        {
          message: "ひらがなの「り」はカタカナの「リ」の誤りの可能性があります",
          range: [1, 2]
        },
      ],
    },
  ]
});


tester.run("ひらがなに混入するカタカナ", rule, {
  invalid: [
    {
      text: "ヘくたーる",
      output: "へくたーる",
      errors: [
        {
          message: "カタカナの「ヘ」はひらがなの「へ」の誤りの可能性があります",
          range: [0, 1]
        },
      ],
    },
    {
      text: "あヘん",
      output: "あへん",
      errors: [
        {
          message: "カタカナの「ヘ」はひらがなの「へ」の誤りの可能性があります",
          range: [1, 2]
        },
      ],
    },
    {
      text: "ペにきゅあ",
      output: "ぺにきゅあ",
      errors: [
        {
          message: "カタカナの「ペ」はひらがなの「ぺ」の誤りの可能性があります",
          range: [0, 1]
        },
      ],
    },
    {
      text: "とらペじうむ",
      output: "とらぺじうむ",
      errors: [
        {
          message: "カタカナの「ペ」はひらがなの「ぺ」の誤りの可能性があります",
          range: [2, 3]
        },
      ],
    },
    {
      text: "ベびーかー",
      output: "べびーかー",
      errors: [
        {
          message: "カタカナの「ベ」はひらがなの「べ」の誤りの可能性があります",
          range: [0, 1]
        },
      ],
    },
    {
      text: "すベすべ",
      output: "すべすべ",
      errors: [
        {
          message: "カタカナの「ベ」はひらがなの「べ」の誤りの可能性があります",
          range: [1, 2]
        },
      ],
    },
    {
      text: "リっとる",
      output: "りっとる",
      errors: [
        {
          message: "カタカナの「リ」はひらがなの「り」の誤りの可能性があります",
          range: [0, 1]
        },
      ],
    },
    {
      text: "あリえーる",
      output: "ありえーる",
      errors: [
        {
          message: "カタカナの「リ」はひらがなの「り」の誤りの可能性があります",
          range: [1, 2]
        },
      ],
    },
  ]
});