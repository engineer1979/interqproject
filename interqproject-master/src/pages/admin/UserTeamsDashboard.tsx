import React from 'react';

const UserTeamsDashboard = () => {
  return (
    <div className="container mx-auto py-12 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Users & Teams Dashboard
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Manage your recruitment platform users and organizational teams with real-time sync
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-100">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            👥 Users Management
          </h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-white rounded-xl shadow-sm border">
              <div className="text-3xl font-bold text-blue-600">50+</div>
              <p className="text-sm text-muted-foreground">Total Users</p>
            </div>
            <div className="p-4 bg-white rounded-xl shadow-sm border">
              <div className="text-3xl font-bold text-green-600">42</div>
              <p className="text-sm text-muted-foreground">Active</p>
            </div>
          </div>
          <div className="space-y-2">
            <button className="w-full p-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all duration-200 flex items-center gap-2">
              ➕ Add New User
            </button>
            <button className="w-full p-4 border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium rounded-xl transition-all duration-200 flex items-center gap-2">
              🔄 Import CSV
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-2xl border border-emerald-100">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            👥 Teams Management
          </h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-white rounded-xl shadow-sm border">
              <div className="text-3xl font-bold text-emerald-600">12</div>
              <p className="text-sm text-muted-foreground">Teams</p>
            </div>
            <div className="p-4 bg-white rounded-xl shadow-sm border">
              <div className="text-3xl font-bold text-orange-600">156</div>
              <p className="text-sm text-muted-foreground">Members</p>
            </div>
          </div>
          <div className="space-y-2">
            <button className="w-full p-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-all duration-200 flex items-center gap-2">
              ➕ Create Team
            </button>
            <button className="w-full p-4 border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium rounded-xl transition-all duration-200 flex items-center gap-2">
              📊 Team Reports
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl p-8 border">
        <h3 className="text-xl font-bold mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <button className="group p-6 bg-white hover:bg-slate-50 border rounded-xl transition-all duration-200 hover:shadow-md hover:-translate-y-1 flex flex-col items-center gap-3 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              👤
            </div>
            <div className="font-medium">Bulk User Invite</div>
            <div className="text-sm text-muted-foreground">Send invites to multiple users</div>
          </button>
          <button className="group p-6 bg-white hover:bg-slate-50 border rounded-xl transition-all duration-200 hover:shadow-md hover:-translate-y-1 flex flex-col items-center gap-3 text-center">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
              👥
            </div>
            <div className="font-medium">Reassign Teams</div>
            <div className="text-sm text-muted-foreground">Move users between teams</div>
          </button>
          <button className="group p-6 bg-white hover:bg-slate-50 border rounded-xl transition-all duration-200 hover:shadow-md hover:-translate-y-1 flex flex-col items-center gap-3 text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center group-hover:bg-orange-200 transition-colors">
              📊
            </div>
            <div className="font-medium">Export Data</div>
            <div className="text-sm text-muted-foreground">Download users & teams CSV</div>
          </button>
          <button className="group p-6 bg-white hover:bg-slate-50 border rounded-xl transition-all duration-200 hover:shadow-md hover:-translate-y-1 flex flex-col items-center gap-3 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
              🔒
            </div>
            <div className="font-medium">Permissions</div>
            <div className="text-sm text-muted-foreground">Manage role permissions</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserTeamsDashboard;

