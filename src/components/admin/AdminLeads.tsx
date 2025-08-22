import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Filter, Edit, ExternalLink, User, Building, MessageSquare, Calendar, Phone, Mail, MapPin, Globe, Users, Briefcase, Star, Tag, Clock, Plus, Eye, EyeOff, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Lead {
  [key: string]: unknown;
  id: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  company_name?: string;
  industry_sector?: string;
  location?: string;
  company_size?: string;
  website_url?: string;
  role_title?: string;
  social_links?: string;
  pain_points?: string;
  notes?: string;
  score?: number;
  stage?: string;
  source?: string;
  created_at?: string;
  updated_at?: string;
  last_contacted_at?: string;
}

interface OutreachEventInput {
  lead_id: string;
  channel?: string;
  direction?: string;
  version_sent?: string | null;
  campaign_name?: string;
  content?: string | null;
  replied?: boolean;
  booked?: boolean;
  referrals?: number;
  clicks?: number;
}

const phoneE164 = /^\+[1-9]\d{1,14}$/;

interface AdminLeadsProps {
  adminUser: { id: string; email?: string | null; role?: string } | null;
}

export const AdminLeads: React.FC<AdminLeadsProps> = ({ adminUser }) => {
  // Check if user is admin for proper data access
  const isAdmin = useMemo(() => {
    return adminUser && ['super_admin', 'admin'].includes(adminUser.role || '');
  }, [adminUser]);

  // Fetch leads from Supabase with security considerations
  const { data: leads, isLoading, error, refetch } = useQuery({
    queryKey: ['leads', isAdmin],
    queryFn: async () => {
      // Use masked view for non-admin users, full view for admins
      const tableName = isAdmin ? 'leads' : 'leads_masked';
      
      const { data, error } = await supabase
        .from(tableName as 'leads')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching leads:', error);
        throw error;
      }
      
      return data as Lead[];
    },
    // Only fetch if user is authenticated
    enabled: !!adminUser,
  });

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [expandedLeads, setExpandedLeads] = useState<Set<string>>(new Set());

  // Form state
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    company_name: "",
    industry_sector: "",
    location: "",
    company_size: "",
    website_url: "",
    role_title: "",
    social_links: "",
    pain_points: "",
    notes: "",
    score: "",
    stage: "captured",
    source: "sms",
  });

  const canSubmit = useMemo(() => {
    const phoneOk = !form.phone || phoneE164.test(form.phone.trim());
    return phoneOk && (!!form.email || !!form.first_name || !!form.last_name || !!form.phone || !!form.company_name);
  }, [form]);

  // Filter and sort leads
  const filteredLeads = useMemo(() => {
    let filtered = leads ?? [];
    
    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter((lead: Lead) => 
        [lead.first_name, lead.last_name, lead.email, lead.company_name, lead.phone, lead.role_title]
          .some(field => field?.toLowerCase().includes(search))
      );
    }
    
    // Stage filter
    if (stageFilter !== "all") {
      filtered = filtered.filter((lead: Lead) => lead.stage === stageFilter);
    }
    
    // Source filter
    if (sourceFilter !== "all") {
      filtered = filtered.filter((lead: Lead) => lead.source === sourceFilter);
    }
    
    // Industry filter
    if (industryFilter !== "all") {
      filtered = filtered.filter((lead: Lead) => lead.industry_sector === industryFilter);
    }
    
    // Sort
    filtered.sort((a: Lead, b: Lead) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      if (sortBy === 'created_at' || sortBy === 'updated_at' || sortBy === 'last_contacted_at') {
        aVal = new Date(aVal as string || 0).getTime();
        bVal = new Date(bVal as string || 0).getTime();
      }
      
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    
    return filtered;
  }, [leads, searchTerm, stageFilter, sourceFilter, industryFilter, sortBy, sortOrder]);

  const handleSubmit = (e: React.MouseEvent, isEdit = false) => {
    e.preventDefault();
    if (!canSubmit) return;

    // Simulate form submission
    console.log("Form submitted:", { form, isEdit });
    
    setForm({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      company_name: "",
      industry_sector: "",
      location: "",
      company_size: "",
      website_url: "",
      role_title: "",
      social_links: "",
      pain_points: "",
      notes: "",
      score: "",
      stage: "captured",
      source: "sms",
    });
    setShowAddForm(false);
    setEditingLead(null);
  };

  const handleEdit = (lead: Lead) => {
    setForm({
      first_name: lead.first_name as string || "",
      last_name: lead.last_name as string || "",
      email: lead.email as string || "",
      phone: lead.phone as string || "",
      company_name: lead.company_name as string || "",
      industry_sector: lead.industry_sector as string || "",
      location: lead.location as string || "",
      company_size: lead.company_size as string || "",
      website_url: lead.website_url as string || "",
      role_title: lead.role_title as string || "",
      social_links: lead.social_links as string || "",
      pain_points: lead.pain_points as string || "",
      notes: lead.notes as string || "",
      score: lead.score?.toString() || "",
      stage: lead.stage as string || "captured",
      source: lead.source as string || "sms",
    });
    setEditingLead(lead);
    setShowAddForm(true);
  };

  const toggleExpanded = (leadId: string) => {
    const newExpanded = new Set(expandedLeads);
    if (newExpanded.has(leadId)) {
      newExpanded.delete(leadId);
    } else {
      newExpanded.add(leadId);
    }
    setExpandedLeads(newExpanded);
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'captured': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'qualified': return 'bg-green-100 text-green-800 border-green-200';
      case 'contacted': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'meeting_booked': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'disqualified': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'website': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'sms': return 'bg-green-100 text-green-800 border-green-200';
      case 'email': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'call': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleCloseModal = () => {
    setShowAddForm(false);
    setEditingLead(null);
    setForm({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      company_name: "",
      industry_sector: "",
      location: "",
      company_size: "",
      website_url: "",
      role_title: "",
      social_links: "",
      pain_points: "",
      notes: "",
      score: "",
      stage: "captured",
      source: "sms",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="flex flex-row justify-between">
          <div>
            <CardHeader className="pb-2">
              <CardTitle>Leads CRM</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Manage your leads, track outreach, and convert prospects into customers.
              </p>
            </CardContent>
          </div>
          <div className="flex justify-end items-center mr-6">
            <Button onClick={() => setShowAddForm(true)} className="bg-primary hover:bg-primary/90">
              <Plus className="w-5 h-5 mr-2" />
                Add New Lead
            </Button>
          </div>  
        </div>
      </Card>


      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading leads...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card>
          <CardContent className="p-6">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <p className="text-destructive">Error loading leads: {(error as Error).message}</p>
              <Button 
                onClick={() => refetch()} 
                variant="outline"
                className="mt-2"
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content - Only show if not loading */}
      {!isLoading && (
        <>
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Total Leads</p>
                    <p className="text-2xl font-bold">{leads?.length || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-500/10 rounded-lg">
                    <Star className="h-8 w-8 text-green-500" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Qualified</p>
                    <p className="text-2xl font-bold">
                      {leads?.filter((l: Lead) => l.stage === 'qualified').length || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-500/10 rounded-lg">
                    <Calendar className="h-8 w-8 text-purple-500" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Meetings</p>
                    <p className="text-2xl font-bold">
                      {leads?.filter((l: Lead) => l.stage === 'meeting_booked').length || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-500/10 rounded-lg">
                    <MessageSquare className="h-8 w-8 text-yellow-500" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Contacted</p>
                    <p className="text-2xl font-bold">
                      {leads?.filter((l: Lead) => l.stage === 'contacted').length || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-[300px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      placeholder="Search leads by name, email, company..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={stageFilter} onValueChange={setStageFilter}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="All Stages" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stages</SelectItem>
                    <SelectItem value="captured">Captured</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="meeting_booked">Meeting Booked</SelectItem>
                    <SelectItem value="disqualified">Disqualified</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sourceFilter} onValueChange={setSourceFilter}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="All Sources" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="call">Call</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
                  const [field, order] = value.split('-');
                  setSortBy(field);
                  setSortOrder(order as "asc" | "desc");
                }}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="created_at-desc">Newest First</SelectItem>
                    <SelectItem value="created_at-asc">Oldest First</SelectItem>
                    <SelectItem value="updated_at-desc">Recently Updated</SelectItem>
                    <SelectItem value="score-desc">Highest Score</SelectItem>
                    <SelectItem value="company_name-asc">Company A-Z</SelectItem>
                    <SelectItem value="first_name-asc">Name A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Leads List */}
          <Card>
            <CardHeader>
              <CardTitle>Leads ({filteredLeads.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredLeads.length === 0 ? (
                <div className="text-center py-16">
                  <Users className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No leads found</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    {searchTerm || stageFilter !== "all" || sourceFilter !== "all" || industryFilter !== "all" 
                      ? "Try adjusting your filters or search terms to find more leads."
                      : "Get started by adding your first lead to begin tracking prospects."}
                  </p>
                  <Button 
                    onClick={() => setShowAddForm(true)} 
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Your First Lead
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredLeads.map((lead: Lead) => {
                    const fullName = `${lead.first_name || ''} ${lead.last_name || ''}`.trim();
                    const displayName = fullName || lead.email || lead.phone || lead.company_name || "Unnamed Lead";
                    const isExpanded = expandedLeads.has(lead.id);
                    
                    return (
                      <Card key={lead.id} className="hover:bg-muted/50 transition-colors">
                        <CardContent className="p-6">
                          {/* Header Row */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-muted rounded-lg">
                                  <User className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-semibold">{displayName}</h3>
                                {lead.role_title && (
                                  <Badge variant="outline" className="text-xs">
                                    <Briefcase className="w-3 h-3 mr-1" />
                                    {lead.role_title as string}
                                  </Badge>
                                )}
                              </div>
                              
                              <div className="flex flex-wrap gap-2 mb-4">
                                <Badge className={`${getStageColor(lead.stage as string || 'captured')} border font-medium text-sm px-3 py-1`}>
                                  <Tag className="w-3 h-3 mr-1" />
                                  {(lead.stage as string || 'captured').replace('_', ' ')}
                                </Badge>
                                <Badge className={`${getSourceColor(lead.source as string || 'unknown')} border font-medium text-sm px-3 py-1`}>
                                  {lead.source || 'unknown'}
                                </Badge>
                                {lead.score && (
                                  <Badge variant="outline" className="text-sm px-3 py-1">
                                    <Star className="w-3 h-3 mr-1 text-yellow-500" />
                                    {lead.score}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleExpanded(lead.id)}
                              >
                                {isExpanded ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                                {isExpanded ? 'Collapse' : 'Details'}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(lead)}
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </Button>
                            </div>
                          </div>

                          {/* Contact Information Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                            {lead.email && (
                              <div className="flex items-center gap-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                                <Mail className="h-5 w-5 text-blue-500" />
                                <a href={`mailto:${lead.email}`} className="text-blue-500 hover:text-blue-400 font-medium truncate">
                                  {lead.email as string}
                                </a>
                              </div>
                            )}
                            {lead.phone && (
                              <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                                <Phone className="h-5 w-5 text-green-500" />
                                <a href={`tel:${lead.phone}`} className="text-green-500 hover:text-green-400 font-medium">
                                  {lead.phone as string}
                                </a>
                              </div>
                            )}
                            {lead.location && (
                              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg border border-border">
                                <MapPin className="h-5 w-5 text-muted-foreground" />
                                <span className="font-medium">{lead.location as string}</span>
                              </div>
                            )}
                          </div>

                          {/* Company Information */}
                          {(lead.company_name || lead.industry_sector || lead.company_size || lead.website_url) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 p-4 bg-muted rounded-lg border border-border">
                              {lead.company_name && (
                                <div className="flex items-center gap-2">
                                  <Building className="h-4 w-4 text-muted-foreground" />
                                  <span className="font-medium">{lead.company_name as string}</span>
                                </div>
                              )}
                              {lead.industry_sector && (
                                <div className="flex items-center gap-2">
                                  <Tag className="h-4 w-4 text-muted-foreground" />
                                  <span className="capitalize">{lead.industry_sector as string}</span>
                                </div>
                              )}
                              {lead.company_size && (
                                <div className="flex items-center gap-2">
                                  <Users className="h-4 w-4 text-muted-foreground" />
                                  <span>{lead.company_size as string} employees</span>
                                </div>
                              )}
                              {lead.website_url && (
                                <div className="flex items-center gap-2">
                                  <Globe className="h-4 w-4 text-muted-foreground" />
                                  <a 
                                    href={(lead.website_url as string).startsWith('http') ? lead.website_url as string : `https://${lead.website_url}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:text-primary/80 flex items-center gap-1 font-medium"
                                  >
                                    Visit Website
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Expanded Details */}
                          {isExpanded && (
                            <div className="space-y-6 mt-6 pt-6 border-t border-border">
                              {lead.pain_points && (
                                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                                  <h4 className="font-semibold mb-2 flex items-center gap-2 text-red-400">
                                    <MessageSquare className="h-4 w-4" />
                                    Pain Points
                                  </h4>
                                  <p className="text-red-300 leading-relaxed">
                                    {lead.pain_points as string}
                                  </p>
                                </div>
                              )}
                              
                              {lead.notes && (
                                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                                  <h4 className="font-semibold mb-2 flex items-center gap-2 text-yellow-400">
                                    <MessageSquare className="h-4 w-4" />
                                    Notes
                                  </h4>
                                  <p className="text-yellow-300 leading-relaxed">
                                    {lead.notes as string}
                                  </p>
                                </div>
                              )}
                              
                              {lead.social_links && (
                                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                                  <h4 className="font-semibold mb-2 flex items-center gap-2 text-blue-400">
                                    <Globe className="h-4 w-4" />
                                    Social Links
                                  </h4>
                                  <p className="text-blue-300">
                                    {lead.social_links as string}
                                  </p>
                                </div>
                              )}
                              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground bg-muted rounded-lg p-4">
                                {lead.created_at && (
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    <span><strong>Created:</strong> {new Date(lead.created_at as string).toLocaleDateString()}</span>
                                  </div>
                                )}
                                {lead.updated_at && (
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    <span><strong>Updated:</strong> {new Date(lead.updated_at as string).toLocaleDateString()}</span>
                                  </div>
                                )}
                                {lead.last_contacted_at && (
                                  <div className="flex items-center gap-2">
                                    <MessageSquare className="h-4 w-4" />
                                    <span><strong>Last Contact:</strong> {new Date(lead.last_contacted_at as string).toLocaleDateString()}</span>
                                  </div>
                                )}
                              </div>
                              
                              {/* Outreach Form */}
                              <div className="pt-4">
                                <div className="p-4 bg-muted rounded-lg border border-border">
                                  <p className="text-sm text-muted-foreground">Outreach form will be implemented soon.</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Add Lead Modal */}
          <Dialog open={showAddForm} onOpenChange={(open) => !open && handleCloseModal()}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingLead ? "Edit Lead" : "Add New Lead"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                {/* Personal Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b border-border pb-2 text-white">
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="first_name" className="font-medium text-white">First Name</Label>
                      <Input
                        id="first_name"
                        type="text"
                        value={form.first_name}
                        onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <Label htmlFor="last_name" className="font-medium text-white">Last Name</Label>
                      <Input
                        id="last_name"
                        type="text"
                        value={form.last_name}
                        onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email" className="font-medium text-white">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="john@company.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="font-medium text-white">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+1234567890"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="role_title" className="font-medium text-white">Job Title/Role</Label>
                    <Input
                      id="role_title"
                      type="text"
                      value={form.role_title}
                      onChange={(e) => setForm({ ...form, role_title: e.target.value })}
                      placeholder="CEO, Manager, Developer..."
                    />
                  </div>
                </div>

                {/* Company Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b border-border pb-2 text-white">
                    Company Information
                  </h3>
                  <div>
                    <Label htmlFor="company_name" className="font-medium text-white">Company Name</Label>
                    <Input
                      id="company_name"
                      type="text"
                      value={form.company_name}
                      onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                      placeholder="Acme Corporation"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="industry_sector" className="font-medium text-white">Industry</Label>
                      <Select value={form.industry_sector} onValueChange={(value) => setForm({ ...form, industry_sector: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="retail">Retail</SelectItem>
                          <SelectItem value="manufacturing">Manufacturing</SelectItem>
                          <SelectItem value="consulting">Consulting</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="company_size" className="font-medium text-white">Company Size</Label>
                      <Select value={form.company_size} onValueChange={(value) => setForm({ ...form, company_size: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-10">1-10</SelectItem>
                          <SelectItem value="11-50">11-50</SelectItem>
                          <SelectItem value="51-200">51-200</SelectItem>
                          <SelectItem value="201-500">201-500</SelectItem>
                          <SelectItem value="501-1000">501-1000</SelectItem>
                          <SelectItem value="1000+">1000+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="location" className="font-medium text-white">Location</Label>
                      <Input
                        id="location"
                        type="text"
                        value={form.location}
                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                        placeholder="New York, NY"
                      />
                    </div>
                    <div>
                      <Label htmlFor="website_url" className="font-medium text-white">Website URL</Label>
                      <Input
                        id="website_url"
                        type="url"
                        value={form.website_url}
                        onChange={(e) => setForm({ ...form, website_url: e.target.value })}
                        placeholder="https://company.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Business Context Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b border-border pb-2 text-white">
                    Business Context
                  </h3>
                  <div>
                    <Label htmlFor="social_links" className="font-medium text-white">Social Links</Label>
                    <Input
                      id="social_links"
                      type="text"
                      value={form.social_links}
                      onChange={(e) => setForm({ ...form, social_links: e.target.value })}
                      placeholder="LinkedIn, Twitter, etc."
                    />
                  </div>
                  <div>
                    <Label htmlFor="pain_points" className="font-medium text-white">Pain Points</Label>
                    <Textarea
                      id="pain_points"
                      value={form.pain_points}
                      onChange={(e) => setForm({ ...form, pain_points: e.target.value })}
                      placeholder="What challenges is the prospect facing?"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes" className="font-medium text-white">Notes</Label>
                    <Textarea
                      id="notes"
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      placeholder="Additional notes about this lead..."
                      rows={3}
                    />
                  </div>
                </div>

                {/* Lead Management Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b border-border pb-2 text-white">
                    Lead Management
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="stage" className="font-medium text-white">Stage</Label>
                      <Select value={form.stage} onValueChange={(value) => setForm({ ...form, stage: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="captured">Captured</SelectItem>
                          <SelectItem value="qualified">Qualified</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="meeting_booked">Meeting Booked</SelectItem>
                          <SelectItem value="disqualified">Disqualified</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="source" className="font-medium text-white">Source</Label>
                      <Select value={form.source} onValueChange={(value) => setForm({ ...form, source: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="website">Website</SelectItem>
                          <SelectItem value="sms">SMS</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="call">Call</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="score" className="font-medium text-white">Score (0-100)</Label>
                      <Input
                        id="score"
                        type="number"
                        min="0"
                        max="100"
                        value={form.score}
                        onChange={(e) => setForm({ ...form, score: e.target.value })}
                        placeholder="85"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-border">
                  <Button 
                    variant="outline" 
                    onClick={handleCloseModal}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    onClick={(e) => handleSubmit(e, !!editingLead)}
                    disabled={!canSubmit}
                  >
                    {editingLead ? "Update Lead" : "Add Lead"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};

// Placeholder OutreachForm component (simplified)
const OutreachForm = ({ leadId, onSave }: { leadId: string; onSave: (payload: OutreachEventInput) => void }) => {
  return null; // Placeholder for now
};