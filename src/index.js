import ReactDOM from 'react-dom';
import 'intersection-observer';
import { getSingle } from './utils';

const observedList = [];
const getSingleIo = getSingle(() => {
  return new IntersectionObserver(entries => {
    entries.forEach(item => {
      const dom = item.target;
      const [hooks, instance] = getOptionsByDom(dom);

      if (item.isIntersecting) {
        // appear
        if (hooks.didAppearOnce) {
          hooks.didAppearOnce.call(instance, item);
          hooks.didAppearOnce = null;
        }
        if (hooks.didAppear) {
          hooks.didAppear.call(instance, item);
        }
      } else {
        // disappear
        if (hooks.didDisappearOnce) {
          hooks.didDisappearOnce.call(instance, item);
          hooks.didDisappearOnce = null;
        }
        if (hooks.didDisappear) {
          hooks.didDisappear.call(instance, item);
        }
      }

      if (
        !hooks.didAppearOnce &&
        !hooks.didAppear &&
        !hooks.didDisappear &&
        !hooks.didDisappearOnce
      ) {
        unobserve(dom);
      }
    });
  });
});

function observe(dom, hooks, instance) {
  if (dom instanceof Element) {
    observedList.push(dom);
    observedList.push([hooks, instance]);
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
    return class extends Cmpt {
      componentDidMount() {
        super.componentDidMount && super.componentDidMount.call(this);

        if (!hooks) {
          const {
            didAppearOnce,
            didAppear,
            didDisappear,
            didDisappearOnce
          } = this;
          hooks = {
            didAppearOnce,
            didAppear,
            didDisappear,
            didDisappearOnce
          };
        }

        dom = ReactDOM.findDOMNode(this);
        observe(dom, hooks, this);
      }

      componentWillUnmount() {
        super.componentWillUnmount && super.componentWillUnmount.call(this);
        unobserve(dom);
      }
    };
  };
}
