import { useAuth } from '../hooks/useAuth';
import { useEffect, useState } from 'react';
import axios from '../api/axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    students: 0,
    courses: 0,
    teachers: 0,
    attendance: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const responses = await Promise.allSettled([
        user.role !== 'STUDENT' ? axios.get('/students') : Promise.resolve({ data: { count: 0 } }),
        axios.get('/courses'),
        user.role === 'ADMIN' ? axios.get('/teachers') : Promise.resolve({ data: { count: 0 } }),
      ]);

      setStats({
        students: responses[0].status === 'fulfilled' ? responses[0].value.data.count : 0,
        courses: responses[1].status === 'fulfilled' ? responses[1].value.data.count : 0,
        teachers: responses[2].status === 'fulfilled' ? responses[2].value.data.count : 0,
        attendance: 0,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, color, icon }) => (
    <div className={`card ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-gray-600 mt-2">Here's what's happening in your school today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {user.role !== 'STUDENT' && (
          <StatCard
            title="Total Students"
            value={stats.students}
            color="bg-blue-50"
            icon="👨‍🎓"
          />
        )}
        
        <StatCard
          title="Total Courses"
          value={stats.courses}
          color="bg-green-50"
          icon="📚"
        />
        
        {user.role === 'ADMIN' && (
          <StatCard
            title="Total Teachers"
            value={stats.teachers}
            color="bg-purple-50"
            icon="👩‍🏫"
          />
        )}
        
        <StatCard
          title="Attendance Rate"
          value="92%"
          color="bg-yellow-50"
          icon="✓"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-primary-600 font-bold">JD</span>
              </div>
              <div className="flex-1">
                <p className="font-medium">New student enrolled</p>
                <p className="text-sm text-gray-600">John Doe joined CS101</p>
              </div>
              <span className="text-xs text-gray-500">2h ago</span>
            </div>

            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-green-600 font-bold">✓</span>
              </div>
              <div className="flex-1">
                <p className="font-medium">Attendance marked</p>
                <p className="text-sm text-gray-600">CS101 - 45 students present</p>
              </div>
              <span className="text-xs text-gray-500">4h ago</span>
            </div>

            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-purple-600 font-bold">📝</span>
              </div>
              <div className="flex-1">
                <p className="font-medium">New assignment posted</p>
                <p className="text-sm text-gray-600">Data Structures - Due in 3 days</p>
              </div>
              <span className="text-xs text-gray-500">1d ago</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-primary-50 hover:bg-primary-100 rounded-lg text-center transition-colors">
              <div className="text-2xl mb-2">➕</div>
              <div className="font-medium text-primary-700">Add Student</div>
            </button>

            <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-center transition-colors">
              <div className="text-2xl mb-2">✓</div>
              <div className="font-medium text-green-700">Mark Attendance</div>
            </button>

            <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-center transition-colors">
              <div className="text-2xl mb-2">📚</div>
              <div className="font-medium text-purple-700">View Courses</div>
            </button>

            <button className="p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg text-center transition-colors">
              <div className="text-2xl mb-2">📊</div>
              <div className="font-medium text-yellow-700">Generate Report</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;