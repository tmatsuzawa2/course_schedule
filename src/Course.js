import React from 'react';
import './App.css';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import cloneDeep from 'lodash/cloneDeep';

class Course extends React.Component {
  constructor(props) {
    super(props);
    this.section = React.createRef();
    this.subsection = React.createRef();
}

  render() {
    return (
      <Card style={{width: '33%', marginTop: '5px', marginBottom: '5px'}}>
        <Card.Body>
          <Card.Title>{this.props.data.name}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{this.props.data.number} - {this.getCredits()}</Card.Subtitle>
          <Form.Group controlId="formSubject">
            <Form.Label> Section: </Form.Label>
            <Form.Control as="select" ref={this.section}>
              {this.getSectionOptions()}
            </Form.Control>
            <Form.Label> Subsection: </Form.Label>
            <Form.Control as="select" ref={this.subsection}>
              {this.getSubOptions()}
            </Form.Control>
            </Form.Group>
          <Button onClick={() => this.setCart()}>Add to cart</Button>
        </Card.Body>
      </Card>
    )
  }

  getCredits() {
    if(this.props.data.credits === 1)
      return '1 credit';
    else
      return this.props.data.credits + ' credits';
  }

  //return part of the course (course info) that is going to be added
  setCart() {
    const temp = cloneDeep(this.props.data);
    let count = 0;
    
    if (this.section.current.value === "All") {
      if (this.subsection.current.value === "All") {
        this.props.setCart(temp);
      } else {
        alert("You can't do that, please change your option");
      }
    } else {
      if (this.subsection.current.value === "All") {
        delete temp.sections;
        for(const section of Object.entries(this.props.data.sections)) {
          if (`${section[0]}` === this.section.current.value) {
            temp.sections = {};
            temp.sections[section[0]] = cloneDeep(section[1]);
          }
        }
        this.props.setCart(temp);
      } else {
        delete temp.sections;
        for(const section of Object.entries(this.props.data.sections)) {
          if (`${section[0]}` === this.section.current.value) {
            temp.sections = {};
            temp.sections[section[0]] = cloneDeep(section[1]);
            for (const subsection of Object.entries(section[1].subsections)) {
              if (this.subsection.current.value.includes(`${subsection[0]}`)) {
                count++;
                temp.sections[section[0]].subsections = {};
                temp.sections[section[0]].subsections[subsection[0]] = cloneDeep(subsection[1]);
              }
            }
            if (count !== 1) {
              alert("Section and subsection does not match, please change your option");
            } else {
              this.props.setCart(temp);
            }
          }
        }
      }
    }
  }

  getSectionOptions() {
    let sectionOptions = [];
    sectionOptions.push(<option key = "all">All</option>);

    for(const section of Object.entries(this.props.data.sections)) {
      sectionOptions.push(<option key={section[0]}>{`${section[0]}`}</option>);
    }
    return sectionOptions;
  }

  getSubOptions() {
    let subOptions = [];
    subOptions.push(<option key = "all">All</option>);

    for(const section of Object.entries(this.props.data.sections)) {
      for(const subsection of Object.entries(section[1].subsections)) {
        subOptions.push(<option key={subsection[0]}>{`${section[0]}`}, {`${subsection[0]}`}</option>);
      }
    }
    return subOptions;
  }
}

export default Course;