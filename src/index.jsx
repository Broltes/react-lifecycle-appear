import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import 'intersection-observer';

const observedList = [];

function observe(dom, child) {
  observedList.push(dom);
  observedList.push(child);
  io.observe(dom);
}
function unobserve(dom) {
  const domIndex = observedList.indexOf(dom);
  observedList.splice(domIndex, domIndex + 1);
  io.unobserve(dom);
}

const io = new IntersectionObserver(entries => {
  entries.forEach(item => {
    const dom = item.target;
    const domIndex = observedList.indexOf(dom);
    const component = observedList[domIndex + 1];

    if (item.isIntersecting) {
      // appear
      if (component.didAppearOnce) {
        component.didAppearOnce(item);
        component.didAppearOnce = null;
      }
      if (component.didAppear) {
        component.didAppear(item);
      }
    } else {
      // disappear
      if (component.didDisappearOnce) {
        component.didDisappearOnce(item);
        component.didDisappearOnce = null;
      }
      if (component.didDisappear) {
        component.didDisappear(item);
      }
    }

    if (
      !component.didAppearOnce &&
      !component.didAppear &&
      !component.didDisappear &&
      !component.didDisappearOnce
    ) {
      unobserve(dom);
    }
  });
});

export default Child =>
  class extends Component {
    componentDidMount() {
      this.dom = ReactDOM.findDOMNode(this);
      observe(this.dom, this.child);
    }

    componentWillUnmount() {
      unobserve(this.dom);
    }

    render() {
      return <Child {...this.props} ref={el => (this.child = el)} />;
    }
  };