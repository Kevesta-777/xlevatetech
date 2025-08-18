import React, { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Lead {
  [key: string]: any;
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
  adminUser: { id: string; email?: string | null } | null;
}

export const AdminLeads: React.FC<AdminLeadsProps> = ({ adminUser }) => {
  const qc = useQueryClient();

  const { data: leads, isLoading, isError } = useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      console.log("AdminLeads: Fetching leads from Supabase...");
      const { data, error } = await supabase
        .from("leads")
        .select("*") as any;
      
      if (error) {
        console.error("AdminLeads: Error fetching leads:", error);
        throw error;
      }
      
      console.log("AdminLeads: Successfully fetched leads:", data);
      return data ?? [];
    },
  });

  const createLead = useMutation({
    mutationFn: async (payload: Omit<Lead, "id" | "created_at" | "last_contacted_at">) => {
      console.log("AdminLeads: Creating lead with payload:", payload);
      const { data, error } = await supabase
        .from("leads")
        .insert([{
          first_name: payload.first_name || null,
          last_name: payload.last_name || null,
          email: payload.email || null,
          phone: payload.phone || null,
          company_name: payload.company_name || null,
          industry_sector: payload.industry_sector || null,
          location: payload.location || null,
          company_size: payload.company_size || null,
          website_url: payload.website_url || null,
          role_title: payload.role_title || null,
          social_links: payload.social_links || null,
          pain_points: payload.pain_points || null,
          notes: payload.notes || null,
          score: payload.score || null,
          stage: payload.stage || 'captured',
          source: payload.source || 'sms',
        }])
        .select("id");
      
      if (error) {
        console.error("AdminLeads: Error creating lead:", error);
        throw error;
      }
      
      console.log("AdminLeads: Successfully created lead:", data);
      return data?.[0];
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leads"] });
      toast({ title: "Lead created", description: "Your lead has been added." });
    },
    onError: (err: any) => {
      toast({ title: "Failed to create lead", description: err.message ?? String(err) });
    },
  });

  const logOutreach = useMutation({
    mutationFn: async (payload: OutreachEventInput) => {
      const { data: authData } = await supabase.auth.getUser();
      const userId = authData?.user?.id as string;
      const { error } = await supabase.from("lead_outreach_events").insert([
        {
          lead_id: payload.lead_id,
          user_id: userId,
          channel: payload.channel ?? undefined,
          direction: payload.direction ?? undefined,
          version_sent: payload.version_sent ?? undefined,
          campaign_name: payload.campaign_name ?? undefined,
          content: payload.content ?? undefined,
          replied: payload.replied ?? false,
          booked: payload.booked ?? false,
          referrals: payload.referrals ?? 0,
          clicks: payload.clicks ?? 0,
        },
      ] as any);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Outreach logged", description: "Event saved." });
    },
    onError: (err: any) => {
      toast({ title: "Failed to log outreach", description: err.message ?? String(err) });
    },
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    createLead.mutate({
      first_name: form.first_name || null,
      last_name: form.last_name || null,
      email: form.email || null,
      phone: form.phone || null,
      company_name: form.company_name || null,
      industry_sector: form.industry_sector || null,
      location: form.location || null,
      company_size: form.company_size || null,
      website_url: form.website_url || null,
      role_title: form.role_title || null,
      social_links: form.social_links || null,
      pain_points: form.pain_points || null,
      notes: form.notes || null,
      score: form.score ? parseInt(form.score) : null,
      stage: form.stage,
      source: form.source,
    });

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
    <section className="grid gap-6 md:grid-cols-2" aria-labelledby="leads-crm">
      <div className="md:col-span-2">
        <h2 id="leads-crm" className="text-2xl font-semibold">Leads CRM</h2>
        <p className="text-muted-foreground mt-1">Create leads and log outreach across channels.</p>
      </div>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Add Lead</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6" aria-label="Create new lead">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input id="first_name" value={form.first_name} onChange={(e) => setForm((f) => ({ ...f, first_name: e.target.value }))} placeholder="Jane" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input id="last_name" value={form.last_name} onChange={(e) => setForm((f) => ({ ...f, last_name: e.target.value }))} placeholder="Doe" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="jane@example.com" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone (E.164)</Label>
                  <Input id="phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="+15551234567" />
                  {form.phone && !phoneE164.test(form.phone) && (
                    <p className="text-destructive text-sm">Use E.164 format, e.g., +15551234567</p>
                  )}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role_title">Job Title</Label>
                <Input id="role_title" value={form.role_title} onChange={(e) => setForm((f) => ({ ...f, role_title: e.target.value }))} placeholder="CEO, Manager, Developer, etc." />
              </div>
            </div>

            {/* Company Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Company Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="company_name">Company Name</Label>
                  <Input id="company_name" value={form.company_name} onChange={(e) => setForm((f) => ({ ...f, company_name: e.target.value }))} placeholder="Acme Corp" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="industry_sector">Industry Sector</Label>
                  <Select value={form.industry_sector} onValueChange={(value) => setForm((f) => ({ ...f, industry_sector: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="consulting">Consulting</SelectItem>
                      <SelectItem value="real_estate">Real Estate</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} placeholder="City, State/Country" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="company_size">Company Size</Label>
                  <Select value={form.company_size} onValueChange={(value) => setForm((f) => ({ ...f, company_size: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10 employees</SelectItem>
                      <SelectItem value="11-50">11-50 employees</SelectItem>
                      <SelectItem value="51-200">51-200 employees</SelectItem>
                      <SelectItem value="201-500">201-500 employees</SelectItem>
                      <SelectItem value="501-1000">501-1000 employees</SelectItem>
                      <SelectItem value="1000+">1000+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="website_url">Website URL</Label>
                <Input id="website_url" type="url" value={form.website_url} onChange={(e) => setForm((f) => ({ ...f, website_url: e.target.value }))} placeholder="https://example.com" />
              </div>
            </div>

            {/* Business Context */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Business Context</h3>
              <div className="grid gap-2">
                <Label htmlFor="pain_points">Pain Points</Label>
                <Textarea id="pain_points" value={form.pain_points} onChange={(e) => setForm((f) => ({ ...f, pain_points: e.target.value }))} placeholder="What challenges are they facing? What problems do they need solved?" rows={3} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="social_links">Social Media Links</Label>
                <Input id="social_links" value={form.social_links} onChange={(e) => setForm((f) => ({ ...f, social_links: e.target.value }))} placeholder="LinkedIn, Twitter, etc. (comma separated)" />
              </div>
            </div>

            {/* Lead Management */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Lead Management</h3>
              {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="source">Lead Source</Label>
                  <Select value={form.source} onValueChange={(value) => setForm((f) => ({ ...f, source: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="website">website</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="stage">Lead Stage</Label>
                  <Select value={form.stage} onValueChange={(value) => setForm((f) => ({ ...f, stage: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select stage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="captured">Captured</SelectItem>
                      <SelectItem value="qualified">Qualified</SelectItem>
                      <SelectItem value="disqualified">Disqualified</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="meeting_booked">Meeting booked</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="score">Lead Score (1-100)</Label>
                  <Input id="score" type="number" min="1" max="100" value={form.score} onChange={(e) => setForm((f) => ({ ...f, score: e.target.value }))} placeholder="75" />
                </div>
              </div> */}
              <div className="grid gap-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea id="notes" value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} placeholder="Any additional information about this lead..." rows={3} />
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={!canSubmit || createLead.isPending}>Create Lead</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Leads</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <p className="text-sm text-muted-foreground">Loading...</p>}
          {isError && <p className="text-sm text-destructive">Failed to load leads.</p>}
          {!isLoading && !isError && (
            <ul className="space-y-4">
              {(leads ?? []).map((lead: any) => {
                const fullName = `${lead.first_name || ''} ${lead.last_name || ''}`.trim();
                const displayName = fullName || lead.email || lead.phone || lead.company_name || "(no name)";
                console.log("Lead data:", lead);
                
                return (
                  <li key={lead.id} className="border rounded-md p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="font-medium">{displayName}</p>
                        <p className="text-sm text-muted-foreground">
                          {lead.email || "—"} • {lead.phone || "—"}
                        </p>
                        {lead.company_name && (
                          <p className="text-sm text-muted-foreground">
                            Company: {lead.company_name}
                            {lead.industry_sector && ` • ${lead.industry_sector}`}
                            {lead.location && ` • ${lead.location}`}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          Source: {lead.source} • Stage: {lead.stage || 'captured'}
                          {lead.score && ` • Score: ${lead.score}`}
                        </p>
                        {lead.last_contacted_at && (
                          <p className="text-xs text-muted-foreground">
                            Last contacted: {new Date(lead.last_contacted_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <OutreachForm
                        onSave={(payload) => logOutreach.mutate({ ...payload, lead_id: lead.id })}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </section>
  );
};

const OutreachForm: React.FC<{ onSave: (p: OutreachEventInput) => void }> = ({ onSave }) => {
  const [state, setState] = useState({
    channel: "sms",
    direction: "outbound",
    version_sent: "",
    campaign_name: "warm_manual",
    content: "",
    replied: false,
    booked: false,
    referrals: 0,
    clicks: 0,
  });

  return (
    <div className="w-full max-w-sm">
      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          onSave({
            channel: state.channel,
            direction: state.direction,
            version_sent: state.version_sent || null,
            campaign_name: state.campaign_name,
            content: state.content || null,
            replied: state.replied,
            booked: state.booked,
            referrals: state.referrals,
            clicks: state.clicks,
            lead_id: "", // overridden by parent
          });
        }}
      >
        <div className="grid gap-2">
          <Label htmlFor="channel">Channel</Label>
          <Input id="channel" value={state.channel} onChange={(e) => setState((s) => ({ ...s, channel: e.target.value }))} placeholder="sms | email | call" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="direction">Direction</Label>
          <Input id="direction" value={state.direction} onChange={(e) => setState((s) => ({ ...s, direction: e.target.value }))} placeholder="outbound | inbound" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="version_sent">Version sent</Label>
          <Input id="version_sent" value={state.version_sent} onChange={(e) => setState((s) => ({ ...s, version_sent: e.target.value }))} placeholder="v1" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="campaign_name">Campaign name</Label>
          <Input id="campaign_name" value={state.campaign_name} onChange={(e) => setState((s) => ({ ...s, campaign_name: e.target.value }))} placeholder="warm_manual" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="content">Content</Label>
          <Textarea id="content" value={state.content} onChange={(e) => setState((s) => ({ ...s, content: e.target.value }))} placeholder="Message body" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input id="replied" type="checkbox" checked={state.replied} onChange={(e) => setState((s) => ({ ...s, replied: e.target.checked }))} />
            <Label htmlFor="replied">Replied</Label>
          </div>
          <div className="flex items-center gap-2">
            <input id="booked" type="checkbox" checked={state.booked} onChange={(e) => setState((s) => ({ ...s, booked: e.target.checked }))} />
            <Label htmlFor="booked">Booked</Label>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="referrals">Referrals</Label>
            <Input id="referrals" type="number" value={state.referrals} onChange={(e) => setState((s) => ({ ...s, referrals: Number(e.target.value) }))} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="clicks">Clicks</Label>
            <Input id="clicks" type="number" value={state.clicks} onChange={(e) => setState((s) => ({ ...s, clicks: Number(e.target.value) }))} />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="submit" size="sm">Save</Button>
        </div>
      </form>
    </div>
  );
};
