# react-appear-hook

A React HOC, adding hooks for handling a component enters or exits the viewport.

## Add following hooks

- **didAppear**: Called when a componnet enters the viewport
- **didAppearOnce**: Same as `didAppear` but called only once
- **didDisappear**: Called when a componnet exits the viewport
- **didDisappearOnce**: Same as `didDisappear` but called only once

All hooks will receive a param when called: [IntersectionObserverEntry
](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry)

## Installation

```bash
npm install react-appear-hook --save
```

## Usage

```javascript
import React, { Component } from 'react';
import withAppear from 'react-appear-hook';

@withAppear
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
