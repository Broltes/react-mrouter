# react-mrouter
React Router for Mobile SPA

## Live demo
[https://broltes.github.io/router](https://broltes.github.io/router)

## Usage
`npm install --save react-mrouter`

```js
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
```

#### pass actions through `href`
`<a href="#/view1/action1/action2">pass actions to view1</a>`

#### pass params through `router.goto()`
```
import router from 'react-mrouter';

function gotoView2WithParams(){
    router.goto('/view2', 'some params');
}

<a onClick="gotoView2WithParams">pass params to view2</a>
```
