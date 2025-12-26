export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8">
        <h1 className="text-4xl font-bold text-primary mb-4">Dashboard</h1>
        <p className="text-gray-600 text-lg">
          Welcome to the DairyMart secure dashboard! You have successfully logged in.
        </p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="font-bold text-blue-800">Orders</h3>
            <p className="text-sm text-blue-600">Check your status</p>
          </div>
          <div className="p-6 bg-green-50 rounded-lg border border-green-100">
             <h3 className="font-bold text-green-800">Profile</h3>
             <p className="text-sm text-green-600">Update details</p>
          </div>
        </div>
      </div>
    </div>
  );
}