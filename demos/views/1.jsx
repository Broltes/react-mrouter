import React from 'react';
import router from 'react-mrouter';

module.exports = React.createClass({
    render() {
        return (
            <div>
                <header>
                    <p className="las">
                        <a className="btn-back" onClick={router.back}/>
                    </p>
                    <h2>view 1</h2>
                </header>
                <div className="main">
                    <p>actions: {(this.props.actions || []).join(',')}</p>
                    <p>params: {this.props.params}</p>

                    <a href="#/view2/action2">open view 2</a>
                    <a href="#/noview/action2">open no view</a>
                </div>
            </div>
        );
    }
});
