import {
  MAPPING_DEFAULT,
  MAPPING_GROK,
  MAPPING_DATE,
  MAPPING_RENAME,
  MAPPING_MERGE,
  MAPPING_REPLACE,
  MAPPING_CONVERT_DONTCONVERT
} from "../ParametersConfiguration";

export function createParser(data, passed_parameters) {
  let parameters = passed_parameters.slice();
  function emit_merge_rename_block(
    output_statements,
    destination,
    source,
    mappingConvertType,
    operator
  ) {
    if (
      mappingConvertType !== null &&
      mappingConvertType !== MAPPING_CONVERT_DONTCONVERT
    ) {
      output_statements.push(`    mutate {`);
      output_statements.push(`            convert => { "${source}" => "${mappingConvertType}" }
            on_error => "is_already_${mappingConvertType}_${source}"
            }`);
    }

    let lhs = source;
    let rhs = destination;
    if (operator === "merge") {
      rhs = source;
      lhs = destination;
    }
    output_statements.push(`    mutate {`);
    output_statements.push(`            ${operator} => {
              "${lhs}" => "${rhs}"
            }
        }`);
    /* if (
      mappingConvertType !== null &&
      mappingConvertType !== MAPPING_CONVERT_DONTCONVERT
    ) {
      output_statements.push(`            if [is_already_${mappingConvertType}_${source}] {
            # Does not need conversion
        }`);
    }*/
  }

  const header = `filter {
	json {
          source => "message"
          array_function => "split_columns"
      }`;

  const section_trailer = `             }
        }`;

  const trailer = `       mutate {
            merge => {
                "@output" => "event"
            }
        }
}`;
  parameters.sort((a, b) => (a.filter > b.filter ? 1 : -1));
  let last_filter = "";
  let output_statements = [];
  let first_filter = true;
  let in_conditional = false;
  console.log("Length of parameters == " + String(parameters.length));
  for (let index = 0; index < parameters.length; index++) {
    let parameter = parameters[index];
    let current_filter = parameters[index].filter || "";

    if (last_filter !== current_filter) {
      last_filter = current_filter;
      if (first_filter === false) {
        output_statements.push("    }");
      }
      if (current_filter !== "") {
        output_statements.push("    " + current_filter + "  {");
        in_conditional = true;
      } else {
        in_conditional = false;
      }
    }

    const {
      destination,
      key,
      mapping,
      mappingData,
      mappingConvertType,
      mappingDateType
    } = parameter;
    let udm_destination = "event.idm.read_only_udm." + destination;
    switch (mapping) {
      case MAPPING_DEFAULT:
        output_statements.push(`         mutate {
            replace => {
	    	    "${udm_destination}" => "${key}"
	        }
        }`);
        break;
      case MAPPING_DATE:
        console.log(mappingDateType);
        output_statements.push(`       date {
            match => ["${key}", "${mappingDateType}"]
            locale => "en"
        }`);
        break;
      case MAPPING_GROK:
        output_statements.push(`       grok {
            match => {
                message => ${mappingData}`);
        output_statements.push(section_trailer);
        break;
      case MAPPING_MERGE:
        emit_merge_rename_block(
          output_statements,
          udm_destination,
          key,
          mappingConvertType,
          "merge"
        );
        break;
      case MAPPING_RENAME:
        emit_merge_rename_block(
          output_statements,
          udm_destination,
          key,
          mappingConvertType,
          "rename"
        );
        break;
      case MAPPING_REPLACE:
        output_statements.push(`       mutate {
            replace => {
                "${udm_destination}" => ${mappingData}`);
        output_statements.push(section_trailer);
        break;
      default:
        console.log("Should not have reached here");
    }
  }

  if (in_conditional === true) {
    output_statements.push("    }");
  }
  console.log(header + "\r\n" + output_statements.join("\r\n") + trailer);
  return header + "\r\n" + output_statements.join("\r\n") + "\r\n" + trailer;
  //  return "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus dapibus neque mi, eget pretium nulla porttitor ut. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. In porttitor rutrum ante ut consectetur. Quisque semper rhoncus felis ac congue. Morbi facilisis ligula leo, in facilisis orci placerat non. Morbi luctus nibh non metus venenatis, quis dapibus augue viverra. Donec molestie, enim eu cursus commodo, lectus nibh volutpat massa, id aliquet odio eros eget massa";
}
