import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import './animation.less';

var vp;// view params，视图通过路由传递的参数
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

        function onpopstate(){
            // 通用路由规则
            // /{viewName}/{params}
            var path = getPath() || baseView;
            var actions = path.split('/');
            var viewName = actions.shift();
            var params = vp;
            vp = null;// reset

            var visuals = that.state.visuals.slice();
            var lastViewPath = visuals.length > 1 ? visuals.slice(-2)[0].props.path : '';

            var currentViewState = history.state;
            if(visuals[0] && currentViewState) {
                // has view && has view state
                // do close
                // close current view
                visuals.pop();
            }

            if(!visuals[0] || !currentViewState){
                // next router is last, fix back
                if(path == lastViewPath) return history.go(-2);

                // no view || no view state
                // open new view
                var View = that.props.views[viewName];
                visuals.push(
                    <div className={viewClass} key={'v' + visuals.length} path={path}>
                        <View actions={actions} params={params}/>
                    </div>
                );

                history.replaceState({ stamp: Date.now() }, '', location.hash);
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
    getPath,
    back(){
        history.back();
    },
    reload(){
        /* global plus */
        if(window.plus) plus.runtime.restart();
        else location.href = location.href.replace(location.hash, '');
    }
};
