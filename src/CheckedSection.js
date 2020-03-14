import React from 'react';
import './App.css';
import CheckedSub from './CheckedSub';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import cloneDeep from 'lodash/cloneDeep';

class CheckedSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = { checkboxChecked: false};
    this.record = this.props.checked;
    this.updated = false;
    this.changed = false;
    this.sublist = [];
    this.subnumlist = [];
    this.handleChange = this.handleChange.bind(this);
    this.showTime = this.showTime.bind(this);
  }

  getSubsections() {
    let subsections = [];

    for(const subsection of Object.entries(this.props.data.subsections)) {
        subsections.push(
            <CheckedSub key={subsection[0]} data={subsection[1]} sub={subsection[0]} checked={this.props.checked} pushSub={(sub) => this.pushSub(sub)} setSection={() => this.setSection()} locked = {this.props.locked} setLocked={(locked) => this.setLocked(locked)} pushLock={(lock) => this.pushLock(lock)}/>
        );
    }
    return subsections;
  }

  pushLock(lock) {
    var temp = cloneDeep(this.props.data);
    delete temp.subsections;
    temp.subsections = {};
    temp.subsections[lock[0]] = lock[1];
    this.props.pushLock([this.props.sec, temp, true]);
  }

  setLocked(lock) {
    this.props.setLocked(lock);
  }

  pushSub(sub) {
    this.changed = true;
    let temp = this.sublist;
    let add = true;
    for (let i = 0; i < temp.length; i++) {
      if (temp[i][0] === sub[0]) {
        add = false;
        if (sub[2] === true) {
          temp[i][1] = sub[1];
          this.sublist = temp;
        }
      }
    }
    if (add === true) {
      this.sublist.push(sub);
    }
  }

  setSection() {
    var temp = cloneDeep(this.props.data);
    const list = this.sublist;
    delete temp.subsections;
    temp.subsections = {};
    for (var i = 0; i < list.length; i++) {
      if (Object.keys(list[i][1]).length === 0) {
        delete temp.subsections[list[i][0]];
        continue;
      }
      temp.subsections[list[i][0]] = list[i][1];
    }
    if (Object.keys(temp.subsections).length === 0) {
      this.props.pushSec([this.props.sec, {}, true]);
      this.props.setClass();
    } else {
      this.props.pushSec([this.props.sec, temp, true]);
      this.props.setClass();
    }
  }


  handleChange(event) {
    this.setState({ checkboxChecked: event.target.checked });
    //just updated from "select all"
    //if (this.updated === true)
    //logically should be opposite, but not updated synchronolly
      //this.consoleCheck(this.state.checkboxChecked);
    //else 
    //this.consoleCheck(!this.state.checkboxChecked);
  }

  currCheck() {
    if (this.record !== this.props.checked) {
      this.record = this.props.checked;
      this.updated = true;
      //this.consoleCheck(this.record);
      this.setState({ checkboxChecked: this.record });
      return this.record;
    }
    this.updated = false;
    //this.consoleCheck(!this.state.checkboxChecked);
    return this.state.checkboxChecked;
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
        <div style={{margin: '5px'}}>
          <Form.Row>
            <Button variant="outline-dark" style={{marginLeft: '5px'}} onClick = {this.showTime}> {`${this.props.sec}`} </Button>
          </Form.Row>
            {this.getSubsections()}
        </div>
        &nbsp;
      </>
    )
  }
}

export default CheckedSection;
