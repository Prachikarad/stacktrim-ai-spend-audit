import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export async function saveLead(leadData) {
  const { data, error } = await supabase.from("leads").insert([
    {
      email: leadData.email,
      company_name: leadData.companyName,
      role: leadData.role,
      team_size: leadData.teamSize,
      monthly_savings: leadData.monthlySavings,
      annual_savings: leadData.annualSavings,
      created_at: new Date().toISOString(),
      report_url: leadData.reportUrl,
    },
  ]);

  if (error) {
    console.error("Error saving lead:", error);
    throw error;
  }

  return data;
}

export async function getAuditReport(reportId) {
  const { data, error } = await supabase
    .from("audit_reports")
    .select("*")
    .eq("id", reportId)
    .single();

  if (error) {
    console.error("Error fetching report:", error);
    throw error;
  }

  return data;
}

export async function saveAuditReport(report) {
  const { data, error } = await supabase.from("audit_reports").insert([
    {
      id: report.id,
      team_size: report.teamSize,
      primary_use: report.primaryUse,
      tools: JSON.stringify(report.tools),
      monthly_savings: report.monthlySavings,
      annual_savings: report.annualSavings,
      ai_summary: report.aiSummary,
      created_at: new Date().toISOString(),
    },
  ]);

  if (error) {
    console.error("Error saving audit report:", error);
    throw error;
  }

  return data;
}
