import { WorkflowCanvas, type FlowEdge, type FlowNode, type FlowStep } from "@/registry/veyl/workflow-canvas";

/* The data sits outside the component, so it keeps the same identity between renders. */

const nodes: FlowNode[] = [
  { id: "trig", label: "New signup", x: 60, y: 200, icon: "webhook" },
  { id: "look", label: "Find the account", x: 190, y: 108, icon: "db", tint: "#2f7bf0" },
  { id: "agent", label: "Qualify the lead", x: 360, y: 200, icon: "bot", kind: "agent", tint: "#7b5cf0" },
  { id: "parse", label: "Score the lead", x: 520, y: 200, icon: "braces" },
  { id: "ask", label: "Ask the team", x: 650, y: 200, icon: "chat", tint: "#12a36b" },
  { id: "model", label: "AI model", x: 228, y: 345, icon: "spark", kind: "tool", tint: "#7b5cf0" },
  { id: "docs", label: "Read the docs", x: 316, y: 345, icon: "book", kind: "tool", tint: "#d9822b" },
  { id: "web", label: "Search the web", x: 404, y: 345, icon: "globe", kind: "tool", tint: "#2f7bf0" },
  { id: "crm", label: "Check the CRM", x: 492, y: 345, icon: "users", kind: "tool", tint: "#12a36b" },
  { id: "split", label: "Qualified?", x: 850, y: 200, icon: "split", hidden: true },
  { id: "mail", label: "Send welcome email", x: 970, y: 112, icon: "mail", hidden: true, tint: "#2f7bf0" },
  { id: "ping", label: "Notify sales", x: 970, y: 288, icon: "bell", hidden: true, tint: "#d9822b" },
  { id: "log", label: "Log the result", x: 1090, y: 200, icon: "bolt", hidden: true, tint: "#12a36b" },
];

/* One colour for each stretch of the flow */
const edges: FlowEdge[] = [
  { from: "trig", to: "look", color: "#e9b95e" },
  { from: "look", to: "agent", color: "#e9b95e" },
  { from: "agent", to: "parse", color: "#5b9cff" },
  { from: "parse", to: "ask", color: "#5b9cff" },
  { from: "agent", to: "model", color: "#a78bfa" },
  { from: "agent", to: "docs", color: "#a78bfa" },
  { from: "agent", to: "web", color: "#a78bfa" },
  { from: "agent", to: "crm", color: "#a78bfa" },
  { from: "ask", to: "split", color: "#3ecf8e" },
  { from: "split", to: "mail", color: "#ff8fa8" },
  { from: "split", to: "ping", color: "#fb923c" },
  { from: "mail", to: "log", color: "#38bdf8" },
  { from: "ping", to: "log", color: "#38bdf8" },
];

const steps: FlowStep[] = [
  {
    type: "connect",
    from: "trig",
    to: "look",
    then: [["look", "agent"], ["agent", "parse"], ["agent", "model"], ["agent", "docs"], ["agent", "web"], ["agent", "crm"], ["parse", "ask"]],
  },
  { type: "reveal", nodes: ["split", "mail", "ping", "log"], at: { x: 765, y: 200 } },
  { type: "connect", from: "ask", to: "split", then: [["split", "mail"], ["split", "ping"]] },
  { type: "connect", from: "mail", to: "log", then: [["ping", "log"]] },
];

export function WorkflowCanvasDemo() {
  return (
    <div className="px-4 py-10">
      <WorkflowCanvas
        title="Every step, in plain sight"
        description="Follow a workflow from the first trigger to the last action. Nothing is hidden, and every step explains itself."
        nodes={nodes}
        edges={edges}
        steps={steps}
      />
    </div>
  );
}