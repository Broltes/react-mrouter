import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import './animation.less';

let vp;// view params，视图通过路由传递的参数
function getPath(url) {
    return (url || location.hash).replace(/^#\//, '');
}
function resolvePath(path = getPath()) {
    let actions = path.split('/');
    let viewName = actions.shift();

    return { viewName, actions };
}

export var Router = React.createClass({
    getInitialState: function() {
        return {
            visuals: []
        };
    },
    getDefaultProps: function () {
        return {
            transitionName: 'zoom-fade',
            baseView: 'base'
        };
    },

    componentDidMount: function(){
        let that = this;
        let baseView = that.props.baseView;

        function onpopstate(){
            // 通用路由规则
            // /{viewName}/{params}
            let path = getPath() || baseView;
            let { viewName, actions } = resolvePath(path);
            let params = vp;
            vp = null;// reset

            let visuals = that.state.visuals.slice();
            let targetViewState = history.state;
            let currentView = visuals.slice(-1)[0];
            let lastView = visuals.length > 1 && visuals.slice(-2)[0];

            if(
                lastView &&
                targetViewState &&
                (lastView.key == targetViewState.key)
            ) {
                // close current view
                visuals.pop();
            } else {
                // targetView is currentView(eg: open none view then back)
                // skip
                if(currentView && targetViewState && currentView.key == targetViewState.key) return;

                // next router is last, fix back
                let lastViewPath = lastView && lastView.props['data-path'];
                if(path == lastViewPath) return history.go(-2);

                // open new view
                let key = 'v' + Date.now();
                let View = that.props.views[viewName];
                if(View) {
                    let visual = (
                        <View key={key} data-path={path} actions={actions} params={params}/>
                    );

                    if(viewName == baseView) visuals = [visual];// reset for baseView
                    else visuals.push(visual);// open normal view
                }

                // set view state for close
                // setTimeout解决开启动画chrome不触发
                setTimeout(() => history.replaceState({ key }, '', location.hash));
            }

            that.setState({visuals: visuals});
        }
        window.addEventListener('popstate', onpopstate);
        onpopstate();// start router
    },
    render: function(){
        const { transitionName } = this.props;
        const { visuals } = this.state;

        return (
            <ReactCSSTransitionGroup
                transitionName={transitionName}
                transitionEnterTimeout={400}
                transitionLeaveTimeout={400}
                transitionEnter={visuals.length > 1}
                component="div" id="views">
                {visuals}
            </ReactCSSTransitionGroup>
        );
    }
});

// router api
export default {
    goto(actions, params){
        vp = params;// set view params first
        location.hash = '#' + actions;// then router to view
    },
    getPath, resolvePath,
    back(){
        history.back();
    },
    reload(){
        /* global plus */
        if(window.plus) plus.runtime.restart();
        else location.href = location.href.replace(location.hash, '');
    }
};
