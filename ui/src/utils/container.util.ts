export function formatName(names: string[]) {
  if (!names.length) {
    return 'unknow';
  }

  const [name] = names;

  if (name.startsWith('/')) {
    return name.substring(1)
  }

  return name;
}


