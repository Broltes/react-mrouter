import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import './animation.less';

var vp;// view params，视图通过路由传递的参数
var lastTouch;

export var Router = React.createClass({
    getInitialState: function() {
        return {
            visuals: [],
        };
    },
    getDefaultProps: function () {
        return {
            transitionName: 'zoom-fade',
            viewClass: 'view'
        };
    },

    componentDidMount: function(){
        var that = this;
        var viewClass = this.props.viewClass;

        window.addEventListener('click', function(){
            lastTouch = Date.now();
        }, true);

        window.onpopstate = function(){
            // 通用路由规则
            // /{viewName}/{params}
            var path = location.hash.replace(/^#\//, '');
            var actions = path.split('/');
            var viewName = actions.shift();
            var params = vp;
            vp = null;// reset

            var visuals = that.state.visuals.slice();
            var lastViewPath = visuals.length > 1 ? visuals.slice(-2)[0].props.path : '';
            var currentView = visuals.slice(-1)[0];
            var currentViewPath = currentView ? currentView.props.path : '';

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
                        <div className={viewClass} key={visuals.length} path={path}>
                            <View actions={actions} params={params}/>
                        </div>
                    );
                } else if(visuals.length){
                    // clear
                    visuals = [];
                }
            }

            that.setState({visuals: visuals});
        };

        window.onpopstate();// start router
    },
    render: function(){
        var { views, transitionName, viewClass } = this.props;
        var Base = views.base;

        var showing = [].concat();

        return (
            <ReactCSSTransitionGroup
                transitionName={transitionName}
                transitionEnterTimeout={400}
                transitionLeaveTimeout={400}
                component="div" id="views">
                <div className={viewClass}><Base/></div>
                {this.state.visuals}
            </ReactCSSTransitionGroup>
        );
    }
});

// router api
export default {
    goto: function(actions, params){
        vp = params;// set view params first
        location.hash = '#' + actions;// then router to view
    },
    back: function(){
        lastTouch = 0;// disable back fix
        if(location.hash.replace(/^#\//, '')) history.back();
    },
    reload: function(){
        if(window.plus) plus.runtime.restart();
        else location.href = location.origin;
    },
};
