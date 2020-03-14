class TagFilter {
    TagFilter(flag, courses, tags, subject, minimumCredits, maximumCredits) {
      // go through all tags, remove the course if it does not match the requirements and all of the tags
      if (flag === "Method 1") {
        for (var i = 0; i < tags.length; i++) {
          var search = tags[i];
          if(search !== '') {
            let coursesAfterSearch = [];
      
            for(const course of Object.values(courses)) {
              for(const keyword of course.keywords) {
                if(keyword.includes(search)) {
                  coursesAfterSearch.push(course);
                  break;
                }
              }
            }
            courses = coursesAfterSearch;
          }
        }
        if(subject !== 'All') {
          let coursesAfterSubject = [];
    
          for(const course of Object.values(courses)) {
            if(course.subject === subject)
              coursesAfterSubject.push(course)
          }
          courses = coursesAfterSubject;
        }
    
        if(minimumCredits !== '') {
          let coursesAfterMinimumCredits = [];
    
          for(const course of Object.values(courses)) {
            if(course.credits >= parseInt(minimumCredits))
              coursesAfterMinimumCredits.push(course);
          }
          courses = coursesAfterMinimumCredits;
        }
    
        if(maximumCredits !== '') {
          let coursesAfterMaximumCredits = [];
     
          for(const course of Object.values(courses)) {
            if(course.credits <= parseInt(maximumCredits))
              coursesAfterMaximumCredits.push(course);
            }
            courses = coursesAfterMaximumCredits;
          }  
      // go through all tags, add the course if it does match the requirements and one of the tags
      } else if (flag === "Method 2") {
        if(subject !== 'All') {
          let coursesAfterSubject = [];
    
          for(const course of Object.values(courses)) {
            if(course.subject === subject)
              coursesAfterSubject.push(course)
          }
          courses = coursesAfterSubject;
        }
    
        if(minimumCredits !== '') {
          let coursesAfterMinimumCredits = [];
    
          for(const course of Object.values(courses)) {
            if(course.credits >= parseInt(minimumCredits))
              coursesAfterMinimumCredits.push(course);
          }
          courses = coursesAfterMinimumCredits;
        }
    
        if(maximumCredits !== '') {
          let coursesAfterMaximumCredits = [];
    
          for(const course of Object.values(courses)) {
            if(course.credits <= parseInt(maximumCredits))
              coursesAfterMaximumCredits.push(course);
          }
          courses = coursesAfterMaximumCredits;
        }

        let coursesAfterSearch = [];
        for(const course of Object.values(courses)) {
          for(const keyword of course.keywords) {
            for (var i = 0; i < tags.length; i++) {
              var search = tags[i];
              if(keyword.includes(search)) {
                coursesAfterSearch.push(course);
                break;
              }
            }
          }
        }
        courses = coursesAfterSearch;
      }
      return courses;
    }
  }
  
  export default TagFilter;
  