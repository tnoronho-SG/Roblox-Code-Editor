export class CodeBuilder {
  constructor() {
    this.lines = [];
    this.indentLevel = 0;
  }

  line(content = '') {
    this.lines.push(`${'  '.repeat(this.indentLevel)}${String(content)}`);
    return this;
  }

  indent() {
    this.indentLevel += 1;
    return this;
  }

  dedent() {
    this.indentLevel = Math.max(0, this.indentLevel - 1);
    return this;
  }

  emptyLine() {
    this.lines.push('');
    return this;
  }

  if(condition, callback) {
    this.line(`if ${condition} then`);
    this.indent();
    callback(this);
    this.dedent();
    this.line('end');
    return this;
  }

  while(condition, callback) {
    this.line(`while ${condition} do`);
    this.indent();
    callback(this);
    this.dedent();
    this.line('end');
    return this;
  }

  forLoop(variable, start, finish, callback) {
    this.line(`for ${variable} = ${start}, ${finish} do`);
    this.indent();
    callback(this);
    this.dedent();
    this.line('end');
    return this;
  }

  function(name, params = [], callback) {
    const parameters = params.length ? `(${params.join(', ')})` : '()';
    this.line(`local function ${name}${parameters}`);
    this.indent();
    callback(this);
    this.dedent();
    this.line('end');
    return this;
  }

  build() {
    return this.lines.join('\n');
  }
}

export default CodeBuilder;
