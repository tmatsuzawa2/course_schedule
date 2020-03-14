import React from 'react';
import './App.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';

class CheckedSub extends React.Component {
  constructor(props) {
    super(props);
    this.state = { checkboxChecked: false,
                    lock : false};
    this.record = this.props.checked;
    this.updated = false;
    this.handleChange = this.handleChange.bind(this);
    this.handleLock = this.handleLock.bind(this);
    this.showTime = this.showTime.bind(this);
  }


  handleChange(event) {
    if (event.target.checked === false && this.state.lock === true) {
        alert("there is a locked section here, please unlock first");
        return;
    }
    this.setState({ checkboxChecked: event.target.checked });
    this.updated = true;
    //before changed the checkbox is false, then it will turn to true
    if (this.state.checkboxChecked === false) {
      this.props.pushSub([this.props.sub, this.props.data, this.updated]);
      this.props.setSection();
    }
    else 
      this.props.pushSub([this.props.sub, {}, this.updated]);
      this.props.setSection();
    //this.props.pushSub([this.props.sub, this.props.data, this.state.checkboxChecked]);
    //just updated from "select all"
    /*
    if (this.updated === true)
    //logically should be opposite, but not updated synchronolly
      this.consoleCheck(!this.state.checkboxChecked);
    else 
    this.consoleCheck(this.state.checkboxChecked);
    */
  }

  currCheck() {
    if (this.record !== this.props.checked) {
      if (this.props.checked === false && this.state.lock === true) {
        alert("There is a locked section here, please unlock this first");
        return this.record;
      }
      this.record = this.props.checked;
      this.updated = true;
      if (this.record === true) {
        this.props.pushSub([this.props.sub, this.props.data, this.updated]);
        this.props.setSection();
      }
      else {
        this.props.pushSub([this.props.sub, {}, this.updated]);
        this.props.setSection();
      }
      //this.consoleCheck(this.record);
      this.setState({ checkboxChecked: this.record });
      this.current = !this.current;
      return this.record;
    }
    this.updated = false;
    return this.state.checkboxChecked;
  }

  lockText() {
    if (this.state.lock === true) {
      return "Unlock";
    } else {
      return "Lock";
    }
  }

  handleLock() {
    if (this.state.lock === true) {
      this.setState({lock: !this.state.lock});
      this.props.setLocked(false);
      this.props.pushSub([this.props.sub, this.props.data, true]);
      this.props.setSection();
    } else {
      if (this.state.checkboxChecked === false) {
        alert("This section has not selected yet, please select it before lock it");
        return;
      }
      if (this.props.locked === true) {
        alert("One other subsection in this class is locked, please unlock that first");
        return;
      } else {
        this.setState({lock: !this.state.lock});
        this.props.setLocked(true);
        this.props.pushLock([this.props.sub, this.props.data, true]);
      }
    }
  }

  showTime() {
    let list = "";
    for(const times of Object.entries(this.props.data.time)) {
      list += `${times[0]}` + ": " + `${times[1]}` + "\n";
    }
    alert(list);
  }

  render() {
    return (
      <>
        <div style={{margin: '10px'}}>
        <Form.Group>
          <Form.Row>
            <Form.Check type="checkbox" label={`${this.props.sub}`} checked={this.currCheck()} onChange={this.handleChange}/>
            <Button size='sm' style={{marginLeft: '5px'}} onClick = {this.showTime}> Times </Button>
            <Button size='sm' style={{marginLeft: '5px'}} onClick = {this.handleLock}> {this.lockText()} </Button>
          </Form.Row>
        </Form.Group>


        </div>
      </>
    )
  }
}

export default CheckedSub;
