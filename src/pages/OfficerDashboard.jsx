export function OfficerDashboard({ setPage }) {
  return (
    <div className="dashboard">

      <div className="sidebar">
        <h2>Officer Panel</h2>
        <div className="menu-item">Assigned Tasks</div>
        <div className="menu-item">Updates</div>
        <div className="menu-item" onClick={() => setPage("login")}>
          Logout
        </div>
      </div>

      <div className="main">
        <h1>Assigned Complaints</h1>

        <table>
          <thead>
            <tr>
              <th>Issue</th>
              <th>Status</th>
              <th>Location</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Pothole near school</td>
              <td>Pending</td>
              <td>Ward 5</td>
            </tr>

            <tr>
              <td>Drain blockage</td>
              <td>In Progress</td>
              <td>Ward 2</td>
            </tr>
          </tbody>
        </table>

      </div>
    </div>
  );
}