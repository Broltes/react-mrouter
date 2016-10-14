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
            let actions = path.split('/');
            let viewName = actions.shift();
            let params = vp;
            vp = null;// reset

            let visuals = that.state.visuals.slice();
            let targetViewState = history.state;
            let lastView = visuals.slice(-2)[0];

            if(
                lastView &&
                targetViewState &&
                (lastView.key == targetViewState.key)
            ) {
                // close current view
                visuals.pop();
            } else {
                // next router is last, fix back
                let lastViewPath = lastView && lastView.props['data-path'];
                if(path == lastViewPath) return history.go(-2);

                // set view state for close
                let key = 'v' + Date.now();
                history.replaceState({ key }, '', location.hash);

                // open new view
                let View = that.props.views[viewName];
                if(View) {
                    let visual = (
                        <div className="view" key={key} data-path={path}>
                            <View actions={actions} params={params}/>
                        </div>
                    );

                    if(viewName == baseView) visuals = [visual];// reset for baseView
                    else visuals.push(visual);// open normal view
                }
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
