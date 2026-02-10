import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Settings, Bell, Shield, Eye, Palette, User, Lock, LogOut } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [profilePublic, setProfilePublic] = useState(true);
  const [showEmail, setShowEmail] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleSave = () => {
    toast({ title: 'Settings saved', description: 'Your preferences have been updated.' });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Settings className="w-6 h-6" /> Settings
        </h1>
        <p className="text-muted-foreground text-sm">Manage your account preferences</p>
      </div>

      <Tabs defaultValue="notifications">
        <TabsList className="mb-4">
          <TabsTrigger value="notifications"><Bell className="w-4 h-4 mr-1" /> Notifications</TabsTrigger>
          <TabsTrigger value="privacy"><Shield className="w-4 h-4 mr-1" /> Privacy</TabsTrigger>
          <TabsTrigger value="appearance"><Palette className="w-4 h-4 mr-1" /> Appearance</TabsTrigger>
          <TabsTrigger value="account"><User className="w-4 h-4 mr-1" /> Account</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold">Notification Preferences</h3>
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notif">Email Notifications</Label>
                <Switch id="email-notif" checked={emailNotifs} onCheckedChange={setEmailNotifs} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="push-notif">Push Notifications</Label>
                <Switch id="push-notif" checked={pushNotifs} onCheckedChange={setPushNotifs} />
              </div>
              <Separator />
              <h4 className="font-medium text-sm">Notify me about:</h4>
              {['New applications', 'Invitation responses', 'Chat messages', 'Forum replies', 'Post updates'].map(item => (
                <div key={item} className="flex items-center justify-between">
                  <Label className="text-sm text-muted-foreground">{item}</Label>
                  <Switch defaultChecked />
                </div>
              ))}
              <Button onClick={handleSave} className="mt-2">Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold">Privacy Settings</h3>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="public-profile">Public Profile</Label>
                  <p className="text-xs text-muted-foreground">Others can view your profile</p>
                </div>
                <Switch id="public-profile" checked={profilePublic} onCheckedChange={setProfilePublic} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="show-email">Show Email Address</Label>
                  <p className="text-xs text-muted-foreground">Display email on your profile</p>
                </div>
                <Switch id="show-email" checked={showEmail} onCheckedChange={setShowEmail} />
              </div>
              <Button onClick={handleSave} className="mt-2">Save Privacy Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold">Appearance</h3>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                  <p className="text-xs text-muted-foreground">Toggle dark theme</p>
                </div>
                <Switch id="dark-mode" checked={darkMode} onCheckedChange={setDarkMode} />
              </div>
              <Button onClick={handleSave} className="mt-2">Save Appearance</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold">Account</h3>
              <div>
                <Label className="text-sm text-muted-foreground">Email</Label>
                <p className="font-medium text-sm">{user?.email}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Role</Label>
                <p className="font-medium text-sm capitalize">{user?.role}</p>
              </div>
              <Separator />
              <Button variant="outline" onClick={() => navigate('/profile')}><User className="w-4 h-4 mr-2" /> Edit Profile</Button>
              <Separator />
              <div>
                <h4 className="font-medium text-sm text-destructive mb-2">Danger Zone</h4>
                <Button variant="destructive" onClick={logout}><LogOut className="w-4 h-4 mr-2" /> Log Out</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
