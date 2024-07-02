# Gendiff
Console-based Node.js app for generating diff between config files. Supported formats: JSON, YAML.

[![Actions Status](https://github.com/ArthurFloyd/frontend-project-46/workflows/hexlet-check/badge.svg)](https://github.com/ArthurFloyd/frontend-project-46/actions)
[![Action-check](https://github.com/ArthurFloyd/frontend-project-46/actions/workflows/action-check.yml/badge.svg)](https://github.com/ArthurFloyd/frontend-project-46/actions/workflows/action-check.yml)
[![Maintainability](https://api.codeclimate.com/v1/badges/b38ae6aa03684cd9abaf/maintainability)](https://codeclimate.com/github/ArthurFloyd/frontend-project-46/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/b38ae6aa03684cd9abaf/test_coverage)](https://codeclimate.com/github/ArthurFloyd/frontend-project-46/test_coverage)

## How it works

The application detects file format based on its extension. It converts config to an object structure (AST), same for different formats.  
Then the app creates a diff by comparing the ASTs recursively with a function. Finally, the app renders diff in the selected `format` to the console.

## Examples

### Config files

First config:
```
{
  "common": {
    "setting1": "Value 1",
    "setting2": 200,
    "setting3": true,
    "setting6": {
      "key": "value",
      "doge": {
        "wow": ""
      }
    }
  },
  "group1": {
    "baz": "bas",
    "foo": "bar",
    "nest": {
      "key": "value"
    }
  },
  "group2": {
    "abc": 12345,
    "deep": {
      "id": 45
    }
  }
}
}
```
Second config:
```
{
  "common": {
    "follow": false,
    "setting1": "Value 1",
    "setting3": null,
    "setting4": "blah blah",
    "setting5": {
      "key5": "value5"
    },
    "setting6": {
      "key": "value",
      "ops": "vops",
      "doge": {
        "wow": "so much"
      }
    }
  },
  "group1": {
    "foo": "bar",
    "baz": "bars",
    "nest": "str"
  },
  "group3": {
    "deep": {
      "id": {
        "number": 45
      }
    },
    "fee": 100500
  }
}
```

### Output

Stylish format:
```
{
    common: {
      + follow: false
        setting1: Value 1
      - setting2: 200
      - setting3: true
      + setting3: null
      + setting4: blah blah
      + setting5: {
            key5: value5
        }
        setting6: {
            doge: {
              - wow: 
              + wow: so much
            }
            key: value
          + ops: vops
        }
    }
    group1: {
      - baz: bas
      + baz: bars
        foo: bar
      - nest: {
            key: value
        }
      + nest: str
    }
  - group2: {
        abc: 12345
        deep: {
            id: 45
        }
    }
  + group3: {
        deep: {
            id: {
                number: 45
            }
        }
        fee: 100500
    }
}
```
[![asciicast](https://asciinema.org/a/lCFa8Opnbrsta4shzUygMYvEG.svg)](https://asciinema.org/a/lCFa8Opnbrsta4shzUygMYvEG)

Plain format:
```
Property 'common.follow' was added with value: false
Property 'common.setting2' was removed
Property 'common.setting3' was updated. From true to null
Property 'common.setting4' was added with value: 'blah blah'
Property 'common.setting5' was added with value: [complex value]
Property 'common.setting6.doge.wow' was updated. From '' to 'so much'
Property 'common.setting6.ops' was added with value: 'vops'
Property 'group1.baz' was updated. From 'bas' to 'bars'
Property 'group1.nest' was updated. From [complex value] to 'str'
Property 'group2' was removed
Property 'group3' was added with value: [complex value]
```
[![asciicast](https://asciinema.org/a/xEwdvQXimNBL3CgVNwticcl8o.svg)](https://asciinema.org/a/xEwdvQXimNBL3CgVNwticcl8o)

JSON format:
```
[
 {
  "key": "common",
  "status": "nested",
  "children": [
   {
    "key": "follow",
    "status": "added",
    "value": false
   },
   {
    "key": "setting1",
    "status": "unchanged",
    "value": "Value 1"
   },
   {
    "key": "setting2",
    "status": "deleted",
    "value": 200
   },
   {
    "key": "setting3",
    "status": "changed",
    "oldValue": true,
    "newValue": null
   },
   {
    "key": "setting4",
    "status": "added",
    "value": "blah blah"
   },
   {
    "key": "setting5",
    "status": "added",
    "value": {
     "key5": "value5"
    }
   },
   {
    "key": "setting6",
    "status": "nested",
    "children": [
     {
      "key": "doge",
      "status": "nested",
      "children": [
       {
        "key": "wow",
        "status": "changed",
        "oldValue": "",
        "newValue": "so much"
       }
      ]
     },
     {
      "key": "key",
      "status": "unchanged",
      "value": "value"
     },
     {
      "key": "ops",
      "status": "added",
      "value": "vops"
     }
    ]
   }
  ]
 },
 {
  "key": "group1",
  "status": "nested",
  "children": [
   {
    "key": "baz",
    "status": "changed",
    "oldValue": "bas",
    "newValue": "bars"
   },
   {
    "key": "foo",
    "status": "unchanged",
    "value": "bar"
   },
   {
    "key": "nest",
    "status": "changed",
    "oldValue": {
     "key": "value"
    },
    "newValue": "str"
   }
  ]
 },
 {
  "key": "group2",
  "status": "deleted",
  "value": {
   "abc": 12345,
   "deep": {
    "id": 45
   }
  }
 },
 {
  "key": "group3",
  "status": "added",
  "value": {
   "deep": {
    "id": {
     "number": 45
    }
   },
   "fee": 100500
  }
 }
]
```
[![asciicast](https://asciinema.org/a/obOM4rhEGVKbpmlVDOq2iqdCk.svg)](https://asciinema.org/a/obOM4rhEGVKbpmlVDOq2iqdCk)

## How to setup
Fist you need to build app with:
```
make install
```

```
npm link
```

Then you can run app:

### Description
Compares two configuration files and shows a difference.

### Minimum system requirements

__Operating system:__ macOC Ventura v 13.2

__Node.js:__ v 20.3.1

### Usage
```
gendiff <filepath1> <filepath2>
```
### Options
```
  -V, --version        output the version number
  -f, --format <type>  output format (default: "stylish")
  -h, --help           display help for command
```
[![asciicast](https://asciinema.org/a/qRPck4LzFjjyr5zKjxOVTBWES.svg)](https://asciinema.org/a/qRPck4LzFjjyr5zKjxOVTBWES)

### Formats
- `stylish`, output diff with `+ / -` , like `git diff` (default format)
- `plain`, output diff as text strings
- `json`, output diff in JSON format

## Testing

Tests are made with Jest.

Run tests with:
```
make test
```
Config files and results for tests in `__tests__ and __fixtures__`.
