const createStyle = (style) => {
  let styleStr = ``;
  for (const [key, value] of Object.entries(style)) {
    styleStr += `${key}: ${value};`;
  }
  return styleStr;
}

const createElement = (tagOrComponent, props, children) => {

  let $elem;
  if (typeof tagOrComponent === 'string') {
    $elem = document.createElement(tagOrComponent);
  } else {
    $elem = tagOrComponent(props);
  }

  for (const [key, value] of Object.entries(props)) {
    switch (key) {
      case "style": {
        $elem.setAttribute('style', createStyle(value));
       break;
      }
    }
  }

  if (children) {
    $elem.append(children);
  }

  return $elem;
};

const React = {
  createElement,
}

describe('react renderer', () => {
  it ('should render html element with child which is plain text', () => {

    const childrenText = 'hello children';

    const html = React.createElement('div', {
      style: {
        ['background-color']: 'red',
      },
    },
      childrenText
    );

    expect(html.outerHTML).toEqual(`<div style="background-color: red;">${childrenText}</div>`);
  });

  it ('should render html element with child which is html element', () => {
    const children = `<div>i'm child</div>`; // TODO: replace with variable
    const html = React.createElement('div',
      {},
      React.createElement('div', {}, `i'm child`)
    )

    expect(html.outerHTML).toEqual(`<div>${children}</div>`);
  });

  it ('should render with functional component', () => {

    function MyComponent() {
      return React.createElement('div', {}, `i'm a boy`);
    }

    const html = React.createElement(MyComponent, {});

    expect(html.outerHTML).toEqual(`<div>i'm a boy</div>`);
  });
});

describe('react renderer util', () => {
  it('should create style string', () => {
    const str = createStyle({
      ['background-color']: 'red',
    });

    expect(str).toEqual('background-color: red;');
  });
});


describe('html dom api', function () {
  it('should embed style element', () => {
    const $elem = document.createElement('div');

    $elem.setAttribute('style', 'background-color: red;');

    const appliedStyleString = $elem.getAttribute('style');
    expect(appliedStyleString).toEqual('background-color: red;');
    expect($elem.outerHTML).toEqual('<div style="background-color: red;"></div>');
  });
});
