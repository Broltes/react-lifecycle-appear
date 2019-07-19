# react-lifecycle-appear

A React HOC, adding lifecycle methods for handling a component enters or exits the viewport.

## Add following lifecycle methods

- **didAppear**: Called when a componnet enters the viewport
- **didAppearOnce**: Same as `didAppear` but called only once
- **didDisappear**: Called when a componnet exits the viewport
- **didDisappearOnce**: Same as `didDisappear` but called only once

All lifecycle methods will receive a param when called: [IntersectionObserverEntry
](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry)

Tip: when react-lifecycle-appear needs to be combined with other decorators or higher-order-components, make sure that react-lifecycle-appear is the innermost (first applied) decorator, this will not affect other HOC behavior, such as MobX observer.

## Installation

```bash
npm install react-lifecycle-appear --save
```

## Usage
### HOC params

```javascript
import React, { Component } from 'react';
import withAppear from 'react-lifecycle-appear';

@withAppear({
  didAppear(ioe) {
    console.log('Appeared');
    this.setState({ appeared: true });
  }

  didAppearOnce(ioe) {
    console.log('Once Appeared');
    this.setState({ appeared: true });
  }

  didDisappear(ioe) {
    console.log('Disappeared');
    this.setState({ appeared: false });
  }

  didDisappearOnce(ioe) {
    console.log('Once Disappeared');
    this.setState({ appeared: false });
  }
})
class extends Component {
  state = {
    appeared: false
  }

  render() {
    const { appeared } = this.state;

    return (
      <div>{ appeared ? 'appeared' : 'disappeared' }</div>
    )
  }
}
```

### Component methods

```javascript
import React, { Component } from 'react';
import withAppear from 'react-lifecycle-appear';

@withAppear()
class extends Component {
  state = {
    appeared: false
  }

  didAppear(ioe) {
    console.log('Appeared');
    this.setState({ appeared: true });
  }

  didAppearOnce(ioe) {
    console.log('Once Appeared');
    this.setState({ appeared: true });
  }

  didDisappear(ioe) {
    console.log('Disappeared');
    this.setState({ appeared: false });
  }

  didDisappearOnce(ioe) {
    console.log('Once Disappeared');
    this.setState({ appeared: false });
  }

  render() {
    const { appeared } = this.state;

    return (
      <div>{ appeared ? 'appeared' : 'disappeared' }</div>
    )
  }
}
```

### Component
```javascript
import React, { Component } from 'react';
import { Appear } from 'react-lifecycle-appear';

class extends Component {
  state = {
    appeared: false
  }

  handleAppear = (ioe) => {
    console.log('Appeared');
    this.setState({ appeared: true });
  }

  handleAppearOnce = (ioe) => {
    console.log('Once Appeared');
    this.setState({ appeared: true });
  }

  handleDisappear = (ioe) => {
    console.log('Disappeared');
    this.setState({ appeared: false });
  }

  handleDisappearOnce = (ioe) => {
    console.log('Once Disappeared');
    this.setState({ appeared: false });
  }

  render() {
    const { appeared } = this.state;

    return (
      <Appear
        onAppear={this.handleAppear}
        onAppearOnce={this.handleAppearOnce}
        onDisappear={this.handleDisappear}
        onDisappearOnce={this.handleDisappearOnce}
      >
        <div>{ appeared ? 'appeared' : 'disappeared' }</div>
      </Appear>
    )
  }
}
```
