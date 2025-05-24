
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Settings,
  User,
  CreditCard,
  Bell,
  Lock,
  FileText,
  CirclePlay,
  Image as ImageIcon,
  LogOut,
  Save,
  Trash,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account");
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSaveChanges = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Settings saved successfully");
    }, 1000);
  };
  
  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Manage your account preferences and application settings</p>
          </div>
          <Button
            onClick={handleSaveChanges}
            disabled={isLoading}
          >
            {isLoading ? (
              'Saving...'
            ) : (
              <>
                <Save size={16} className="mr-2" /> Save Changes
              </>
            )}
          </Button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          <Card className="md:w-64 h-fit">
            <CardContent className="p-4">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
                orientation="vertical"
              >
                <TabsList className="flex flex-col items-start h-auto bg-transparent p-0 space-y-1">
                  <TabsTrigger
                    value="account"
                    className="w-full justify-start px-2 py-1.5 h-9 font-normal data-[state=active]:font-medium"
                  >
                    <User size={16} className="mr-2" /> Account
                  </TabsTrigger>
                  <TabsTrigger
                    value="billing"
                    className="w-full justify-start px-2 py-1.5 h-9 font-normal data-[state=active]:font-medium"
                  >
                    <CreditCard size={16} className="mr-2" /> Billing
                  </TabsTrigger>
                  <TabsTrigger
                    value="notifications"
                    className="w-full justify-start px-2 py-1.5 h-9 font-normal data-[state=active]:font-medium"
                  >
                    <Bell size={16} className="mr-2" /> Notifications
                  </TabsTrigger>
                  <TabsTrigger
                    value="security"
                    className="w-full justify-start px-2 py-1.5 h-9 font-normal data-[state=active]:font-medium"
                  >
                    <Lock size={16} className="mr-2" /> Security
                  </TabsTrigger>
                  <TabsTrigger
                    value="appearance"
                    className="w-full justify-start px-2 py-1.5 h-9 font-normal data-[state=active]:font-medium"
                  >
                    <Settings size={16} className="mr-2" /> Appearance
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>
          
          <div className="flex-1">
            <Tabs value={activeTab} className="w-full">
              <TabsContent value="account" className="mt-0 ring-0 focus:outline-none">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>
                      Manage your account information and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src="" />
                        <AvatarFallback className="text-lg">U</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <h4 className="font-medium">Profile Picture</h4>
                        <p className="text-sm text-muted-foreground">Upload a new avatar</p>
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" variant="outline">Upload</Button>
                          <Button size="sm" variant="outline">Remove</Button>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" defaultValue="Fantasy Writer" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input id="username" defaultValue="fantasy_writer" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" defaultValue="writer@example.com" type="email" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="language">Display Language</Label>
                        <select
                          id="language"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="en">English</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                          <option value="de">German</option>
                          <option value="ja">Japanese</option>
                        </select>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <textarea
                        id="bio"
                        className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Tell us about yourself..."
                        defaultValue="Fantasy writer and worldbuilder with a passion for epic stories and detailed magical systems."
                      />
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-medium mb-3">Danger Zone</h3>
                      <Button variant="destructive">
                        <Trash size={16} className="mr-2" /> Delete Account
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="billing" className="mt-0 ring-0 focus:outline-none">
                <Card>
                  <CardHeader>
                    <CardTitle>Billing Settings</CardTitle>
                    <CardDescription>
                      Manage your subscription and payment methods
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-3">Current Plan</h3>
                      <div className="bg-muted p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-semibold">Basic Plan</h4>
                            <p className="text-sm text-muted-foreground">500 tokens monthly</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">$9.99/month</p>
                            <p className="text-xs text-muted-foreground">Renews on May 15, 2025</p>
                          </div>
                        </div>
                        <Separator className="my-4" />
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Change Plan</Button>
                          <Button variant="outline" size="sm">Cancel Subscription</Button>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-medium">Payment Methods</h3>
                        <Button size="sm" variant="outline">Add New</Button>
                      </div>
                      <div className="border rounded-lg">
                        <div className="p-4 flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="h-10 w-16 bg-muted rounded flex items-center justify-center mr-3">
                              <CreditCard size={20} />
                            </div>
                            <div>
                              <p className="font-medium">•••• •••• •••• 4242</p>
                              <p className="text-xs text-muted-foreground">Expires 04/2026</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="ghost">Edit</Button>
                            <Button size="sm" variant="ghost">Remove</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-medium">Billing History</h3>
                        <Button size="sm" variant="outline">Download All</Button>
                      </div>
                      <div className="border rounded-lg divide-y">
                        <div className="p-4 flex justify-between items-center">
                          <div>
                            <p className="font-medium">April 2025</p>
                            <p className="text-xs text-muted-foreground">Basic Plan - Monthly</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">$9.99</p>
                            <Button size="sm" variant="ghost">Receipt</Button>
                          </div>
                        </div>
                        <div className="p-4 flex justify-between items-center">
                          <div>
                            <p className="font-medium">March 2025</p>
                            <p className="text-xs text-muted-foreground">Basic Plan - Monthly</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">$9.99</p>
                            <Button size="sm" variant="ghost">Receipt</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="notifications" className="mt-0 ring-0 focus:outline-none">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                    <CardDescription>
                      Choose how and when you want to be notified
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-3">Email Notifications</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="email-updates">Product Updates</Label>
                            <p className="text-xs text-muted-foreground">Receive updates about new features</p>
                          </div>
                          <Switch id="email-updates" defaultChecked />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="email-token">Token Usage</Label>
                            <p className="text-xs text-muted-foreground">Get notified when your tokens are running low</p>
                          </div>
                          <Switch id="email-token" defaultChecked />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="email-generation">Content Generation</Label>
                            <p className="text-xs text-muted-foreground">Get notified when your content is generated</p>
                          </div>
                          <Switch id="email-generation" />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="email-marketing">Marketing</Label>
                            <p className="text-xs text-muted-foreground">Receive marketing emails and promotions</p>
                          </div>
                          <Switch id="email-marketing" />
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-medium mb-3">In-App Notifications</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="app-token">Token Usage</Label>
                            <p className="text-xs text-muted-foreground">Get notified when your tokens are running low</p>
                          </div>
                          <Switch id="app-token" defaultChecked />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="app-generation">Content Generation</Label>
                            <p className="text-xs text-muted-foreground">Get notified when your content is generated</p>
                          </div>
                          <Switch id="app-generation" defaultChecked />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="app-tips">Writing Tips</Label>
                            <p className="text-xs text-muted-foreground">Receive occasional writing tips and suggestions</p>
                          </div>
                          <Switch id="app-tips" defaultChecked />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="security" className="mt-0 ring-0 focus:outline-none">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>
                      Manage your account security and privacy
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-3">Change Password</h3>
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="current-password">Current Password</Label>
                          <Input id="current-password" type="password" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-password">New Password</Label>
                          <Input id="new-password" type="password" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Confirm New Password</Label>
                          <Input id="confirm-password" type="password" />
                        </div>
                        <Button>Update Password</Button>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-medium mb-3">Two-Factor Authentication</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Add an extra layer of security to your account by enabling two-factor authentication.
                      </p>
                      <Button variant="outline">Enable 2FA</Button>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-medium mb-3">Active Sessions</h3>
                      <div className="border rounded-lg divide-y">
                        <div className="p-4">
                          <div className="flex justify-between">
                            <div>
                              <p className="font-medium">Current Session</p>
                              <p className="text-xs text-muted-foreground">Chrome on macOS • IP: 192.168.1.1</p>
                            </div>
                            <div className="flex items-center text-xs text-emerald-500 font-medium">
                              <Check size={14} className="mr-1" /> Active Now
                            </div>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="flex justify-between">
                            <div>
                              <p className="font-medium">Firefox on Windows</p>
                              <p className="text-xs text-muted-foreground">Last active: Yesterday • IP: 192.168.1.2</p>
                            </div>
                            <Button size="sm" variant="ghost">Sign Out</Button>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" className="mt-3">Sign Out All Other Sessions</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="appearance" className="mt-0 ring-0 focus:outline-none">
                <Card>
                  <CardHeader>
                    <CardTitle>Appearance Settings</CardTitle>
                    <CardDescription>
                      Customize the look and feel of the application
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-3">Theme</h3>
                      <RadioGroup defaultValue="system" className="flex flex-col sm:flex-row gap-4">
                        <div className="border rounded-lg p-4 flex flex-1 items-center space-x-2">
                          <RadioGroupItem value="light" id="theme-light" />
                          <Label htmlFor="theme-light" className="cursor-pointer flex flex-col">
                            Light Theme
                            <span className="text-xs text-muted-foreground">Use the light color scheme</span>
                          </Label>
                        </div>
                        <div className="border rounded-lg p-4 flex flex-1 items-center space-x-2">
                          <RadioGroupItem value="dark" id="theme-dark" />
                          <Label htmlFor="theme-dark" className="cursor-pointer flex flex-col">
                            Dark Theme
                            <span className="text-xs text-muted-foreground">Use the dark color scheme</span>
                          </Label>
                        </div>
                        <div className="border rounded-lg p-4 flex flex-1 items-center space-x-2">
                          <RadioGroupItem value="system" id="theme-system" />
                          <Label htmlFor="theme-system" className="cursor-pointer flex flex-col">
                            System Theme
                            <span className="text-xs text-muted-foreground">Follow your system preference</span>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-medium mb-3">Editor Preferences</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="auto-save">Auto Save</Label>
                            <p className="text-xs text-muted-foreground">Automatically save your work every few minutes</p>
                          </div>
                          <Switch id="auto-save" defaultChecked />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="spell-check">Spell Check</Label>
                            <p className="text-xs text-muted-foreground">Highlight spelling and grammar errors</p>
                          </div>
                          <Switch id="spell-check" defaultChecked />
                        </div>
                        <Separator />
                        <div>
                          <div className="space-y-0.5 mb-2">
                            <Label htmlFor="font-size">Font Size</Label>
                            <p className="text-xs text-muted-foreground">Adjust the font size in the editor</p>
                          </div>
                          <select
                            id="font-size"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="small">Small</option>
                            <option value="medium" selected>Medium</option>
                            <option value="large">Large</option>
                            <option value="xl">Extra Large</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-medium mb-3">Dashboard Layout</h3>
                      <RadioGroup defaultValue="default" className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="default" id="layout-default" />
                          <Label htmlFor="layout-default">Default Layout</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="compact" id="layout-compact" />
                          <Label htmlFor="layout-compact">Compact View</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="expanded" id="layout-expanded" />
                          <Label htmlFor="layout-expanded">Expanded View</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
