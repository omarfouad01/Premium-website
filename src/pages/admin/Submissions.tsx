import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, Calendar, CheckCircle2, Users, Building, MapPin, Tag, ToggleLeft, ToggleRight } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  title: string | null;
  country: string | null;
  country_code: string | null;
  inquiry_type: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface VisitorRegistration {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  job_title: string | null;
  country: string | null;
  interests: string[] | null;
  visit_date: string | null;
  how_heard: string | null;
  is_read: boolean;
  created_at: string;
}

const AdminSubmissions = () => {
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);
  const [visitorRegistrations, setVisitorRegistrations] = useState<VisitorRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [visitorRegEnabled, setVisitorRegEnabled] = useState(true);
  const [closedMessageEn, setClosedMessageEn] = useState("");
  const [closedMessageAr, setClosedMessageAr] = useState("");
  const [savingSettings, setSavingSettings] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    
    // Load visitor registration settings
    const settingsRes = await supabase
      .from("site_settings_premium_20251225")
      .select("visitor_registration_enabled, visitor_registration_closed_message, visitor_registration_closed_message_ar")
      .limit(1)
      .single();
    
    if (settingsRes.data) {
      setVisitorRegEnabled(settingsRes.data.visitor_registration_enabled ?? true);
      setClosedMessageEn(settingsRes.data.visitor_registration_closed_message || "");
      setClosedMessageAr(settingsRes.data.visitor_registration_closed_message_ar || "");
    }
    
    const [contactRes, visitorRes] = await Promise.all([
      supabase
        .from("contact_submissions_premium_20251225")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("visitor_registrations_premium_20251225")
        .select("*")
        .order("created_at", { ascending: false }),
    ]);

    if (contactRes.error) {
      toast({
        title: "Error",
        description: "Failed to load contact submissions",
        variant: "destructive",
      });
    } else {
      setContactSubmissions(contactRes.data || []);
    }

    if (visitorRes.error) {
      toast({
        title: "Error",
        description: "Failed to load visitor registrations",
        variant: "destructive",
      });
    } else {
      setVisitorRegistrations(visitorRes.data || []);
    }

    setLoading(false);
  };

  const markContactAsRead = async (id: string) => {
    const { error } = await supabase
      .from("contact_submissions_premium_20251225")
      .update({ is_read: true })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update submission",
        variant: "destructive",
      });
    } else {
      loadData();
    }
  };

  const saveVisitorRegistrationSettings = async () => {
    setSavingSettings(true);
    
    const { error } = await supabase
      .from("site_settings_premium_20251225")
      .update({
        visitor_registration_enabled: visitorRegEnabled,
        visitor_registration_closed_message: closedMessageEn,
        visitor_registration_closed_message_ar: closedMessageAr,
      })
      .eq("id", (await supabase.from("site_settings_premium_20251225").select("id").limit(1).single()).data?.id);
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Visitor registration settings updated",
      });
    }
    
    setSavingSettings(false);
  };

  const markVisitorAsRead = async (id: string) => {
    const { error } = await supabase
      .from("visitor_registrations_premium_20251225")
      .update({ is_read: true })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update registration",
        variant: "destructive",
      });
    } else {
      loadData();
    }
  };

  const formatDate = (dateString: string) => {
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

  const unreadContact = contactSubmissions.filter((s) => !s.is_read).length;
  const unreadVisitor = visitorRegistrations.filter((v) => !v.is_read).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Submissions & Registrations</h1>
          <p className="text-muted-foreground mt-2">
            Manage contact submissions and visitor registrations
          </p>
        </div>

        <Tabs defaultValue="contact" className="space-y-4">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="contact" className="relative">
              Contact Forms
              {unreadContact > 0 && (
                <Badge className="ml-2 bg-red-500">{unreadContact}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="visitors" className="relative">
              Visitor Registrations
              {unreadVisitor > 0 && (
                <Badge className="ml-2 bg-red-500">{unreadVisitor}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Contact Submissions */}
          <TabsContent value="contact" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Contact Submissions ({contactSubmissions.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {contactSubmissions.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No contact submissions yet
                  </p>
                ) : (
                  <div className="space-y-4">
                    {contactSubmissions.map((submission) => (
                      <Card
                        key={submission.id}
                        className={!submission.is_read ? "border-primary" : ""}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="font-semibold text-lg">{submission.name}</h3>
                              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                <a
                                  href={`mailto:${submission.email}`}
                                  className="flex items-center gap-1 hover:text-primary"
                                >
                                  <Mail className="h-4 w-4" />
                                  {submission.email}
                                </a>
                                {submission.phone && (
                                  <a
                                    href={`tel:${submission.phone}`}
                                    className="flex items-center gap-1 hover:text-primary"
                                  >
                                    <Phone className="h-4 w-4" />
                                    {submission.phone}
                                  </a>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {!submission.is_read && (
                                <Badge variant="destructive">New</Badge>
                              )}
                              <Badge variant="outline">{submission.inquiry_type}</Badge>
                            </div>
                          </div>

                          {submission.company && (
                            <div className="flex items-center gap-2 mb-2 text-sm">
                              <Building className="h-4 w-4 text-muted-foreground" />
                              <span>{submission.company}</span>
                            </div>
                          )}

                          {submission.title && (
                            <div className="flex items-center gap-2 mb-2 text-sm">
                              <Tag className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">Title:</span>
                              <span>{submission.title}</span>
                            </div>
                          )}

                          {submission.country && (
                            <div className="flex items-center gap-2 mb-2 text-sm">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">Country:</span>
                              <span>{submission.country}</span>
                              {submission.country_code && (
                                <span className="text-muted-foreground">({submission.country_code})</span>
                              )}
                            </div>
                          )}

                          <div className="bg-muted p-4 rounded-lg mb-4">
                            <p className="text-sm whitespace-pre-wrap">{submission.message}</p>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              {formatDate(submission.created_at)}
                            </div>
                            {!submission.is_read && (
                              <Button
                                size="sm"
                                onClick={() => markContactAsRead(submission.id)}
                              >
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Mark as Read
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Visitor Registrations */}
          <TabsContent value="visitors" className="space-y-4">
            {/* Visitor Registration Control */}
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {visitorRegEnabled ? (
                      <ToggleRight className="h-5 w-5 text-green-600" />
                    ) : (
                      <ToggleLeft className="h-5 w-5 text-red-600" />
                    )}
                    Visitor Registration Control
                  </div>
                  <Button 
                    onClick={saveVisitorRegistrationSettings}
                    disabled={savingSettings}
                    size="sm"
                  >
                    {savingSettings ? "Saving..." : "Save Settings"}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                  <div className="space-y-1">
                    <Label className="text-base font-semibold">
                      Enable Visitor Registration
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {visitorRegEnabled 
                        ? "Visitors can submit registration requests" 
                        : "Visitor registration is closed - form will be hidden"}
                    </p>
                  </div>
                  <Switch
                    checked={visitorRegEnabled}
                    onCheckedChange={setVisitorRegEnabled}
                  />
                </div>
                
                {!visitorRegEnabled && (
                  <div className="space-y-4 p-4 bg-white rounded-lg">
                    <div className="space-y-2">
                      <Label htmlFor="closed-message-en">Closed Message (English)</Label>
                      <Textarea
                        id="closed-message-en"
                        value={closedMessageEn}
                        onChange={(e) => setClosedMessageEn(e.target.value)}
                        placeholder="Message to show when registration is closed"
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="closed-message-ar">Closed Message (Arabic)</Label>
                      <Textarea
                        id="closed-message-ar"
                        value={closedMessageAr}
                        onChange={(e) => setClosedMessageAr(e.target.value)}
                        placeholder="الرسالة عند إغلاق التسجيل"
                        rows={3}
                        dir="rtl"
                        className="text-right"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Visitor Registrations ({visitorRegistrations.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {visitorRegistrations.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No visitor registrations yet
                  </p>
                ) : (
                  <div className="space-y-4">
                    {visitorRegistrations.map((visitor) => (
                      <Card
                        key={visitor.id}
                        className={!visitor.is_read ? "border-primary" : ""}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="font-semibold text-lg">{visitor.name}</h3>
                              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                <a
                                  href={`mailto:${visitor.email}`}
                                  className="flex items-center gap-1 hover:text-primary"
                                >
                                  <Mail className="h-4 w-4" />
                                  {visitor.email}
                                </a>
                                {visitor.phone && (
                                  <a
                                    href={`tel:${visitor.phone}`}
                                    className="flex items-center gap-1 hover:text-primary"
                                  >
                                    <Phone className="h-4 w-4" />
                                    {visitor.phone}
                                  </a>
                                )}
                              </div>
                            </div>
                            {!visitor.is_read && (
                              <Badge variant="destructive">New</Badge>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                            {visitor.company && (
                              <div className="flex items-center gap-2 text-sm">
                                <Building className="h-4 w-4 text-muted-foreground" />
                                <span>{visitor.company}</span>
                              </div>
                            )}
                            {visitor.job_title && (
                              <div className="flex items-center gap-2 text-sm">
                                <Tag className="h-4 w-4 text-muted-foreground" />
                                <span>{visitor.job_title}</span>
                              </div>
                            )}
                            {visitor.country && (
                              <div className="flex items-center gap-2 text-sm">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span>{visitor.country}</span>
                              </div>
                            )}
                            {visitor.visit_date && (
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>Preferred: {visitor.visit_date}</span>
                              </div>
                            )}
                          </div>

                          {visitor.interests && visitor.interests.length > 0 && (
                            <div className="mb-4">
                              <p className="text-sm font-medium mb-2">Interests:</p>
                              <div className="flex flex-wrap gap-2">
                                {visitor.interests.map((interest, idx) => (
                                  <Badge key={idx} variant="secondary">
                                    {interest}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {visitor.how_heard && (
                            <div className="bg-muted p-3 rounded-lg mb-4">
                              <p className="text-sm">
                                <span className="font-medium">How they heard:</span>{" "}
                                {visitor.how_heard}
                              </p>
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              {formatDate(visitor.created_at)}
                            </div>
                            {!visitor.is_read && (
                              <Button
                                size="sm"
                                onClick={() => markVisitorAsRead(visitor.id)}
                              >
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Mark as Read
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminSubmissions;
