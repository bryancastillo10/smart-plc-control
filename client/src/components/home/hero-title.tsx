import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

const HeroTitle = () => {
  return (
	      <div className="space-y-6">
          <Badge variant="secondary" className="bg-white/10 text-slate-100">
            Industrial Monitoring Platform
          </Badge>
          <h1 className="font-['Avenir_Next','Segoe_UI',sans-serif] text-4xl font-semibold leading-tight tracking-tight text-balance md:text-5xl lg:text-6xl">
            Operate your PLC systems with confidence and clarity.
          </h1>
          <p className="max-w-xl text-lg text-slate-300">
            Smart PLC Control gives your team one dashboard for live plant
            telemetry, valve behavior, and safer control decisions.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/sign-in">Launch Dashboard</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-slate-200/30 bg-white/5 text-slate-100 hover:bg-white/15"
            >
              <a href="#features">Explore Features</a>
            </Button>
          </div>
    </div>
  )
}

export default HeroTitle;
