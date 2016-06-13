import React from 'react';
import router from 'react-mrouter';

module.exports = React.createClass({
    render: function() {
        return (
            <div>
                <header>
                    <p className="las">
                        <a className="btn-back" onClick={router.back}/>
                    </p>
                    <h2>view 2</h2>
                </header>
                <div className="main">
                    <p>actions: {(this.props.actions || []).join(',')}</p>
                    <p>params: {this.props.params}</p>

                    <a href="#/view1/action/from/view2">open view 1 with actions</a>
                </div>
            </div>
        );
    }
});
