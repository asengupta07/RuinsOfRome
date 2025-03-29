import { ALL, parseJSON } from 'partial-json';

export function parseUntilJson(jsonstr: string): Record<string, any> {
  let jsonRes: Record<string, any> | string = jsonstr;

  try {
    const properlyParsedJson = JSON.parse(jsonRes);
    console.log(
      '\n\n===============================\nJSON parsed properly\n===============================\n\n'
    );
    if (typeof properlyParsedJson === 'object' && properlyParsedJson !== null) {
      return properlyParsedJson;
    } else {
      jsonRes = properlyParsedJson;
    }
  } catch (error) {
    console.error(
      '\n\n===============================\nError parsing the JSON using regular JSON.parse...\n===============================\n'
    );
    console.error(error);
  }

  console.log(
    '\n=================\njsonRes type:\n=================\n',
    typeof jsonRes
  );
  if (typeof jsonRes === 'object') {
    console.log(Object.keys(jsonRes));
  }
  console.log('\n=================\njsonRes:\n=================\n', jsonRes);
  const curlIndex =
    jsonRes.indexOf('{') === -1 ? jsonRes.length : jsonRes.indexOf('{');
  const sqIndex =
    jsonRes.indexOf('[') === -1 ? jsonRes.length : jsonRes.indexOf('[');
  jsonRes = jsonRes.slice(Math.min(curlIndex, sqIndex));

  if (jsonRes.startsWith('```json')) {
    jsonRes = jsonRes.replace('```json', '');
  }
  if (jsonRes.startsWith('`') || jsonRes.endsWith('`')) {
    jsonRes = jsonRes.replaceAll('```', '');
  }

  console.log('Filtered JSON res = ', jsonRes);
  jsonRes = jsonRes.replaceAll('\n', '\\n');
  jsonRes = jsonRes.replaceAll('{\\n', '{').replaceAll('\\n}', '}');
  console.log(jsonRes);
  try {
    while (typeof jsonRes === 'string') {
      jsonRes = parseJSON(jsonRes, ALL);
    }
    console.log('\n\nParsed JSON using partial JSON parser = \n\n', jsonRes);
    return jsonRes;
  } catch (error) {
    console.error(
      '\n\n===============================\nError parsing the JSON...\n===============================\n'
    );
    console.error(error);
    return {};
  }
}