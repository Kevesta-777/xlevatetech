import React, { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Lead {
  [key: string]: any;
  id: string;
  phone?: string;
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

const Leads: React.FC = () => {
  const qc = useQueryClient();

  const { data: leads, isLoading, isError } = useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("*") as any;
      if (error) throw error;
      console.log("Leads data:", data);
      return data ?? [];
    },
  });

  const createLead = useMutation({
    mutationFn: async (payload: any) => {
      const { data, error } = await supabase.from("leads").insert([
        {
          first_name: payload.first_name || payload.name || "",
          last_name: payload.last_name || "",
          email: payload.email,
          phone: payload.phone,
          source: payload.source || "warm_manual",
        },
      ]).select("id");
      if (error) throw error;
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
    name: "",
    email: "",
    phone: "",
    preferred_contact: "",
    tags: "",
    source: "warm_manual",
  });

  const canSubmit = useMemo(() => {
    // Basic checks; phone optional but must match if provided
    const phoneOk = !form.phone || phoneE164.test(form.phone.trim());
    return phoneOk && (!!form.email || !!form.name || !!form.phone);
  }, [form]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    const tags = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    createLead.mutate({
      first_name: form.name || "",
      last_name: "",
      email: form.email || null,
      phone: form.phone || null,
      source: form.source,
    });

    setForm({ name: "", email: "", phone: "", preferred_contact: "", tags: "", source: "warm_manual" });
  };

  return (
    <>
      <Helmet>
        <title>Leads CRM | Manage Contacts and Outreach</title>
        <meta name="description" content="Manage leads and log outreach events. Add contacts, track SMS/Email/Call activity, and streamline follow-ups." />
        <link rel="canonical" href="https://xlevatetech.com/leads" />
      </Helmet>

      <main className="container mx-auto px-4 py-10">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">Leads CRM</h1>
          <p className="text-muted-foreground mt-2">Create leads and log outreach across channels.</p>
        </header>

        <section className="grid gap-6 md:grid-cols-2" aria-labelledby="add-lead">
          <Card>
            <CardHeader>
              <CardTitle id="add-lead">Add Lead</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4" aria-label="Create new lead">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Jane Doe" />
                </div>
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
                <div className="grid gap-2">
                  <Label htmlFor="preferred_contact">Preferred Contact</Label>
                  <Input id="preferred_contact" value={form.preferred_contact} onChange={(e) => setForm((f) => ({ ...f, preferred_contact: e.target.value }))} placeholder="sms | email | call" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input id="tags" value={form.tags} onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))} placeholder="Family, Friends" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="source">Source</Label>
                  <Input id="source" value={form.source} onChange={(e) => setForm((f) => ({ ...f, source: e.target.value }))} placeholder="warm_manual" />
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
                    const displayName = fullName || lead.email || lead.phone || "(no name)";
                    
                    return (
                      <li key={lead.id} className="border rounded-md p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-medium">{displayName}</p>
                            <p className="text-sm text-muted-foreground">
                              {lead.email || "—"} • {lead.phone || "—"}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">Source: {lead.source || "—"}</p>
                          </div>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="secondary">Log outreach</Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Log outreach</DialogTitle>
                                <DialogDescription>Record an interaction for this lead.</DialogDescription>
                              </DialogHeader>
                              <OutreachForm
                                onSave={(payload) => logOutreach.mutate({ ...payload, lead_id: lead.id })}
                              />
                            </DialogContent>
                          </Dialog>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </CardContent>
          </Card>
        </section>
      </main>
    </>
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
    <form
      className="space-y-4"
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
          lead_id: "", // will be overridden by parent
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
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
};

export default Leads;
