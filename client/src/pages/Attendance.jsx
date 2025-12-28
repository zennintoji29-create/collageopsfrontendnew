import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useAuth } from '../hooks/useAuth';

const Attendance = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetchAttendance();
    }
  }, [selectedCourse, selectedDate]);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('/courses');
      setCourses(response.data.data);
      if (response.data.data.length > 0) {
        setSelectedCourse(response.data.data[0]._id);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchAttendance = async () => {
    if (!selectedCourse) return;

    setLoading(true);
    try {
      const response = await axios.get(`/attendance/course/${selectedCourse}`, {
        params: {
          startDate: selectedDate,
          endDate: selectedDate,
        },
      });
      setAttendanceRecords(response.data.data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAttendance = async (studentId, status) => {
    try {
      await axios.post('/attendance/mark', {
        courseId: selectedCourse,
        studentId,
        date: selectedDate,
        status,
        notes: '',
      });
      fetchAttendance();
      alert('Attendance marked successfully');
    } catch (error) {
      console.error('Error marking attendance:', error);
      alert('Failed to mark attendance');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PRESENT: 'bg-green-100 text-green-800',
      ABSENT: 'bg-red-100 text-red-800',
      LATE: 'bg-yellow-100 text-yellow-800',
      EXCUSED: 'bg-blue-100 text-blue-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const selectedCourseData = courses.find(c => c._id === selectedCourse);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Attendance Management</h1>
        <p className="text-gray-600 mt-1">Track and manage student attendance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="card">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Course
          </label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="input-field"
          >
            <option value="">Choose a course</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.courseCode} - {course.courseName}
              </option>
            ))}
          </select>
        </div>

        <div className="card">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="input-field"
          />
        </div>
      </div>

      {selectedCourse && selectedCourseData && (
        <div className="card mb-6">
          <h2 className="text-xl font-bold mb-2">{selectedCourseData.courseName}</h2>
          <p className="text-gray-600">
            Total Students: {selectedCourseData.students?.length || 0} | 
            Present: {attendanceRecords.filter(r => r.status === 'PRESENT').length} | 
            Absent: {attendanceRecords.filter(r => r.status === 'ABSENT').length}
          </p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : selectedCourse ? (
        <div className="card">
          <h3 className="text-lg font-bold mb-4">Attendance Records</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  {(user.role === 'ADMIN' || user.role === 'TEACHER') && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attendanceRecords.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                      No attendance records for this date
                    </td>
                  </tr>
                ) : (
                  attendanceRecords.map((record) => (
                    <tr key={record._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {record.student?.userId?.firstName} {record.student?.userId?.lastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.student?.studentId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                          {record.status}
                        </span>
                      </td>
                      {(user.role === 'ADMIN' || user.role === 'TEACHER') && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <select
                            value={record.status}
                            onChange={(e) => handleMarkAttendance(record.student._id, e.target.value)}
                            className="border border-gray-300 rounded px-2 py-1 text-sm"
                          >
                            <option value="PRESENT">Present</option>
                            <option value="ABSENT">Absent</option>
                            <option value="LATE">Late</option>
                            <option value="EXCUSED">Excused</option>
                          </select>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="card text-center py-12 text-gray-500">
          Please select a course to view attendance records
        </div>
      )}
    </div>
  );
};

export default Attendance;