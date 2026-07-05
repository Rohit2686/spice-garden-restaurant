import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Admin-Token",
};

// Admin credentials (in production, use Supabase Auth or a secrets manager)
const ADMIN_EMAIL = "admin@spicegarden.demo";
const ADMIN_PASSWORD = "spicegarden123";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    // Validate admin token from header
    const adminToken = req.headers.get("X-Admin-Token");
    if (!adminToken) {
      return new Response(
        JSON.stringify({ error: "Missing admin token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse token (format: "email:password")
    const decoded = atob(adminToken);
    const [email, password] = decoded.split(":");
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return new Response(
        JSON.stringify({ error: "Invalid credentials" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const url = new URL(req.url);
    const method = req.method;
    const body = method !== "GET" ? await req.json().catch(() => ({})) : {};

    // GET: List all menu items
    if (method === "GET") {
      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .order("category_id")
        .order("sort_order");

      if (error) throw error;
      return new Response(
        JSON.stringify(data),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // POST: Create new menu item
    if (method === "POST") {
      const { data, error } = await supabase
        .from("menu_items")
        .insert(body)
        .select()
        .single();

      if (error) throw error;
      return new Response(
        JSON.stringify(data),
        { status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // PUT: Update menu item
    if (method === "PUT") {
      const { id, ...updates } = body;
      if (!id) {
        return new Response(
          JSON.stringify({ error: "Missing item id" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { data, error } = await supabase
        .from("menu_items")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return new Response(
        JSON.stringify(data),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // DELETE: Delete menu item
    if (method === "DELETE") {
      const { id } = body;
      if (!id) {
        return new Response(
          JSON.stringify({ error: "Missing item id" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { error } = await supabase
        .from("menu_items")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
