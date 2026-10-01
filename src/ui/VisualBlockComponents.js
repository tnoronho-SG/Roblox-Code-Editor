import React from 'react';

export class InputBlock extends React.Component {
  render() {
    return this.props.renderBlock(this.props);
  }
}

export function InputFreeBlock(props) {
  return props.renderBlock(props);
}

export function VisualBlockComponent(props) {
  const Component = props.hasInputs ? InputBlock : InputFreeBlock;
  return React.createElement(Component, props);
}

export class GeneratedCodeDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = { code: props.code };
  }

  static getDerivedStateFromProps(props, state) {
    return props.code === state.code ? null : { code: props.code };
  }

  render() {
    return React.createElement('code', {
      dangerouslySetInnerHTML: { __html: this.props.highlight(this.state.code) },
    });
  }
}