# destinations file

Used to provide options for "destination" menu

Format:

```
[
  { "destination": "[text]", "type": "array" },
  { "destination": "[text]", "type": "enum", "values": [ { "[key]": "[value]" }, ... ] },
  { "destination": "[text]", "type": "???" },  // what other options?
]
```

# mapping

1. static
   a. if destination type = enum then dropdown with all "key" options from selected destination configuration
   b. otherwise, no other options
2. date
3. replace
4. rename
   a. only if destination type != array
5. merge
6. grok
7. table
   a. allow one or more mappings
   b. each mapping: key => value
   c. option for key:
    1. key = number
    2. key = "string"
    3. key = "string, string"
