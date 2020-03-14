import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Day from './Day';

class Table extends React.Component {
    constructor(props) {
        super(props);
        this.indices = [];
        this.state = {
          blocks: [[],[],[],[],[]],
          title: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
        };
    }
    getDays() {
        let tables = [];
        for (let i = 0; i < 5; i++) {
            tables.push(
                <Day key={this.state.title[i]} title={this.state.title[i]} 
                blocks={this.props.data[i]} 
                start={420/4} 
                end={1140/4} 
                height={2000/4}
                width='200px'
                index={i}/>
            );
        }
        this.indices = [];
        return tables;
    }


    render() {
        //this.setState({blocks: this.props.data, title: this.state.title});
        return (
        <>
            {this.getDays()}  
        </>
        )
    }

}

export default Table; 