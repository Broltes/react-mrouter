import React from 'react';
import { render } from 'react-dom';
import './app.less';
import { Router } from 'react-mrouter';

var Views = {
    base: require('./views/base'),
    view1: require('./views/1'),
    view2: require('./views/2'),
};

var App = React.createClass({
    render: function(){
        return <Router Views={Views}/>;
    }
});
render(<App/>, document.getElementById('app'));
