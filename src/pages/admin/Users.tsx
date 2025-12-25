import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Users as UsersIcon, UserPlus, Trash2, Mail, Calendar, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface User {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  role: string;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const { toast } = useToast();

  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    
    // Get current user to check if they're admin
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    
    if (!currentUser) {
      toast({
        title: "Error",
        description: "You must be logged in to view users",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Use Supabase Admin API to list users
    // Note: This requires the service role key, so we'll use a workaround
    // We'll query the auth.users table through a database function
    
    // For now, we'll use the REST API endpoint
    const { data, error } = await supabase.auth.admin.listUsers();

    if (error) {
      toast({
        title: "Error loading users",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setUsers(data.users.map(u => ({
        id: u.id,
        email: u.email || '',
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at,
        role: u.role || 'authenticated'
      })));
    }
    setLoading(false);
  };

  const handleAddUser = async () => {
    if (!newUser.email || !newUser.password) {
      toast({
        title: "Missing information",
        description: "Please provide email and password",
        variant: "destructive",
      });
      return;
    }

    if (newUser.password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    setAdding(true);

    const { data, error } = await supabase.auth.admin.createUser({
      email: newUser.email,
      password: newUser.password,
      email_confirm: true,
    });

    if (error) {
      toast({
        title: "Error creating user",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: `Admin user ${newUser.email} created successfully`,
      });
      setNewUser({ email: "", password: "" });
      loadUsers();
    }
    setAdding(false);
  };

  const handleDeleteUser = async (userId: string, email: string) => {
    if (!confirm(`Are you sure you want to delete user ${email}?\n\nThis action cannot be undone.`)) {
      return;
    }

    const { error } = await supabase.auth.admin.deleteUser(userId);

    if (error) {
      toast({
        title: "Error deleting user",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: `User ${email} deleted successfully`,
      });
      loadUsers();
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage admin users who can access the dashboard
          </p>
        </div>

        {/* Add New User */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Add New Admin User
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email Address *</Label>
                <Input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="admin@greenlifeexpo.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Password *</Label>
                <Input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="Minimum 6 characters"
                />
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> The new user will be able to access the admin dashboard immediately with the provided credentials.
              </p>
            </div>
            <Button onClick={handleAddUser} disabled={adding}>
              <UserPlus className="h-4 w-4 mr-2" />
              {adding ? "Creating User..." : "Create Admin User"}
            </Button>
          </CardContent>
        </Card>

        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UsersIcon className="h-5 w-5" />
              Admin Users ({users.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {users.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No admin users found
              </p>
            ) : (
              <div className="space-y-4">
                {users.map((user) => (
                  <Card key={user.id} className="border-2">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="bg-primary/10 p-3 rounded-full">
                              <Shield className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{user.email}</h3>
                              <Badge variant="secondary" className="mt-1">
                                {user.role}
                              </Badge>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>Created: {formatDate(user.created_at)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Mail className="h-4 w-4" />
                              <span>Last login: {formatDate(user.last_sign_in_at)}</span>
                            </div>
                          </div>

                          <div className="mt-4 p-3 bg-muted rounded-lg">
                            <p className="text-sm">
                              <strong>User ID:</strong> <code className="text-xs">{user.id}</code>
                            </p>
                          </div>
                        </div>

                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id, user.email)}
                          className="ml-4"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-6">
            <h3 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Best Practices
            </h3>
            <ul className="space-y-2 text-sm text-yellow-700">
              <li>• Use strong passwords with at least 12 characters</li>
              <li>• Include uppercase, lowercase, numbers, and symbols</li>
              <li>• Don't share admin credentials</li>
              <li>• Remove users who no longer need access</li>
              <li>• Regularly review the list of admin users</li>
              <li>• Change passwords if you suspect they've been compromised</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
