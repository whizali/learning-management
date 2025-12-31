import { formatPrice } from '@/lib/utils'
import React from 'react'   

import { Button } from '@/components/ui/button'
import AccordionSections from '@/components/AccordionSections'

const SelectedCourse = ({ course, handleEnrollNow }: SelectedCourseProps) => {
  return (
    <div className='selected-course'>
      <div>
        <h3 className='selected-course__title'>{course.title}</h3>
        <p className='selected-course__author'>By {course.teacherName} | {""}
            <span className='selected-enrollment-count'>{course.enrollments?.length} Enrolled</span>
        </p>
      </div>

      <div className='selected-course__content'>
        <p className='selected-course__description'>{course.description}</p>
        <div className='selected-course__sections'>
            <h4 className='selected-course__sections-title'>Course Content</h4>
            <AccordionSections sections={course.sections} />
        </div>

        <div className='selected-course__footer'>
            <p className='selected-course__price'>{formatPrice(course.price)}</p>
            <Button className='bg-primary-700 hover:bg-primary-600' onClick={() => handleEnrollNow(course.courseId)}>Enroll Now</Button>
        </div>
      </div>

    </div>
  )
}

export default SelectedCourse