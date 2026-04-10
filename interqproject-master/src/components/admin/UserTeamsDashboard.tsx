import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Users, Shield, Search, Filter } from 'lucide-react'
import UsersManagement from './UsersManagement'
import TeamsManagement from './TeamsManagement'
import { UserTeamsProvider } from '@/contexts/UserTeamsContext'

const UserTeamsDashboard: React.FC = () => {
  return (
    <UserTeamsProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Users & Teams</h1>
            <p className="text-muted-foreground mt-2">
              Manage your recruitment platform users and hiring teams with full CRUD functionality
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Shield className="h-4 w-4 mr-2" />
              Permissions
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Bulk Import
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">127</div>
              <CardDescription className="text-xs text-muted-foreground">
                +12 this week
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Teams</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18</div>
              <CardDescription className="text-xs text-muted-foreground">
                245 members
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Users</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <CardDescription className="text-xs text-muted-foreground">
                Awaiting approval
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Departments</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7</div>
              <CardDescription className="text-xs text-muted-foreground">
                Active departments
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Search users, teams, emails..."
            />
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Tab Navigation */}
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="users" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Users className="h-4 w-4 shrink-0" />
              Users
              <div className="ml-1 text-xs bg-muted rounded-full px-1.5 py-0.5 font-mono text-muted-foreground">127</div>
            </TabsTrigger>
            <TabsTrigger value="teams" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Users className="h-4 w-4 shrink-0" />
              Teams
              <div className="ml-1 text-xs bg-muted rounded-full px-1.5 py-0.5 font-mono text-muted-foreground">18</div>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="users" className="mt-4">
            <UsersManagement />
          </TabsContent>
          
          <TabsContent value="teams" className="mt-4">
            <TeamsManagement />
          </TabsContent>
        </Tabs>
      </div>
    </UserTeamsProvider>
  )
}

export default UserTeamsDashboard

