import React from 'react';
import './App.css';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import TagFilter from './TagFilter';

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.TagFilter = new TagFilter();
    this.subject = React.createRef();
    this.minimumCredits = React.createRef();
    this.maximumCredits = React.createRef();
    //references added
    //  search: add tag
    //  remove: remove tag
    //  flag: method 1 or 2
    //  tags: tag list 
    this.search = React.createRef();
    this.remove = React.createRef();
    this.flag = React.createRef();
    this.tags = [];
  }

  setCourses() {
    // run the method according to its flag value
    if (this.flag.current.value === "Method 1" || this.flag.current.value === "Method 2")
      this.props.setCourses(this.TagFilter.TagFilter(this.flag.current.value, this.props.courses, this.tags, this.subject.current.value, this.minimumCredits.current.value, this.maximumCredits.current.value));
    else
      alert("Please choose your filter method");
  }

  handleCreditsKeyDown(e) {
    if(['0','1','2','3','4','5','6','7','8','9','Backspace','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Tab'].indexOf(e.key) === -1)
      e.preventDefault();
  }

  // handle keydown for "Enter"
  handleAddTagsKeyDown(e) {
    if(e.keyCode === 13){
      var success = 0;
      for (var i = 0; i < this.tags.length; i++) {
        if (this.tags[i] === this.search.current.value) {
          success = 1;
        }
      }
      if (success === 0)
        this.tags.push(this.search.current.value);
      this.setCourses();
    }
  }

  handleRemoveTagsKeyDown(e) {
    if(e.keyCode === 13) {
      var success = 0;
      for (var i = 0; i < this.tags.length; i++) {
        if (this.tags[i] === this.remove.current.value) {
          this.tags.splice(i, 1);
          success = 1;
        }
      }
      if (success === 0) {
        var msg = "'" +  this.remove.current.value + "' is not in the tag list, please try again."
        alert(msg);
      }
      this.setCourses();
    }
  }

  // show the tags
  showTags() {
    var msg = "";
    for (var i = 0; i < this.tags.length; i++) {
      msg = msg + this.tags[i];
      if (i !== this.tags.length - 1) {
        msg = msg + "; "
      }
    }
    if (msg === "") {
      msg = "Currently no Tag";
    }
    return msg;
  }

  getSubjectOptions() {
    let subjectOptions = [];

    for(const subject of this.props.subjects) {
      subjectOptions.push(<option key={subject}>{subject}</option>);
    }

    return subjectOptions;
  }

  // implement the "select" for methods
  getFilterMethod() {
    let options = [];
    options.push(<option key="method1">Method 1</option>);
    options.push(<option key="method2">Method 2</option>);

    return options;
  }

  // detail for two methods
  showInfo() {
    var msg = "Method 1: We want to allow the user to filter results that fit all the tags (intersection of tags/and logic between tags).\n";
    msg = msg + "Method 2: We want to allow the user to filter results that fit at least one of the tags in the tag list (union of tags/or logic between tags).";
    alert(msg);
  }

  render() {
    return (
      <>
        <Card style={{width: 'calc(20vw - 5px)', marginLeft: '5px', height: 'calc(100vh - 10px)', position: 'fixed'}}>
          <Card.Body>
            <Card.Title>Search and Filter</Card.Title>
            <Form>
              <Form.Group controlId="formSubject">
                <Form.Label>Filter Method</Form.Label>
                <Button onClick={() => this.showInfo()} style={{margin: '5px'}}>Details</Button>
                <Form.Control as="select" ref={this.flag} onClick={() => this.setCourses()}>
                  {this.getFilterMethod()}
                </Form.Control>
              </Form.Group>

              <Form.Label>Tag List:</Form.Label>
              <p>{this.showTags()}</p>

              <Form.Group controlId="formKeywords"  onKeyDown={(e) => this.handleAddTagsKeyDown(e)} style={{width: '100%'}}>
                <Form.Label>Add Tag</Form.Label>
                <Form.Control type="text" placeholder="Tag" autoComplete="off" ref={this.search}/>
              </Form.Group>

              <Form.Group controlId="formKeywords"  onKeyDown={(e) => this.handleRemoveTagsKeyDown(e)} style={{width: '100%'}}>
                <Form.Label>Remove Tag</Form.Label>
                <Form.Control type="text" placeholder="Tag" autoComplete="off" ref={this.remove}/>
              </Form.Group>

              <Form.Group controlId="formSubject">
                <Form.Label>Subject</Form.Label>
                <Form.Control as="select" ref={this.subject} onClick={() => this.setCourses()}>
                  {this.getSubjectOptions()}
                </Form.Control>
              </Form.Group>

              <div style={{display: 'flex', flexDirection: 'row'}}>
                <Form.Group controlId="minimumCredits" onChange={() => this.setCourses()} onKeyDown={(e) => this.handleCreditsKeyDown(e)}>
                  <Form.Label>Credits</Form.Label>
                  <Form.Control type="text" placeholder="minimum" autoComplete="off" ref={this.minimumCredits}/>
                </Form.Group>
                <div style={{marginLeft: '5px', marginRight: '5px', marginTop: '38px'}}>to</div>
                <Form.Group controlId="maximumCredits" style={{marginTop: '32px'}} onChange={() => this.setCourses()} onKeyDown={(e) => this.handleCreditsKeyDown(e)}>
                  <Form.Control type="text" placeholder="maximum" autoComplete="off" ref={this.maximumCredits}/>
                </Form.Group>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </>
    )
  }
}

export default Sidebar;
