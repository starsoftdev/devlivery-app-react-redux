## React Style Guide

> This style guide comes as an addition to [Airbnb React/JSX Guide](https://github.com/airbnb/javascript/tree/master/react).

### Table of Contents

* [Separate folder per UI component](#separate-folder-per-ui-component)
* [Prefer using functional components](#prefer-using-functional-components)
* [Use CSS Modules](#use-css-modules)
* [Use higher-order components](#use-higher-order-components)

### Separate folder per UI component

* Place each major UI component along with its resources in a separate folder<br>
  This will make it easier to find related resources for any particular UI
  element (CSS, images, unit tests, localization files etc.). Removing such
  components during refactorings should also be easy.
* Avoid having CSS, images and other resource files shared between multiple components.<br>
  This will make your code more maintainable, easy to refactor.
* Add each component into [`src/components/index.js`](../src/components/index.js) file.<br>
  This will allow to easily reference such components from other places in
  your code.<br>
  Use `import {Link} from '../../components'` instead of `import Link from '../../components/Link/Link.js'`

For more information google for [component-based UI development](https://google.com/search?q=component-based+ui+development).

### Prefer using functional components

* Prefer using stateless functional components whenever possible.<br>
  Components that don't use state are better to be written as simple pure functions.

```jsx
// Bad
class Navigation extends Component {
  static propTypes = { items: PropTypes.array.isRequired }
  render() {
    return <nav><ul>{this.props.items.map(x => <li>{x.text}</li>)}</ul></nav>
  }
}

// Better
function Navigation({ items }) {
  return (
    <nav><ul>{items.map(x => <li>{x.text}</li>)}</ul></nav>
  )
}
Navigation.propTypes = { items: PropTypes.array.isRequired }
```

### Use CSS Modules

* Use CSS Modules<br>
  This will allow using short CSS class names and at the same time avoid conflicts.
* Keep CSS simple and declarative. Avoid loops, mixins etc.
* Feel free to use variables in CSS via [precss](https://github.com/jonathantneal/precss) plugin for [PostCSS](https://github.com/postcss/postcss)
* Prefer CSS class selectors instead of element and `id` selectors (see [BEM](https://bem.info/))
* Avoid nested CSS selectors (see [BEM](https://bem.info/))
* When in doubt, use `.root { }` class name for the root elements of your components

### Use higher-order components

* Use higher-order components (HOC) to extend existing React components.<br>
  Here is an example:

```js
// withViewport.js
import React, { Component } from 'react'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'

function withViewport(ComposedComponent) {
  return class WithViewport extends Component {

    state = {
      viewport: canUseDOM ?
        {width: window.innerWidth, height: window.innerHeight} :
        {width: 1366, height: 768} // Default size for server-side rendering
    }

    componentDidMount() {
      window.addEventListener('resize', this.handleResize)
      window.addEventListener('orientationchange', this.handleResize)
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.handleResize)
      window.removeEventListener('orientationchange', this.handleResize)
    }

    handleResize = () => {
      let viewport = {width: window.innerWidth, height: window.innerHeight}
      if (this.state.viewport.width !== viewport.width ||
        this.state.viewport.height !== viewport.height) {
        this.setState({ viewport })
      }
    }

    render() {
      return <ComposedComponent {...this.props} viewport={this.state.viewport}/>
    }

  }
}

export default withViewport
```

```js
// MyComponent.js
import React from 'react'
import withViewport from './withViewport'

class MyComponent {
  render() {
    let { width, height } = this.props.viewport
    return <div>{`Viewport: ${width}x${height}`}</div>
  }
}

export default withViewport(MyComponent)
```

**[⬆ back to top](#table-of-contents)**
