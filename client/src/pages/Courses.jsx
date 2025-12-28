import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useAuth } from '../hooks/useAuth';

const Courses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('/courses');
      setCourses(response.data.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      alert('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) {
      return;
    }

    try {
      await axios.delete(`/courses/${id}`);
      alert('Course deleted successfully');
      fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Failed to delete course');
    }
  };

  const filteredCourses = courses.filter((course) => {
    const courseName = course.courseName?.toLowerCase() || '';
    const courseCode = course.courseCode?.toLowerCase() || '';
    const department = course.department?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();
    
    return courseName.includes(search) || courseCode.includes(search) || department.includes(search);
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
          <p className="text-gray-600 mt-1">View and manage all courses</p>
        </div>
        {user.role === 'ADMIN' && (
          <button className="btn-primary">
            + Add Course
          </button>
        )}
      </div>

      <div className="card mb-6">
        <input
          type="text"
          placeholder="Search by course name, code, or department..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            No courses found
          </div>
        ) : (
          filteredCourses.map((course) => (
            <div key={course._id} className="card hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{course.courseCode}</h3>
                  <p className="text-sm text-gray-600">{course.department}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  course.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {course.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <h4 className="font-semibold text-gray-900 mb-2">{course.courseName}</h4>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>

              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <span>Credits: {course.credits}</span>
                <span>Students: {course.students?.length || 0}</span>
              </div>

              {course.teacher && (
                <div className="text-sm text-gray-600 mb-4">
                  <span className="font-medium">Teacher:</span>{' '}
                  {course.teacher.userId?.firstName} {course.teacher.userId?.lastName}
                </div>
              )}

              {user.role === 'ADMIN' && (
                <div className="flex space-x-2 pt-4 border-t">
                  <button className="flex-1 btn-secondary text-sm">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(course._id)}
                    className="flex-1 bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Courses;