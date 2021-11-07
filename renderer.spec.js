const createStyle = (style) => {
  let styleStr = ``;
  for (const [key, value] of Object.entries(style)) {
    styleStr += `${key}: ${value};`;
  }
  return styleStr;
}

const createElement = (tagOrComponent, props, ...children) => {

  const _render = (dispatcher) => {
    dispatcher.currentStateCount = 0;
    dispatcher.$elemRef.current.replaceWith(tagOrComponent(props));
  };

  let $elemRef = { };
  let $elem;
  if (typeof tagOrComponent === 'string') {
    $elem = document.createElement(tagOrComponent);
  } else {
    const currentDispatcher = {
      stateStore: [],
      currentStateCount: 0,
      render: () => _render(currentDispatcher),
      $elemRef,
    };

    DO_NOT_MODIFY_THIS_VALUE_OR_YOU_WILL_BE_FIRED.currentDispatcher = currentDispatcher;
    $elem = tagOrComponent(props);
    $elemRef.current = $elem;
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

const useState = (initValue) => {
  const dispatcher = DO_NOT_MODIFY_THIS_VALUE_OR_YOU_WILL_BE_FIRED.currentDispatcher;

  const {
    render,
    stateStore,
    currentStateCount,
  } = dispatcher;

  const stateIdx = currentStateCount;
  dispatcher.currentStateCount += 1;

  if (stateStore.length === 0) {
    stateStore[0] = initValue;
  }

  if (typeof stateStore[stateIdx] === 'undefined') {
    if (typeof initValue !== 'undefined') {
      stateStore[stateIdx] = initValue;
    }
  }

  return [stateStore[stateIdx], (value) => {
    stateStore[stateIdx] = value;
    setTimeout(render);
  }];
};

const DO_NOT_MODIFY_THIS_VALUE_OR_YOU_WILL_BE_FIRED = {
  currentDispatcher: null,
};

const React = {
  createElement,
  useState,
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

  it ('should render html element which child is html element', () => {
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

  it ('should re-render once state was updated', (done) => {
    function MyComponent() {
      const [state, setState] = React.useState(0);

      setState(1);

      return React.createElement('div', {}, state);
    }

    const html = React.createElement('div', {},
      React.createElement(MyComponent, {}));

    setTimeout(() => {
      expect(html.outerHTML).toEqual(React.createElement('div', {}, React.createElement('div', {}, '1')).outerHTML);
      done();
    });
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
  it('should embed style element as a string', () => {
    const $elem = document.createElement('div');

    $elem.setAttribute('style', 'background-color: red;');

    const appliedStyleString = $elem.getAttribute('style');
    expect(appliedStyleString).toEqual('background-color: red;');
    expect($elem.outerHTML).toEqual('<div style="background-color: red;"></div>');
  });
});
