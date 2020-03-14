import React from 'react';
import './App.css';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import cloneDeep from 'lodash/cloneDeep';

class Cart extends React.Component {
   constructor(props) {
       super(props);
       this.section = React.createRef();
       this.subsection = React.createRef();
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

  getSectionOptions() {
    let sectionOptions = [];
    sectionOptions.push(<option key = "all">All</option>);

    for(const section of Object.entries(this.props.data.sections)) {
      sectionOptions.push(<option key={section[0]}>{`${section[0]}`}</option>);
    }
    return sectionOptions;
  }
  
  setCart() {
    const temp = cloneDeep(this.props.data);
    let count = 0;
    
    if (this.section.current.value === "All") {
      if (this.subsection.current.value === "All") {
        this.props.setCart(temp);
      } else {
        // can't add course that with all sections but not all subsections 
        alert("You can't do that, please change your option");
      }
    } else {
      // copy the prop data using cloneDeep, then remain only the section and subsection that are selected
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
        // copy the prop data using cloneDeep, then remain only the section and subsection that are selected
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
            // if selected sections and subsections does not match, alert error message
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

  // collect info of corresponding section and subsection, then alert them out.
  // restriction: you can only check the info one by one
  getInformation() {
    if (this.section.current !== null) {
      if (this.section.current.value === "All") {
        var msg = "If you want to see detailed information, please select your section";
        alert(msg);
      } else {
        let instruct = {};
        instruct = "Instructor: " + this.props.data.sections[this.section.current.value].instructor + 
        "\nSection location: " + this.props.data.sections[this.section.current.value].location + 
        "\nSection time:\n";

        for(const sectime of Object.entries(this.props.data.sections[this.section.current.value].time)) {
          instruct = instruct + sectime[0] + ": " + sectime[1] + "\n";
        }
        if (this.subsection.current.value === "All") {
          msg = "If you want to see detailed information, please select your subsection\nOr there is no subsection";
          alert(msg);
        } else {
          for(const section of Object.entries(this.props.data.sections)) {
            for (const subsection of Object.entries(section[1].subsections)) {
              if (this.subsection.current.value.includes(`${subsection[0]}`)) {
                instruct = instruct + "\nSubsection location: " + subsection[1].location + 
                "\nSubsection time:\n"
              }
              for (const subtime of Object.entries(subsection[1].time)) {
                instruct = instruct + subtime[0] + ": " + subtime[1] + "\n";
              }
            }
          }

        }
        alert(instruct);
      }
    }
  }

  render() {
    return (
      <Card style={{width: '50%', marginTop: '5px', marginBottom: '5px'}}>
        <Card.Body>
          <Card.Subtitle className="mb-2 text-muted">{this.props.data.name}</Card.Subtitle>
          <Form.Group controlId="formSubject">
            <Form.Label> Section: </Form.Label>
            <Form.Control as="select" ref={this.section}>
              {this.getSectionOptions()}
            </Form.Control>
            <Form.Label> Subsection: </Form.Label>
            <Form.Control as="select" ref={this.subsection}>
              {this.getSubOptions()}
            </Form.Control>
            <Button style={{margin: '5px'}} onClick={() => this.getInformation()}>Get detailed information</Button>
            <Button style={{margin: '5px'}} onClick={() => this.setCart()}>Remove from cart</Button>
            </Form.Group>
        </Card.Body>
      </Card>
    )
  }
}


export default Cart;
