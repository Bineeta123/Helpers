// import { useAuth } from '../context/AuthContext'

import AdminApp from '../admin/AdminApp'

export default function AdminDashboard() {
  // const { user, logout } = useAuth()
  // const navigate = useNavigate()

  // const handleLogout = () => {
  //   logout()
  //   navigate('/signin')
  // }

  // return (
  //   <div className="dashboard-page">
  //     <div className="dashboard-header">
  //       <div>
  //         <p className="dashboard-subtitle">Admin dashboard</p>
  //         <h1>Welcome, {user?.email}</h1>
  //       </div>
  //       <button className="secondary-button" onClick={handleLogout}>
  //         Log out
  //       </button>
  //     </div>

  //     <section className="dashboard-section">
  //       <h2>Quick admin actions</h2>
  //       <ul>
  //         <li>Review user submissions</li>
  //         <li>Manage courses</li>
  //         <li>Approve schedules</li>
  //       </ul>
  //     </section>

  //     <section className="dashboard-section">
  //       <h2>Status</h2>
  //       <p></p>
  //     </section>
  //   </div>
  // )

return <AdminApp />
}

