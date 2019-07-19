import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import 'intersection-observer';
import { getSingle } from './utils';

/**
 * 为防止 hooks 被其它 HOC 屏蔽，所以通过参数传入
 * @param {object} hooks
 * @param {object} ioOptions
 */
export default function withAppear(hooks, ioOptions) {
  const observedList = [];
  const getSingleIo = getSingle(() => {
    return new IntersectionObserver(entries => {
      entries.forEach(item => {
        const dom = item.target;
        const instance = getInstanceByDom(dom);
        if (!instance) return;

        if (item.isIntersecting) {
          // appear
          if (instance.didAppearOnce) {
            instance.didAppearOnce(item);
            instance.didAppearOnce = null;
          }
          if (instance.didAppear) {
            instance.didAppear(item);
          }
        } else {
          // disappear
          if (instance.didDisappearOnce) {
            instance.didDisappearOnce(item);
            instance.didDisappearOnce = null;
          }
          if (instance.didDisappear) {
            instance.didDisappear(item);
          }
        }

        if (
          !instance.didAppearOnce &&
          !instance.didAppear &&
          !instance.didDisappear &&
          !instance.didDisappearOnce
        ) {
          unobserve(instance);
        }
      });
    }, ioOptions);
  });

  function observe(instance) {
    const dom = ReactDOM.findDOMNode(instance);
    if (dom instanceof Element) {
      observedList.push(instance);
      observedList.push(dom);
      getSingleIo().observe(dom);
    }
  }
  function unobserve(instance) {
    const instanceIndex = observedList.indexOf(instance);
    if (instanceIndex >= 0) {
      const dom = observedList[instanceIndex + 1];
      getSingleIo().unobserve(dom);
      observedList.splice(instanceIndex, 2);
    }
  }
  function getInstanceByDom(dom) {
    const domIndex = observedList.indexOf(dom);
    return observedList[domIndex - 1];
  }

  return function(Cmpt) {
    /**
     * 通过继承的方式，而非透传 props 和 复用 UI 渲染，
     * 防止影响其它 HOC，如 MobX observer
     */
    class Enhance extends Cmpt {
      componentDidMount() {
        observe(this);
        super.componentDidMount && super.componentDidMount.call(this);
      }

      componentWillUnmount() {
        unobserve(this);
        super.componentWillUnmount && super.componentWillUnmount.call(this);
      }
    }

    return Object.assign(Enhance, hooks);
  };
}

class PureAppear extends Component {
  constructor(props) {
    super(props);
    const { onAppearOnce, onAppear, onDisappear, onDisappearOnce } = props;

    Object.assign(this, {
      didAppearOnce: onAppearOnce,
      didAppear: onAppear,
      didDisappear: onDisappear,
      didDisappearOnce: onDisappearOnce
    });
  }

  render() {
    return this.props.children;
  }
}

export function createAppear(ioOptions) {
  return withAppear(null, ioOptions)(PureAppear);
}
export const Appear = createAppear();
