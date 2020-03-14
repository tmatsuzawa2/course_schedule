import React from 'react';
import './App.css';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';
import CheckedSection from './CheckedSection';
import CheckedNoSub from './CheckedNoSub';
import cloneDeep from 'lodash/cloneDeep';

class CheckedClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = { checkboxChecked: false,
                  locked: false};
    this.changed = false;
    this.seclist = [];
    this.handleChange = this.handleChange.bind(this);
  }

  getSections() {
    let sections = [];

    for(const section of Object.entries(this.props.data.sections)) {
        if (Object.keys(section[1].subsections).length === 0) {
          sections.push(
            <CheckedNoSub key={section[0]} data={section[1]} sec={section[0]} checked={this.state.checkboxChecked}  pushSec={(sec) => this.pushSec(sec)} setClass={() => this.setClass()} locked = {this.state.locked} setLocked={(locked) => this.setLocked(locked)} pushLock={(lock) => this.pushLock(lock)}/>
          );
        } else {
          sections.push(
            <CheckedSection key={section[0]} data={section[1]} sec={section[0]} checked={this.state.checkboxChecked}  pushSec={(sec) => this.pushSec(sec)} setClass={() => this.setClass()} locked = {this.state.locked} setLocked={(locked) => this.setLocked(locked)} pushLock={(lock) => this.pushLock(lock)}/>
          );
        }
      }
    return sections;
  }

  pushLock(lock) {
    var temp = cloneDeep(this.props.data);
    delete temp.sections;
    temp.sections = {};
    temp.sections[lock[0]] = lock[1];
    this.props.pushClass([this.props.data.name, temp, true, "lock"]);
  }

  setLocked(lock) {
    if (lock === true) {
      this.setState({locked: true});
    } else {
      this.setState({locked: false});
    }
  }

  pushSec(sec) {
    let temp = this.seclist;
    let add = true;
    for (let i = 0; i < temp.length; i++) {
      if (temp[i][0] === sec[0]) {
        add = false;
        if (sec[2] === true) {
          temp[i][1] = sec[1];
          this.seclist = temp;
        }
      }
    }
    if (add === true) {
      this.seclist.push(sec);
    }
  }

  setClass() {
    var temp = cloneDeep(this.props.data);
    const list = this.seclist;
    delete temp.sections;
    temp.sections = {};
    for (var i = 0; i < list.length; i++) {
      if (Object.keys(list[i][1]).length === 0) {
        
        delete temp.sections[list[i][0]];
        continue;
      }
      temp.sections[list[i][0]] = list[i][1];
    }
    
    if (Object.keys(temp.sections).length === 0) {
      this.props.pushClass([this.props.data.name, {}, true]);
    } else {
      this.props.pushClass([this.props.data.name, temp, true]);
    }
    
    if (this.state.locked === true) {
      this.props.setCourses();
    }
  }

  handleChange(event) {
    this.setState({ checkboxChecked: event.target.checked});
    this.changed = true;
  }

  setLabel() {
    if (this.state.checkboxChecked === true) {
      return "Deselect All Sections";
    } else {
      return "Select All Sections";
    }
  }

  render() {
    return (
      <>
        <Card>
            <Accordion>
                <Form.Check type="checkbox" label={this.setLabel()} checked={this.state.checkboxChecked} onChange={this.handleChange}/>
                <Accordion.Toggle as={Card.Header} variant="link" eventKey="0">
                {this.props.data.name}
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="0">
                    <Card.Body>{this.getSections()}</Card.Body>
                </Accordion.Collapse>
            </Accordion>
        </Card>
        &nbsp;
      </>
    )
  }
}

export default CheckedClass;
