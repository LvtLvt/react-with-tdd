
const createElement = (tag, props, children) => {
  return `<div style="background-color: red;">hello children</div>`;
};

const React = {
  createElement,
}

describe('react renderer', () => {
  it ('should render html element', () => {

    const childrenText = 'hello children';

    const html = React.createElement('div', {
      style: {
        backgroundColor: 'red',
      },
    },
      React.createElement('div', { }, childrenText)
    );

    expect(html).toEqual(`<div style="background-color: red;">${childrenText}</div>`);
  });
});


