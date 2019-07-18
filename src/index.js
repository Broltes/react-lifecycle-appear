import ReactDOM from 'react-dom';
import 'intersection-observer';
import { getSingle } from './utils';

const observedList = [];
const getSingleIo = getSingle(() => {
  return new IntersectionObserver(entries => {
    entries.forEach(item => {
      const dom = item.target;
      const instance = getOptionsByDom(dom);

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
        unobserve(dom);
      }
    });
  });
});

function observe(dom, instance) {
  if (dom instanceof Element) {
    observedList.push(dom);
    observedList.push(instance);
    getSingleIo().observe(dom);
  }
}
function unobserve(dom) {
  const domIndex = observedList.indexOf(dom);
  observedList.splice(domIndex, 2);
  getSingleIo().unobserve(dom);
}
function getOptionsByDom(dom) {
  const domIndex = observedList.indexOf(dom);
  return observedList[domIndex + 1];
}

/**
 * 为防止 hooks 被其它 HOC 屏蔽，所以通过参数传入
 * @param {object} hooks
 */
export default function(hooks) {
  return function(Cmpt) {
    let dom;

    /**
     * 通过继承的方式，而非透传 props 和 复用 UI 渲染，
     * 防止影响其它 HOC，如 MobX observer
     */
    class Enhance extends Cmpt {
      componentDidMount() {
        super.componentDidMount && super.componentDidMount.call(this);

        dom = ReactDOM.findDOMNode(this);
        observe(dom, this);
      }

      componentWillUnmount() {
        super.componentWillUnmount && super.componentWillUnmount.call(this);
        unobserve(dom);
      }
    }

    return Object.assign(Enhance, hooks);
  };
}
