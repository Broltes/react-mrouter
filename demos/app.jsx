import React from 'react';
import { render } from 'react-dom';
import './app.less';
import { Router } from 'react-mrouter';

var views = {
    base: require('./views/base'),
    view1: require('./views/1'),
    view2: require('./views/2'),
};

var App = React.createClass({
    render: function(){
        return <Router views={views}/>;
    }
});
render(<App/>, document.getElementById('app'));
