# destinations file

Used to provide options for "destination" menu

Format:

array of type | single value of type | enum (key strings, value numeric)

```
[
  { "destination": "[text]", "array": true|false, "type": "X" },
  { "destination": "[text]", "type": "enum", "values": [ { "[key]": "[value]" }, ... ] },
]
```

X =
export const MAPPING_CONVERT_UINTEGER = "uinteger";
export const MAPPING_CONVERT_IPADDRESS = "ipaddress";
export const MAPPING_CONVERT_INTEGER = "integer";
export const MAPPING_CONVERT_STRING = "string";
export const MAPPING_CONVERT_BOOLEAN = "boolean";
export const MAPPING_CONVERT_MACADDRESS = "macaddress";
export const MAPPING_CONVERT_BYTES = "bytes";
export const MAPPING_CONVERT_HASH = "hash";

# mapping

1. static
   a. if destination type = enum then dropdown with all "key" options from selected destination configuration
   b. otherwise, free-form text form
2. date
3. replace
   a. only if destination not array
4. rename
   a. only if destination not array
5. merge
   a. only if destination array
6. grok
7. table
   a. allow one or more mappings
   b. each mapping: key => value
   c. options for key:
    1. key = number
    2. key = "string"
    3. key = "string, string"

function menu (rename, merge) the types available depend on the type of the destination

      mappingData: null,
      mappingDateType: MAPPING_DATE_RFC3339,
      mappingConvertType: MAPPING_CONVERT_DONTCONVERT,

keep it as single "extra" mapping parameter
