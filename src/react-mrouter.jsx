import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import './animation.less';

var vp;// view params，视图通过路由传递的参数
var lastTouch;
function getPath(url) {
    return (url || location.hash).replace(/^#\//, '');
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
            viewClass: 'view',
            baseView: 'base'
        };
    },

    componentDidMount: function(){
        var that = this;
        var viewClass = that.props.viewClass;
        var baseView = that.props.baseView;

        window.addEventListener('click', function(){
            lastTouch = Date.now();
        }, true);

        function onpopstate(){
            // 通用路由规则
            // /{viewName}/{params}
            var path = getPath() || baseView;
            var actions = path.split('/');
            var viewName = actions.shift();
            var params = vp;
            vp = null;// reset

            // 加载baseView时重置view队列
            // 防止 初始View!=BaseView时，fix back 异常
            var visuals = viewName == baseView ? [] : that.state.visuals.slice();
            var currentView = visuals.slice(-1)[0];
            var currentViewPath = currentView ? currentView.props.path : '';
            var lastViewPath = visuals.length > 1 ? visuals.slice(-2)[0].props.path : '';

            // target router is current router
            if(path == currentViewPath) return;

            if(path == lastViewPath) {
                if(Date.now() - lastTouch < 99) {
                    lastTouch = 0;// disable back fix
                    // next router is last, fix back
                    history.go(-2);
                } else {
                    // close current view
                    visuals.pop();
                }
            } else {
                var View = that.props.views[viewName];

                if(View) {
                    // open new view
                    visuals.push(
                        <div className={viewClass} key={'v' + visuals.length} path={path}>
                            <View actions={actions} params={params}/>
                        </div>
                    );
                } else if(visuals.length){
                    // clear
                    visuals = [];
                }
            }

            that.setState({visuals: visuals});
        }
        window.addEventListener('popstate', onpopstate);
        onpopstate();// start router
    },
    render: function(){
        const { views, transitionName, viewClass } = this.props;
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
    getPath,
    back(){
        lastTouch = 0;// disable back fix
        if(location.hash.replace(/^#\//, '')) history.back();
    },
    reload(){
        /* global plus */
        if(window.plus) plus.runtime.restart();
        else location.href = location.href.replace(location.hash, '');
    }
};
