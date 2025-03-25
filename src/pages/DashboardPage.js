import Layout from "../components/Layout";

function DashboardPage() {
  return (
    <Layout
      title="Admin Dashboard"
      leftSection={<div>📋 Sidebar Menu</div>}
      centerSection={<div>📌 Dashboard Stats</div>}
      rightSection={<div>⚙️ User Actions</div>}
      layoutType="dashboard" // 🔹 Ensures THREE COLUMNS
    />
  );
}

export default DashboardPage;
