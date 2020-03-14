import React from 'react';
import './App.css';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import CheckedClass from './CheckedClass';
import Table from './Table';
import Col from 'react-bootstrap/Col';

class SchedBar extends React.Component {
  constructor(props) {
    super(props);
    this.timeBlocks = [];
    this.schedules = [];
    this.courselist = [];
    this.scheds = [];
    this.timess = [];
    this.tables = [];
    this.blocklist = [];
    this.indices = [];
    this.pref = [[], []];
    this.starthr = React.createRef();
    this.startmin = React.createRef();
    this.endhr = React.createRef();
    this.endmin = React.createRef();
    this.apm1 = React.createRef();
    this.apm2 = React.createRef();
    this.blockname = React.createRef();
    this.prefhr = React.createRef();
    this.prefmin = React.createRef();
    this.apm3 = React.createRef();
    this.bias = React.createRef();

    this.state = {
      blocks: [[[],[],[],[],[]]],
      index: 0,
      breaks: "",
      isMonday: false,
      isTuesday: false,
      isWednesday: false,
      isThursday: false,
      isFriday: false,
      prefMonday: false,
      prefTuesday: false,
      prefWednesday: false,
      prefThursday: false,
      prefFriday: false,
    };

    this.handleMonday = this.handleMonday.bind(this);
    this.handleTuesday = this.handleTuesday.bind(this);
    this.handleThursday = this.handleThursday.bind(this);
    this.handleWednesday = this.handleWednesday.bind(this);
    this.handleFriday = this.handleFriday.bind(this);
    this.Monday = this.Monday.bind(this);
    this.Tuesday = this.Tuesday.bind(this);
    this.Thursday = this.Thursday.bind(this);
    this.Wednesday = this.Wednesday.bind(this);
    this.Friday = this.Friday.bind(this);
  }
  /*
    The table is only designed for 7:00am - 7:00pm, any schedule out of range will be also out of bound
    All functions for extra points are implemented
    For extremely small blocks (exg: 5:20-5:21), sometimes displayed fonts (non-responsive) would be too large
  */
  getCourses() {
    let courses = [];

    for(const course of Object.entries(this.props.data)) {
        courses.push(
            <CheckedClass key={course[0]} data={course[1]} name={course[0]} pushClass={(cls) => this.pushClass(cls)} setCourses={() => this.setCourses()}/>
        );
    }
    if (courses.length === 0) {
      return "Please add your course to the cart first :)\n";
    }
    return courses;
  }

  pushClass(cls) {
    let locked = false;
    if (cls.length === 4) {
      locked = true;
      cls.splice(3, 1);
    }
    let temp = this.courselist;
    let add = true;
    for (let i = 0; i < temp.length; i++) {
      if (temp[i][0] === cls[0]) {
        add = false;
        if (cls[2] === true) {
          temp[i][1] = cls[1];
          this.courselist = temp;
        }
      }
    }
    if (add === true) {
      this.courselist.push(cls);
    }
    for (let i = 0; i < temp.length; i++) {
      if (Object.keys(this.courselist[i][1]).length === 0) {
        this.courselist.splice(i, 1);
        if (i !== temp.length - 1)
          i--;
      }
    }
    if (locked === true) {
      this.setCourses();
    }
  }

  setCourses() {
    for (let i = 0; i < this.courselist.length; i++) {
      let courseTimeBlocks = [];
      let course = this.courselist[i][1];
      if (Object.keys(course).length !== 0) {
        for (const section of Object.entries(course.sections)) {
          if (Object.keys(section[1].subsections).length === 0) {
            courseTimeBlocks.push([section]);
          } else {
            for (const subsection of Object.entries(section[1].subsections)) {
              courseTimeBlocks.push([section, subsection]);
            }
          }
        } 
        this.timeBlocks.push(courseTimeBlocks);
      }
    }
    
    let tempp = [];
    this.generateSched(this.timeBlocks, tempp, 0, []);
    for (let i = 0; i < tempp.length; i++) {
      if (this.validation(tempp[i]) === true) {
        this.schedules.push(tempp[i]);
      }
    }
    for (let i = 0; i < this.schedules.length; i++) {
      this.scheds.push(this.categorize(this.schedules[i]));
    }
    
    let temp = [];
    let temp2 = [];
    if (this.scheds.length === 0) {
      this.setState({blocks: [[[],[],[],[],[]]], index: this.state.index});
    } else {
      for (let l = 0; l < this.scheds.length; l++) {
        for (let i = 0; i < this.scheds[l].length; i++) {
          let info = {};
          if (this.scheds[l][i].length !== 0) {
            for (let j = 0; j < this.scheds[l][i].length; j++) {
              let str = this.scheds[l][i][j][0] + ", " + this.scheds[l][i][j][1][0];
              var times = this.getTime(this.scheds[l][i][j][1][1]);
              for (let k = 0; k < times[0].length; k++) {
                if ((i === 0 && times[0][k] === 'monday') || (i === 1 && times[0][k] === 'tuesday') || (i === 2 && times[0][k] === 'wednesday') || (i === 3 && times[0][k] === 'thursday') || (i === 4 && times[0][k] === 'friday')) {
                  //for (let m = 0; m < this.times; i++) {
                  //  if (this.timess[m] === )
                  //}
                  info = {name: str, start: times[1][k]/4, end: times[2][k]/4};
                  temp2.push(info);
                }
              }
            }
          }
          temp.push(temp2);
          temp2 = [];
        }
        this.tables.push(temp);
        temp = [];
      }
      this.setState({blocks: this.tables, index: this.state.index});
    }
    this.schedules = [];
    this.timeBlocks = [];
    this.scheds = [];
    this.tables = [];
    this.setState({index: 0});
  }

  displayTable() {
    this.sortTables();
    let table = <Table key={'table'} data={this.state.blocks[this.indices[this.state.index]]}/>;    
    return table;
  }

  categorize(schedule) {
    let cat = [];
    for (let i = 0; i < 5; i++) {
      cat.push([]);
    }
    //all courses in a specific schedule
    for (let i = 0; i < schedule.length; i++) {
      //section/subsection in a specific course
      for (let j = 0; j < schedule[i].length; j++) {
          let week = schedule[i][j][1].time;
          for (const day of Object.entries(week)) {
            if(`${day[0]}` === "monday") {
              cat[0].push([this.courselist[i][0], schedule[i][j]]);
            }
            if(`${day[0]}` === "tuesday") {
              cat[1].push([this.courselist[i][0], schedule[i][j]]);
            }
            if(`${day[0]}` === "wednesday") {
              cat[2].push([this.courselist[i][0], schedule[i][j]]);
            }
            if(`${day[0]}` === "thursday") {
              cat[3].push([this.courselist[i][0], schedule[i][j]]);
            }
            if(`${day[0]}` === "friday") {
              cat[4].push([this.courselist[i][0], schedule[i][j]]);
            }
        }
      }
    }
    return cat;
  }

  generateSched(lists, result, depth, current) {
    if (depth === lists.length) {
      result.push(current);
      return;
    }
    for (let i = 0; i < lists[depth].length; i++) {
      var next = [...current];
      next.push(lists[depth][i]);
      this.generateSched(lists, result, depth+1, next);
    }
  }

  validation(lists) {
    var timelist = [];
    let check = true;
    for (let i = 0; i < lists.length; i++) {
      for (let j = 0; j < lists[i].length; j++) {
        timelist.push(this.getTime(lists[i][j][1]));
      } 
    }
    for (let i = 0; i < timelist.length; i++) {
      for (let j = i+1; j < timelist.length; j++) {
        if (this.checkConflict(timelist[i], timelist[j]) === true) {
          check = false;
        }
      }
    }
    if (check === true) {
      this.timess.push(timelist);
    }
    return check;
  }

  checkConflict(time1, time2) {
    var ans = false;
    for (let i = 0; i < time1[0].length; i++) {
      for (let j = 0; j < time2[0].length; j++) {
        if (time1[0][i] === time2[0][j]) {
          if (time1[1][i] >= time2[1][j] && time1[1][i] <= time2[2][j]) {
            ans = true;
          }
          if (time1[2][i] >= time2[1][j] && time1[2][i] <= time2[2][j]) {
            ans = true;
          }
          if (time2[1][j] >= time1[1][i] && time2[1][j] <= time1[2][i]) {
            ans = true;
          }
          if (time2[2][j] >= time1[1][i] && time2[2][j] <= time1[2][i]) {
            ans = true;
          }
        }
      }
    }
    if (ans === false) {
      //console.log(time1);
      //console.log(time2);
    }
    return ans;
  }

  getTime(input) {
    let weekday = [];
    let start = [];
    let end = [];
    for (const day of Object.entries(input.time)) {
      weekday.push(`${day[0]}`);
      let msg = day[1];
      start.push(this.calcTime(msg)[0]);
      end.push(this.calcTime(msg)[1]);
    }
    return [weekday, start, end];
  }

  calcTime(msg) {
    let i = 0;
    let startHr = "";
    let startMin = "";
    let endHr = "";
    let endMin = "";
    let startMorning;
    let endMorning;

    while (!isNaN(parseInt(msg.charAt(i)))) {
      startHr += msg.charAt(i);
      i++;
    }
    while (isNaN(parseInt(msg.charAt(i)))) {
      i++;
    }
    while (!isNaN(parseInt(msg.charAt(i)))) {
      startMin += msg.charAt(i);
      i++;
    }
    while (isNaN(parseInt(msg.charAt(i)))) {
      startMorning += msg.charAt(i);
      i++;
    }
    if (startMorning.includes("am")) {
      startMorning = true;
    } else if (startMorning.includes("pm")) {
      startMorning = false;
    }
    while (!isNaN(parseInt(msg.charAt(i)))) {
      endHr += msg.charAt(i);
      i++;
    }
    while (isNaN(parseInt(msg.charAt(i)))) {
      i++;
    }
    while (!isNaN(parseInt(msg.charAt(i)))) {
      endMin += msg.charAt(i);
      i++;
    }
    for (let j = 0; j < 5; j++) {
      endMorning += msg.charAt(i);
      i++;
    }
    if (endMorning.includes("am")) {
      endMorning = true;
    } else if (endMorning.includes("pm")) {
      endMorning = false;
    }

    startHr = parseInt(startHr);
    startMin = parseInt(startMin);
    endHr = parseInt(endHr);
    endMin = parseInt(endMin);
    if (startMorning === false && startHr !== 12 && startHr != 11) {
      startHr += 12;
    }
    if (endMorning === false && endHr !== 12 && startHr != 11) {
      endHr += 12;
    }
    return [startHr*60 + startMin, endHr*60 + endMin];
  }

  previous() {
    if (this.state.index === 0) {
      this.setState({blocks: this.state.blocks, index: this.state.blocks.length-1});
    } else {
      this.setState({blocks: this.state.blocks, index: this.state.index-1});
    }
  }

  next() {
    if (this.state.index === this.state.blocks.length-1) {
      this.setState({blocks: this.state.blocks, index: 0});
    } else {
      this.setState({blocks: this.state.blocks, index: this.state.index+1});
    }
  }

  showIndex() {
    let msg = "";
    if (this.state.blocks.length === 1) {
      if (this.state.blocks[0][0].length === 0 && this.state.blocks[0][1].length === 0 && this.state.blocks[0][2].length === 0 && this.state.blocks[0][3].length === 0 && this.state.blocks[0][4].length === 0 ) {
        return "0 out of 0";
      }
    } else {
      msg += (this.state.index+1).toString();
      msg += " out of ";
      msg += (this.state.blocks.length).toString();
      return msg;
    }
  }

  addBlock() {
    let block = [];
    block.push(this.blockname.current.value);
    let breaks = {};
    breaks["sections"] = {};
    breaks.sections["Custom_Block"] = {};
    breaks.sections.Custom_Block["subsections"] = {};
    breaks.sections.Custom_Block["time"] = {};
    let msg = this.starthr.current.value.toString() + ":" + this.startmin.current.value.toString() + this.apm1.current.value;
    msg += " - " + this.endhr.current.value.toString() + ":" + this.endmin.current.value.toString() + this.apm2.current.value;
    for (let i = 0; i < this.blocklist.length; i++) {
      if (this.blocklist[i][1] === msg || this.blocklist[i][0] === this.blockname.current.value) {
        alert("You've already implemented the same block (same name or time)");
        return;
      }
    }
    if (this.checkValid(msg) === true) {
      this.blocklist.push([this.blockname.current.value, msg]);
      if (this.state.isMonday === true)
        breaks.sections.Custom_Block.time["monday"] = msg;
      if (this.state.isTuesday === true)
        breaks.sections.Custom_Block.time["tuesday"] = msg;
      if (this.state.isWednesday === true)
        breaks.sections.Custom_Block.time["wednesday"] = msg;
      if (this.state.isThursday === true)
        breaks.sections.Custom_Block.time["thursday"] = msg;
      if (this.state.isFriday === true)
        breaks.sections.Custom_Block.time["friday"] = msg;
      block.push(breaks);
      block.push(true);
      this.pushClass(block);
    } else {
      alert("Your input is invalid, please try agian");
      return;
    }
    let list = [];
    let str = "";
    for (let i = 0; i < this.blocklist.length; i++) {
      str += "Block " + (i+1).toString() + ": " + this.blocklist[i][0] + " (" + this.blocklist[i][1] + ")";
      list.push(str);
      str = "";
    }
    this.setState({breaks: list});
    this.starthr.current.value = "";
    this.endhr.current.value = "";
    this.startmin.current.value = "";
    this.endmin.current.value = "";
    this.apm1.current.value = "";
    this.apm2.current.value = "";
    this.blockname.current.value = "";
    this.setState({isMonday: false, isTuesday: false, isWednesday: false, isThursday: false, isFriday: false});
  }

  displayBlocks() {
    let display = [];
    for (let i = 0; i < this.state.breaks.length; i++) {
      display.push(            
        <Form.Group controlId="name">
          <Form.Control type="name" autoComplete="off" defaultValue={this.state.breaks[i]} readOnly/>
        </Form.Group>
      );
    }
    if (display.length === 0) {
      display.push(
        <p key="no-block">You don't have a custom block yet, create one above! </p>
      );
    }
    return display;
  }

  checkValid(msg) {
    let truth = true;
    if (this.blockname.current.value === "") {
      alert("Please enter the block name");
      truth = false;
      return truth;
    }
    if (isNaN(this.starthr.current.value) || isNaN(this.startmin.current.value) || isNaN(this.endhr.current.value) || isNaN(this.endmin.current.value)) {
      truth = false;
      return truth;
    }
    if (parseInt(this.starthr.current.value) < 1 || parseInt(this.starthr.current.value) > 12 || parseInt(this.startmin.current.value) < 0 || parseInt(this.startmin.current.value) > 60) {
      truth = false;
      return truth;
    }
    if (parseInt(this.endhr.current.value) < 1 || parseInt(this.endhr.current.value) > 12 || parseInt(this.endmin.current.value) < 0 || parseInt(this.endmin.current.value) > 60) {
      truth = false;
      return truth;
    }
    let answer = this.calcTime(msg);
    if (answer[0] >= answer[1]) {
      truth = false;
      return truth;
    }
    if (this.state.isMonday === false && this.state.isTuesday === false && this.state.isWednesday === false && this.state.isThursday === false && this.state.isFriday === false) {
      alert("Please choose your day(s)");
      truth = false;
      return truth;
    }
    return truth;
  }

  handleMonday(event) {
    this.setState({ isMonday: event.target.checked });
  }

  handleTuesday(event) {
    this.setState({ isTuesday: event.target.checked });
  }

  handleWednesday(event) {
    this.setState({ isWednesday: event.target.checked });
  }

  handleThursday(event) {
    this.setState({ isThursday: event.target.checked });
  }

  handleFriday(event) {
    this.setState({ isFriday: event.target.checked });
  }

  sortTables() {
    //[[DAYS],[TIMES]]
    this.indices = [];
    let days = [];
    let dayrank = [];
    let times = [];
    let timerank = [];
    let sum = 0;
    let size = 0;
    let min = Number.MAX_VALUE;
    for (let i = 0; i < this.pref[0].length; i++) {
        if (this.pref[0][i] === "monday") 
            days.push(0);
        if (this.pref[0][i] === "tuesday")
            days.push(1);
        if (this.pref[0][i] === "wednesday")
            days.push(2);
        if (this.pref[0][i] === "thursday")
            days.push(3);
        if (this.pref[0][i] === "friday")
            days.push(4);
    }
    for (let i = 0; i < this.pref[1].length; i++) {
        times.push(this.pref[1][i]);
    }
    for (let i = 0; i < this.state.blocks.length; i++) {
        for (let j = 0; j < days.length; j++) {
            sum += this.state.blocks[i][days[j]].length;
        }
        dayrank[i] = sum;
        sum = 0;
    }
    //console.log(dayrank);
    dayrank = this.maxrank(dayrank);
    //console.log(this.state.blocks);
    
    for (let i = 0; i < this.state.blocks.length; i++) {
        for (let j = 0; j < 5; j++) {
            for (let k = 0; k < this.state.blocks[i][j].length; k++) {
                for (let l = 0; l < times.length; l++) {
                    let temp = Math.abs(this.state.blocks[i][j][k].start - times[l]) + Math.abs(this.state.blocks[i][j][k].end - times[l]);
                    if (temp < min) {
                        min = temp;
                    }
                }
                if (sum !== Number.MAX_VALUE)
                  sum = sum + min;
                min = Number.MAX_VALUE;
            }
        }
        if (size != 0)
          sum = sum/size;
        timerank[i] = sum;
        sum = 0;
        size = 0;
    }
    for (let i = 0; i < timerank.length; i++) {
      if (isNaN(timerank[i]))
      timerank[0] = 1;
    }
    //console.log(timerank);
    timerank = this.minrank(timerank);
    if (this.bias.current === null) {
      for (let i = 0; i < dayrank.length; i++) {
        this.indices.push(dayrank[i] + timerank[i]);
      }
    } else {
      if (this.bias.current.value === "Normal") {
        for (let i = 0; i < dayrank.length; i++) {
          this.indices.push(dayrank[i] + timerank[i]);
        }
      } else if (this.bias.current.value === "Day-biased") {
        for (let i = 0; i < dayrank.length; i++) {
          this.indices.push(dayrank[i]*5 + timerank[i]);
        }
      } else if (this.bias.current.value === "Time-biased") {
        for (let i = 0; i < dayrank.length; i++) {
          this.indices.push(dayrank[i] + timerank[i]*5);
        }
      } else {
        for (let i = 0; i < dayrank.length; i++) {
          this.indices.push(dayrank[i] + timerank[i]);
        }
      }
    }
    this.indices = this.sort(this.indices);
}

//[4,5,1,9] => [2,0,1,3]
sort(list) {
    let ranking = [];
    for (let i = 0; i < list.length; i++) {
        ranking.push(-1);
    }
    let fin = [];
    let min = Number.MAX_VALUE;
    let index = -1;
    let curr = 0;
    let skip = false;
    while (fin.length !== list.length) {
        for (let i = 0; i < list.length; i++) {
            for (let j = 0; j < fin.length; j++) {
                if (i === fin[j]) {
                    skip = true;
                    break;
                }
            }
            if (skip === true) {
                skip = false;
                continue;
            }
            if (list[i] < min) {
                min = list[i];
                index = i;
            }
        }
        fin.push(index);
        ranking[curr] = index;
        curr++;
        index = -1;
        min = Number.MAX_VALUE;
    }
    return ranking;
}

//[4,5,1,9] => [3,2,4,1]
maxrank(list) {
    let ranking = [];
    for (let i = 0; i < list.length; i++) {
        ranking.push(-1);
    }
    let fin = [];
    let max = -1;
    let same = 0;
    let curr = 1;
    let skip = false;
    while (fin.length !== list.length) {
        for (let i = 0; i < list.length; i++) {
            for (let j = 0; j < fin.length; j++) {
                if (i === fin[j]) {
                    skip = true;
                    break;
                }
            }
            if (skip === true) {
                skip = false;
                continue;
            }
            if (list[i] > max) {
                max = list[i];
            }
        }
        for (let i = 0; i < list.length; i++) {
          if (max === list[i]) {
            fin.push(i);
            ranking[i] = curr;
            same++;
          }
        }
        curr+= same;
        same = 0;
        max = -1;
    }
    return ranking;
}

//[4,5,1,9] => [2,3,1,4]
minrank(list) {
    let ranking = [];
    for (let i = 0; i < list.length; i++) {
        ranking.push(-1);
    }
    let fin = [];
    let min = Number.MAX_VALUE;
    let curr = 1;
    let skip = false;
    while (fin.length !== list.length) {
        for (let i = 0; i < list.length; i++) {
            for (let j = 0; j < fin.length; j++) {
                if (i === fin[j]) {
                    skip = true;
                    break;
                }
            }
            if (skip === true) {
                skip = false;
                continue;
            }
            if (list[i] < min) {
                min = list[i];
            }
        }
        for (let i = 0; i < list.length; i++) {
          if (min === list[i]) {
            fin.push(i);
            ranking[i] = curr;
          }
        }
        curr++;
        min = Number.MAX_VALUE;
    }
    return ranking;
}

Monday(event) {
  this.setState({ prefMonday: event.target.checked });
}

Tuesday(event) {
  this.setState({ prefTuesday: event.target.checked });
}

Wednesday(event) {
  this.setState({ prefWednesday: event.target.checked });
}

Thursday(event) {
  this.setState({ prefThursday: event.target.checked });
}

Friday(event) {
  this.setState({ prefFriday: event.target.checked });
}

setPref() {
  if (isNaN(this.prefhr.current.value) || isNaN(this.prefmin.current.value)) {
    alert("Invalid input, pleas try again");
    return;
  }
  if (parseInt(this.prefhr.current.value) < 1 || parseInt(this.prefhr.current.value) > 12 || parseInt(this.prefmin.current.value) < 0 || parseInt(this.prefmin.current.value) > 60) {
    alert("Invalid input, pleas try again");
    return;
  }
  let prefHr = -1;
  if (this.apm3.current.value === "pm" && parseInt(this.prefhr.current.value) !== 12 && parseInt(this.prefhr.current.value) != 11) {
    prefHr = parseInt(this.prefhr.current.value) + 12;
  } else {
    prefHr = parseInt(this.prefhr.current.value);
  }
  this.pref = [[], []];
  this.pref[1].push((prefHr*60+parseInt(this.prefmin.current.value))/4);

  if (this.state.prefMonday === true) {
    this.pref[0].push("monday");
  }
  if (this.state.prefTuesday === true) {
    this.pref[0].push("tuesday");
  }
  if (this.state.prefWednesday === true) {
    this.pref[0].push("wednesday");
  }
  if (this.state.prefThursday === true) {
    this.pref[0].push("thursday");
  }
  if (this.state.prefFriday === true) {
    this.pref[0].push("friday");
  }

}

showinfo() {
  alert("All functions for extra points are implemented\n\nNOTE:\n1. Only lock/unlock and generate buttons update and refresh the tables\n2. Whenever made any change(s) to preference, need to press Set Preference before Generate to update the changes\n3. The table is only designed for 7:00am - 7:00pm, any schedule out of range will be also out of bound\n4. For extremely small blocks (exg: 5:20-5:21), sometimes displayed fonts (non-responsive) would be too large\n5. Generation may lag for a bit if there are more than 1024 results");
}

showinfo2() {
  alert("Day-biased grants more power/importance to days (Monday, Tuesday...); Time-biased grants moer power to time.\n\nFor instance: preference of Monday and 1:00pm, day-biased will show schedules with the most Monday classes first, then classes that are close to 1:00pm.");
}
  render() {
    return (
      <>
        <div>
          <Button style={{marginLeft: '400px', marginTop: '620px', position: 'fixed'}} onClick={() => this.previous()}>Previous</Button>
          <Button style={{marginLeft: '1300px', marginTop: '620px', position: 'fixed'}} onClick={() => this.next()}>Next</Button>
          <p style={{marginLeft: '850px', marginTop: '620px', position: 'fixed'}}>{this.showIndex()}</p>
        </div>
        <Card style={{width: 'calc(20vw - 5px)', height: '100%'}}>
          <Card.Body>
          <Button size="sm" variant="primary" onClick={() => this.showinfo()} style={{margin: '5px'}}>Details</Button>
            <p></p>
            <Card.Title >Class List</Card.Title>
            <p>click course title to expand</p>
            <Form>
            {this.getCourses()}
            </Form>
            <p></p>
            <Card.Title>Custom Block</Card.Title>
            <Form.Group controlId="name">
                <Form.Control type="text" placeholder="Name" autoComplete="off" ref={this.blockname}/>
              </Form.Group>
            <Form>
            <Form.Label> Start time</Form.Label>
            <Form.Row>
              <Form.Group as={Col} md="4" controlId="starthour">
                    <Form.Control type="text"  placeholder="hour" autoComplete="off" ref={this.starthr}/>
              </Form.Group>
              <h3><b> : </b></h3>
              <Form.Group as={Col} md="4" controlId="startmin">
                <Form.Control type="text" placeholder="minute" autoComplete="off" ref={this.startmin}/>
              </Form.Group>
              <Form.Group controlId="am/pm2" style={{marginLeft:'5px'}}>
                  <Form.Control as="select" ref={this.apm1}>
                    <option key="am">am</option>
                    <option key="pm">pm</option>
                  </Form.Control>
              </Form.Group>
            </Form.Row>

            <Form.Label> End time </Form.Label>
            <Form.Row>
              <Form.Group as={Col} md="4" controlId="endhour">
                    <Form.Control type="text"  placeholder="hour" autoComplete="off" ref={this.endhr}/>
              </Form.Group>
              <h3><b> : </b></h3>
              <Form.Group as={Col} md="4" controlId="endmin">
                <Form.Control type="text" placeholder="minute" autoComplete="off" ref={this.endmin}/>
              </Form.Group>

              <Form.Group controlId="am/pm2" style={{marginLeft:'5px'}}>
                  <Form.Control as="select" ref={this.apm2}>
                    <option key="am">am</option>
                    <option key="pm">pm</option>
                  </Form.Control>
              </Form.Group>
            </Form.Row>

            <Form.Group >
      <Form.Label as="legend" column sm={2}>
      </Form.Label>
      <Col sm={10}>
        <Form.Check
          label="Monday"
          checked={this.state.isMonday} 
          onChange={this.handleMonday}
        />
        <Form.Check
          label="Tuesday"
          checked={this.state.isTuesday} 
          onChange={this.handleTuesday}
        />
        <Form.Check
          label="Wednesday"
          checked={this.state.isWednesday} 
          onChange={this.handleWednesday}
        />
                <Form.Check
          label="Thursday"
          checked={this.state.isThursday} 
          onChange={this.handleThursday}
        />
        <Form.Check
          label="Friday"
          checked={this.state.isFriday} 
          onChange={this.handleFriday}
        />
      </Col>
    </Form.Group>

            <Button style={{margin: '5px'}} onClick={() => this.addBlock()}>Add Block</Button>
            <p></p>
            <Form.Group>
            <Form.Label> Block List</Form.Label>
            {this.displayBlocks()}
            </Form.Group>
            
            <Card.Title>Custom Preference</Card.Title>
            <Button size="sm" variant="outline-primary" onClick={() => this.showinfo2()} style={{margin: '5px'}}>What's the difference?</Button>
            <Form.Group controlId="bias" style={{marginLeft:'5px'}}>
                  <Form.Control as="select" ref={this.bias}>
                    <option key="normal">Normal</option>
                    <option key="day">Day-biased</option>
                    <option key="time">Time-biased</option>
                  </Form.Control>
              </Form.Group>
            
            <Form.Label> Set time</Form.Label>
            <Form.Row>
              <Form.Group as={Col} md="4" controlId="starthour">
                    <Form.Control type="text"  placeholder="hour" autoComplete="off" ref={this.prefhr}/>
              </Form.Group>
              <h3><b> : </b></h3>
              <Form.Group as={Col} md="4" controlId="startmin">
                <Form.Control type="text" placeholder="minute" autoComplete="off" ref={this.prefmin}/>
              </Form.Group>
              <Form.Group controlId="am/pm2" style={{marginLeft:'5px'}}>
                  <Form.Control as="select" ref={this.apm3}>
                    <option key="am">am</option>
                    <option key="pm">pm</option>
                  </Form.Control>
              </Form.Group>
            </Form.Row>
            
                  <Form.Group >
            <Form.Label as="legend" column sm={2}>
            </Form.Label>
            <Col sm={10}>
              <Form.Check
                label="Monday"
                checked={this.state.prefMonday} 
                onChange={this.Monday}
              />
              <Form.Check
                label="Tuesday"
                checked={this.state.prefTuesday} 
                onChange={this.Tuesday}
              />
              <Form.Check
                label="Wednesday"
                checked={this.state.prefWednesday} 
                onChange={this.Wednesday}
              />
                      <Form.Check
                label="Thursday"
                checked={this.state.prefThursday} 
                onChange={this.Thursday}
              />
              <Form.Check
                label="Friday"
                checked={this.state.prefFriday} 
                onChange={this.Friday}
              />
            </Col>
          </Form.Group>
          <Button style={{margin: '5px'}} onClick={() => this.setPref()}>Set Preferences</Button>
            <p></p>

            <Button variant="dark" size="lg" block style={{margin: '5px'} } onClick={() => this.setCourses()}>Generate Schedule</Button>
            </Form>
          </Card.Body>
        </Card>
        {this.displayTable()} 
      </>
    )
  }
}

export default SchedBar;
