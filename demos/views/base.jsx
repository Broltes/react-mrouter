import React from 'react';
import router from 'react-mrouter';

module.exports = React.createClass({
    openView2: function() {
        router.goto('/view2', 'view2 param ' + Date.now());
    },

    render: function() {
        return (
            <div>
                <header>
                    <h2>react-mrouter</h2>
                </header>
                <div className="main">
                    <a href="#/view1/action1">open view 1 with actions</a>
                    <a onClick={this.openView2}>open view 2 with params</a>
                </div>
                <footer>
                    <a href="https://github.com/Broltes/react-roui">view source</a>
                </footer>
            </div>
        );
    }
});
