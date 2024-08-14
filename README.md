# textlint-rule-ja-overlooked-typo

[![npm version](https://badge.fury.io/js/textlint-rule-ja-overlooked-typo.svg)](https://badge.fury.io/js/textlint-rule-ja-overlooked-typo)
[![Node.js CI](https://github.com/GunseiKPaseri/textlint-rule-ja-overlooked-typo/actions/workflows/ci.yml/badge.svg)](https://github.com/GunseiKPaseri/textlint-rule-ja-overlooked-typo/actions/workflows/ci.yml)
[![textlint rule](https://img.shields.io/badge/textlint-fixable-green.svg?style=social)](https://textlint.github.io/) 

`textlint-rule-ja-tojihiraki` は見逃しそうなタイプミスを検出します。

例：
- カタカナに混じる漢字
  - `二ュートン`→`ニュートン`
- カタカナに混じるひらがな
  - `タぺストリー`→`タペストリー`
- ひらがなに混じるカタカナ
  - `たいヘん`→`たいへん`

## インストール

```
npm install -g textlint-rule-ja-overlooked-typo
```

## 使い方

`.textlintrc` を利用する場合

```json
{
    "rules": {
        "ja-overlooked-typo": true
    }
}
```

CLIから利用する場合

```
textlint --rule ja-overlooked-typo README.md
```

## オプション

- `allow`：例外とする文字列のリスト
  - `"$num$"`：カタカナの単位等で数字が入る場合に含める（漢数字が入る場合を例外として扱います）

```
{
  "rules": {
    "ja-overlooked-typo": {
      "allow": ["$num$ペニー"]
    }
  }
}
```

## 開発

###  ビルド

```
npm run build
```

### テスト

```
npm test
```
